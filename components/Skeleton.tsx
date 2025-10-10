export default function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-neutral-800 rounded ${className}`} />
  )
}

export function CardSkeleton() {
  return (
    <div className="bg-neutral-900/50 border border-gray-200 dark:border-gray-700 rounded-2xl p-8">
      <Skeleton className="h-16 w-16 rounded-2xl mb-6" />
      <Skeleton className="h-6 w-3/4 mb-4" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-5/6" />
    </div>
  )
}

export function TestimonialSkeleton() {
  return (
    <div className="bg-neutral-900/50 border border-gray-200 dark:border-gray-700 rounded-2xl p-8">
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="w-4 h-4" />
        ))}
      </div>
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-3/4 mb-6" />
      <div className="flex items-center gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
        <Skeleton className="w-12 h-12 rounded-full" />
        <div className="flex-1">
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>
    </div>
  )
}
