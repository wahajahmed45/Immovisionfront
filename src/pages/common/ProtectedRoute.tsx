'use client'
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { getUserRole, getUserAcls } from '@/stores/auth/auth';
 
export const ProtectedRoute = ({requiredPermissions = [] }) => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userRole = getUserRole();
    const userAcls = getUserAcls();

    // Check if user is logged in
    if (!token) {
      router.replace('/login');
      return;
    }

    

    // Check permissions if specified
    if (requiredPermissions.length > 0) {
      const hasAllPermissions = requiredPermissions.every(perm => 
        userAcls.includes(perm)
      );

      if (!hasAllPermissions) {
        router.replace('/unauthorized');
        return;
      }
    }
  }, []);

  return requiredPermissions;
};
export default ProtectedRoute;