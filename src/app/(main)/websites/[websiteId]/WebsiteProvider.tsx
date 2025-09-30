'use client';
import { createContext, ReactNode, useEffect } from 'react';
import { useModified, useWebsite } from '@/components/hooks';
import { Loading } from 'react-basics';

export const WebsiteContext = createContext(null);

export function WebsiteProvider({
  websiteId,
  children,
}: {
  websiteId: string;
  children: ReactNode;
}) {
  const { modified } = useModified(`website:${websiteId}`);
  const { data: website, isFetching, isLoading, error, refetch } = useWebsite(websiteId);

  useEffect(() => {
    if (modified) {
      refetch();
    }
  }, [modified]);

  if (isFetching && isLoading) {
    return <Loading position="page" />;
  }

  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>Error loading website data. Please try refreshing the page.</p>
        <button onClick={() => refetch()}>Retry</button>
      </div>
    );
  }

  if (!website) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>Website not found.</p>
      </div>
    );
  }

  return <WebsiteContext.Provider value={website}>{children}</WebsiteContext.Provider>;
}

export default WebsiteProvider;
