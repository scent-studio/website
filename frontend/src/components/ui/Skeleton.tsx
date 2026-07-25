import React from 'react';
import { cn } from '../../lib/utils';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'image' | 'card' | 'product' | 'avatar';
}

function SkeletonBase({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'animate-shimmer bg-gradient-to-r from-luxury-border via-luxury-ivory to-luxury-border bg-[length:200%_100%] rounded-lg',
        className
      )}
    />
  );
}

export function TextSkeleton({ className }: { className?: string }) {
  return <SkeletonBase className={cn('h-4 w-full', className)} />;
}

export function ImageSkeleton({ className }: { className?: string }) {
  return <SkeletonBase className={cn('w-full aspect-square', className)} />;
}

export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('p-4 border border-luxury-border rounded-xl', className)}>
      <ImageSkeleton />
      <div className="mt-4 space-y-2">
        <SkeletonBase className="h-4 w-3/4" />
        <SkeletonBase className="h-4 w-1/2" />
        <SkeletonBase className="h-4 w-1/4" />
      </div>
    </div>
  );
}

export function AvatarSkeleton({ className }: { className?: string }) {
  return <SkeletonBase className={cn('h-10 w-10 rounded-full', className)} />;
}

export function ProductCardSkeleton() {
  return (
    <div className="border border-luxury-border rounded-xl overflow-hidden bg-luxury-white">
      <SkeletonBase className="w-full aspect-[3/4]" />
      <div className="p-5 space-y-3">
        <SkeletonBase className="h-3 w-1/3" />
        <SkeletonBase className="h-5 w-4/5" />
        <SkeletonBase className="h-4 w-1/2" />
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonBase key={i} className="h-3 w-3" />
          ))}
        </div>
        <SkeletonBase className="h-10 w-full mt-3" />
      </div>
    </div>
  );
}

export default function Skeleton({
  className,
  variant = 'text',
}: SkeletonProps) {
  switch (variant) {
    case 'image':
      return <ImageSkeleton className={className} />;
    case 'card':
      return <CardSkeleton className={className} />;
    case 'product':
      return <ProductCardSkeleton />;
    case 'avatar':
      return <AvatarSkeleton className={className} />;
    default:
      return <TextSkeleton className={className} />;
  }
}
