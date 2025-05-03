import { createClient } from '@supabase/supabase-js';

// 从环境变量中获取Supabase URL和服务角色密钥
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// 创建Supabase管理员客户端，使用服务角色密钥
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

// 调试函数，用于检查Supabase管理员配置
export const checkSupabaseAdminConfig = () => {
  console.log('Supabase URL:', supabaseUrl);
  console.log('Supabase Service Role Key:', supabaseServiceRoleKey ? '已设置' : '未设置');
  return { supabaseUrl, hasServiceRoleKey: !!supabaseServiceRoleKey };
};
