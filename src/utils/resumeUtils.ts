/**
 * 根据简历数据生成个人摘要
 * @param resumeData 简历解析数据
 * @returns 生成的个人摘要
 */
/* eslint-disable  @typescript-eslint/no-explicit-any */
export const generateSummaryFromResumeData = (resumeData: any): string => {
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
