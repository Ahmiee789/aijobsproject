'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'APPLICANT' | 'EMPLOYER';
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // 如果认证状态已加载完成且用户未登录，重定向到登录页
    if (!loading && !user) {
      router.push(`/login?redirect=${window.location.pathname}`);
    }

    // 如果指定了所需角色，检查用户角色是否匹配
    if (!loading && user && requiredRole && user.role !== requiredRole) {
      // 如果角色不匹配，重定向到首页
      router.push('/');
    }
  }, [user, loading, router, requiredRole]);

  // 如果正在加载或用户未登录，显示加载状态
  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // 如果指定了所需角色且用户角色不匹配，显示无权限信息
  if (requiredRole && user.role !== requiredRole) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">无权限访问</h1>
        <p className="text-gray-600">您没有权限访问此页面</p>
      </div>
    );
  }

  // 如果用户已登录且角色匹配，显示子组件
  return <>{children}</>;
}
