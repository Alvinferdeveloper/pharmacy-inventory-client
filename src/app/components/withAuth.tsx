"use client"
import { useCurrentUser } from '@/app/hooks/useCurrentUser';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  allowedRoles: string[]
) {
  const WithAuthComponent = (props: P) => {
    const { data: currentUser, isLoading, isError } = useCurrentUser();
    const router = useRouter();

    useEffect(() => {
      if (currentUser && !allowedRoles.some(role => currentUser.roles.includes(role))) {
        router.back();
      }
      if (!isLoading && (isError || !currentUser)) {
        router.push('/login');
      }

    }, [currentUser, isLoading, isError, router]);

    if (isLoading || !currentUser || !allowedRoles.some(role => currentUser.roles.includes(role))) {
      return <div>Loading...</div>;
    }

    return <WrappedComponent {...props} />;
  };

  WithAuthComponent.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return WithAuthComponent;
}
