import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import pdfParse from 'pdf-parse';
import fs from 'fs';
import path from 'path';
import os from 'os';

export const maxDuration = 60; // 允许此函数运行最多 60 秒 (1 分钟)

// OpenRouter API配置
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = 'anthropic/claude-3.7-sonnet';

// 从PDF提取文本并上传原始PDF到Supabase
const extractTextFromPdfAndUpload = async (
  fileBuffer: Buffer,
  userId: string,
  bucketName: string
): Promise<{ pageCount: number; pdfText: string; pdfUrl: string }> => {
  try {
    // 创建临时目录
    const tempDir = path.join(os.tmpdir(), `pdf-${Date.now()}`);
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    // 保存PDF到临时文件
    const pdfPath = path.join(tempDir, 'temp.pdf');
    fs.writeFileSync(pdfPath, fileBuffer);

    // 使用pdf-parse提取文本
    const pdfData = await pdfParse(fileBuffer);

    // 获取页数
    const pageCount = pdfData.numpages;

    console.log(`PDF has ${pageCount} pages`);

    // 限制PDF页数
    if (pageCount > 3) {
      // 清理临时文件
      fs.unlinkSync(pdfPath);
      fs.rmSync(tempDir, { recursive: true });
      throw new Error('PDF exceeds the maximum limit of 3 pages');
    }

    // 获取提取的文本
    const pdfText = pdfData.text;

    console.log('Extracted text from PDF:', pdfText.substring(0, 500) + '...');

    // 上传原始PDF到Supabase - 使用固定文件名，确保每个用户只有一个简历
    const pdfName = `${userId}/resume.pdf`;

    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from(bucketName)
      .upload(pdfName, fileBuffer, {
        contentType: 'application/pdf',
        upsert: true,
        cacheControl: '3600'
      });

    if (uploadError) {
      console.error('Error uploading PDF:', uploadError);
      throw uploadError;
    }

    console.log('PDF uploaded successfully:', uploadData);

    // 生成签名URL
    const { data: signedUrlData, error: signedUrlError } = await supabaseAdmin.storage
      .from(bucketName)
      .createSignedUrl(pdfName, 3600); // 3600秒 = 1小时

    if (signedUrlError) {
      console.error('Error creating signed URL for PDF:', signedUrlError);
      throw signedUrlError;
    }

    const pdfUrl = signedUrlData.signedUrl;
    console.log('Generated signed URL for PDF:', pdfUrl);

    // 清理临时文件
    fs.unlinkSync(pdfPath);
    fs.rmSync(tempDir, { recursive: true });

    return { pageCount, pdfText, pdfUrl };
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw error;
  }
};

// 使用OpenRouter的Claude解析简历文本
const parseResumeTextWithClaude = async (pdfText: string) => {
  try {
    console.log('Attempting to parse resume text with Claude...');

    // 构建消息内容
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    const content: any[] = [
      {
        type: 'text',
        text: `You are a resume parser. Your task is to extract structured information from the provided resume text.

I need you to carefully analyze the resume text and extract the following information in JSON format:
- name: The full name of the person
- contact: An object containing email and phone if available
- location: The location or address
- summary: A brief professional summary or objective (IMPORTANT: If no summary is found, DO NOT leave this empty. Instead, generate a concise professional summary based on the person's experience, skills, and education)
- workExperience: An array of jobs, each containing company, title, dates, and description
- education: An array of education entries, each with school, degree, and dates
- skills: An array of professional skills
- languages: An array of languages spoken (IMPORTANT: Pay special attention to any languages mentioned in the resume, including in skills sections or personal details. If languages are mentioned with proficiency levels like "fluent in", "native", etc., include those details)
- certifications: An array of professional certifications

IMPORTANT: This is a real resume, not a test. Do NOT make up or hallucinate any information. Only include information that is explicitly stated in the document, except for the summary which you should generate if not present. For all other fields, if not present in the resume, use an empty string or array as appropriate.

Here is the extracted text from the PDF resume:

${pdfText}

Return ONLY valid JSON without any markdown formatting, explanation, or additional text.`
      }
    ];

    const requestBody = {
      model: MODEL,
      messages: [
        {
          role: 'user',
          content: content
        }
      ],
      temperature: 0.1, // 降低温度，减少创造性
      max_tokens: 4000,
      top_p: 1,
      stream: false
    };

    console.log('Request body:', JSON.stringify(requestBody, null, 2));

    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'https://ai-jobs.example.com', // 替换为您的网站域名
        'X-Title': 'AI Jobs Resume Parser'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // 打印出API响应，以便调试
    console.log('OpenRouter API Response:', JSON.stringify(data, null, 2));

    // 尝试解析JSON响应
    try {
      // 检查响应格式并获取响应文本
      console.log('Full API response:', JSON.stringify(data, null, 2));

      // 获取响应文本
      let responseText = '';
      if (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
        responseText = data.choices[0].message.content;
      } else if (data.output && typeof data.output === 'string') {
        responseText = data.output;
      } else if (data.content && typeof data.content === 'string') {
        responseText = data.content;
      } else {
        responseText = JSON.stringify(data);
      }

      console.log('Extracted response text:', responseText);

      const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/) ||
        responseText.match(/\{[\s\S]*\}/);

      if (jsonMatch) {
        return JSON.parse(jsonMatch[1] || jsonMatch[0]);
      } else {
        return { error: 'Failed to extract JSON from API response' };
      }
    } catch (error) {
      console.error('Error parsing JSON from API response:', error);
      return { error: 'Failed to parse JSON from API response' };
    }
  } catch (error) {
    console.error('Error calling OpenRouter API:', error);
    return { error: 'Failed to parse resume with AI' };
  }
};

// 根据简历数据生成个人摘要
const generateSummary = (resumeData: any): string => {
  try {
    // 提取关键信息
    const name = resumeData.name || '';
    const skills = Array.isArray(resumeData.skills) ? resumeData.skills : [];
    const workExperience = Array.isArray(resumeData.workExperience) ? resumeData.workExperience : [];
    const education = Array.isArray(resumeData.education) ? resumeData.education : [];
    const languages = Array.isArray(resumeData.languages) ? resumeData.languages : [];

    // 获取最近的工作经历
    const latestJob = workExperience.length > 0 ? workExperience[0] : null;
    const latestJobTitle = latestJob?.title || '';
    const latestJobCompany = latestJob?.company || '';

    // 获取最高学历
    const highestEducation = education.length > 0 ? education[0] : null;
    const degree = highestEducation?.degree || '';
    const school = highestEducation?.school || '';

    // 提取前5个技能
    const topSkills = skills.slice(0, 5).join(', ');

    // 构建摘要
    let summary = '';

    if (name) {
      summary += `${name} is `;
    } else {
      summary += 'A professional ';
    }

    if (latestJobTitle) {
      summary += `a ${latestJobTitle}`;
      if (latestJobCompany) {
        summary += ` at ${latestJobCompany}`;
      }
      summary += ' ';
    } else if (degree) {
      summary += `a ${degree} graduate `;
      if (school) {
        summary += ` from ${school} `;
      }
    }

    // 添加技能信息
    if (topSkills) {
      summary += `with expertise in ${topSkills}. `;
    } else {
      summary += '. ';
    }

    // 添加语言信息
    if (languages.length > 0) {
      summary += `Proficient in ${languages.join(', ')}. `;
    }

    // 添加工作经验总结
    if (workExperience.length > 0) {
      const yearsOfExperience = workExperience.length;
      summary += `Has ${yearsOfExperience}+ years of professional experience. `;
    }

    // 添加教育背景
    if (degree && !summary.includes(degree)) {
      summary += `Holds a ${degree}`;
      if (school && !summary.includes(school)) {
        summary += ` from ${school}`;
      }
      summary += '. ';
    }

    // 确保摘要不为空
    if (summary.trim() === '') {
      summary = 'A professional seeking new opportunities in the job market.';
    }

    return summary.trim();
  } catch (error) {
    console.error('Error generating summary:', error);
    return 'A professional with relevant skills and experience seeking new opportunities.';
  }
};

export async function POST(req: NextRequest) {
  try {
    // 验证用户身份
    let userId;

    // 尝试从Authorization头获取令牌
    const authHeader = req.headers.get('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      // 从Authorization头获取令牌
      try {
        // 这里应该有验证令牌的逻辑
        // 简单起见，我们假设令牌是有效的，并从中提取用户ID
        // 在实际应用中，你应该使用适当的方法验证令牌

        // 尝试从next-auth获取令牌
        const nextAuthToken = await getToken({ req });
        if (nextAuthToken && nextAuthToken.sub) {
          userId = nextAuthToken.sub;
        } else {
          // 如果next-auth令牌不可用，尝试从JWT中获取用户ID
          // 这里需要根据你的实际JWT结构进行调整
          // 简单起见，我们假设用户ID可以从某处获取
          userId = "temp-user-id"; // 临时用户ID，实际应用中应该从令牌中提取
        }
      } catch (error) {
        console.error('Error verifying token:', error);
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
      }
    } else {
      // 尝试从next-auth获取令牌
      const token = await getToken({ req });
      if (!token || !token.sub) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      userId = token.sub;
    }

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 使用FormData API处理文件上传
    const formData = await req.formData();
    const file = formData.get('resume') as File;

    if (!file) {
      return NextResponse.json({ error: 'No resume file uploaded' }, { status: 400 });
    }

    // 检查文件类型
    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'Only PDF files are supported' }, { status: 400 });
    }

    // 将File对象转换为ArrayBuffer，然后转换为Buffer
    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);

    // 存储桶名称
    const bucketName = 'resumes';

    try {
      console.log('Processing PDF file...');

      // 从PDF提取文本并上传原始PDF
      const { pageCount, pdfText, pdfUrl } = await extractTextFromPdfAndUpload(fileBuffer, userId, bucketName);

      console.log(`Successfully processed ${pageCount} pages and extracted text`);

      // 使用Claude解析简历文本
      const parsedData = await parseResumeTextWithClaude(pdfText);

      // 创建一个简历对象，使用固定ID
      const resumeId = `resume-${userId}`;
      const createdAt = new Date().toISOString();

      // 确保parsedData中的languages字段是数组
      if (parsedData && !parsedData.languages) {
        parsedData.languages = [];
      }

      // 如果没有summary，生成一个基于其他信息的摘要
      if (parsedData && (!parsedData.summary || parsedData.summary.trim() === '')) {
        parsedData.summary = generateSummary(parsedData);
      }

      return NextResponse.json({
        success: true,
        resume: {
          id: resumeId,
          pdfUrl: pdfUrl,
          pageCount: pageCount,
          parsedData,
          createdAt
        }
      });
    } catch (error: any) {
      console.error('Error processing resume:', error);

      // 检查是否是页数限制错误
      if (error.message && error.message.includes('maximum limit of 3 pages')) {
        return NextResponse.json({
          error: 'PDF exceeds the maximum limit of 3 pages. Please upload a PDF with 3 pages or fewer.'
        }, { status: 400 });
      }

      return NextResponse.json({
        error: `Failed to process resume: ${error.message || 'Unknown error'}`
      }, { status: 500 });
    }
  } catch (error: any) {
    console.error('Error processing resume upload:', error);
    return NextResponse.json({
      error: `Failed to process resume: ${error.message || 'Unknown error'}`
    }, { status: 500 });
  }
}

// 获取用户的所有简历
export async function GET(req: NextRequest) {
  try {
    // 验证用户身份
    let userId;
    const { searchParams } = new URL(req.url);
    const resumeId = searchParams.get('resumeId');

    // 尝试从Authorization头获取令牌
    const authHeader = req.headers.get('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      // 从Authorization头获取令牌
      try {
        // 这里应该有验证令牌的逻辑
        // 简单起见，我们假设令牌是有效的，并从中提取用户ID
        // 在实际应用中，你应该使用适当的方法验证令牌

        // 尝试从next-auth获取令牌
        const nextAuthToken = await getToken({ req });
        if (nextAuthToken && nextAuthToken.sub) {
          userId = nextAuthToken.sub;
        } else {
          // 如果next-auth令牌不可用，尝试从JWT中获取用户ID
          // 这里需要根据你的实际JWT结构进行调整
          // 简单起见，我们假设用户ID可以从某处获取
          userId = "temp-user-id"; // 临时用户ID，实际应用中应该从令牌中提取
        }
      } catch (error) {
        console.error('Error verifying token:', error);
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
      }
    } else {
      // 尝试从next-auth获取令牌
      const token = await getToken({ req });
      if (!token || !token.sub) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      userId = token.sub;
    }

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let listError;
    let files;

    if (resumeId) {
      // 获取特定简历的解析数据
      try {
        // 从存储桶中获取用户的所有简历
        const { data, error } = await supabaseAdmin.storage
          .from('resumes')
          .list(`${userId}/`, {
            limit: 100,
            offset: 0,
            sortBy: { column: 'created_at', order: 'desc' },
          });

        files = data;
        listError = error;

        if (listError) {
          console.error('Error listing files:', listError);
          return NextResponse.json({ error: 'Failed to list resumes' }, { status: 500 });
        }

        const file = (files || []).find(file => file.name === resumeId);

        if (!file) {
          return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
        }

        // 从PDF提取文本并上传原始PDF
        const { data: getObjectData, error: getObjectError } = await supabaseAdmin.storage
          .from('resumes')
          .download(`${userId}/${file.name}`);

        if (getObjectError) {
          console.error('Error getting object:', getObjectError);
          return NextResponse.json({ error: 'Failed to get object' }, { status: 500 });
        }

        const fileBuffer = Buffer.from(await getObjectData.arrayBuffer());

        // 使用pdf-parse提取文本
        const pdfData = await pdfParse(fileBuffer);

        // 获取提取的文本
        const pdfText = pdfData.text;

        // 使用Claude解析简历文本
        const parsedData = await parseResumeTextWithClaude(pdfText);

        return NextResponse.json({ parsedData: parsedData });
      } catch (error) {
        console.error('Error fetching parsed data:', error);
        return NextResponse.json({ error: 'Failed to fetch parsed data' }, { status: 500 });
      }
    }

    // 检查用户的简历是否存在
    const { data, error } = await supabaseAdmin.storage
      .from('resumes')
      .list(`${userId}/`, {
        limit: 1,
      });

    files = data;
    listError = error;

    if (listError) {
      console.error('Error listing files:', listError);
      return NextResponse.json({ error: 'Failed to list resumes' }, { status: 500 });
    }

    // 如果没有文件，返回一个空数组
    if (!files || files.length === 0) {
      return NextResponse.json({ resumes: [] });
    }

    // 如果有文件，使用固定的文件名
    const fileName = 'resume.pdf';

    // 获取文件的签名URL
    const { data: signedUrlData, error: signedUrlError } = await supabaseAdmin.storage
      .from('resumes')
      .createSignedUrl(`${userId}/${fileName}`, 3600);

    if (signedUrlError) {
      console.error('Error creating signed URL:', signedUrlError);
      return NextResponse.json({ error: 'Failed to create signed URL' }, { status: 500 });
    }

    // 使用类型断言告诉TypeScript编译器files不是null
    const safeFiles = files as any[];
    const createdAt = safeFiles.length > 0 && safeFiles[0].created_at
      ? safeFiles[0].created_at
      : new Date().toISOString();

    const resume = {
      id: `resume-${userId}`,
      fileUrl: signedUrlData.signedUrl,
      parsedData: null, // 初始值，可以稍后填充
      createdAt: createdAt,
    };

    return NextResponse.json({ resumes: [resume] });
  } catch (error) {
    console.error('Error fetching resumes:', error);
    return NextResponse.json({ error: 'Failed to fetch resumes' }, { status: 500 });
  }
}
