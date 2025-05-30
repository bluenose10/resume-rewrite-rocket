
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface LoadingSkeletonProps {
  type: 'form' | 'preview' | 'optimization';
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ type }) => {
  if (type === 'form') {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="space-y-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-20 w-full" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    );
  }

  if (type === 'preview') {
    return (
      <div className="space-y-4 p-6">
        <Skeleton className="h-6 w-40" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-4 w-52" />
        </div>
        <div className="space-y-3 mt-6">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        <div className="space-y-3 mt-6">
          <Skeleton className="h-5 w-28" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        </div>
      </div>
    );
  }

  if (type === 'optimization') {
    return (
      <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-3 w-64" />
        </div>
      </div>
    );
  }

  return null;
};

export default LoadingSkeleton;
