import { HTMLAttributes } from "react";

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function Skeleton({ className = "", ...props }: SkeletonProps) {
  return (
    <div
      className={`bg-[#DCFAB7] animate-pulse rounded-[16px] ${className}`}
      {...props}
    />
  );
}

export function SearchResultSkeleton() {
  return (
    <div className="p-4 rounded-[16px] bg-white border border-[#B7F56A] space-y-2">
      <Skeleton className="h-5 w-1/3" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  );
}
