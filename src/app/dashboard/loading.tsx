export default function DashboardLoading() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 pb-24 sm:pb-10 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="h-8 w-40 bg-surface-2 rounded-lg mb-2" />
          <div className="h-4 w-24 bg-surface-2 rounded-md" />
        </div>
        <div className="h-10 w-28 bg-surface-2 rounded-xl" />
      </div>

      {/* List Skeleton */}
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 rounded-2xl border border-border bg-surface gap-4"
          >
            <div className="space-y-3 flex-1">
              <div className="flex items-center gap-2">
                <div className="h-5 w-16 bg-surface-2 rounded-md" />
                <div className="h-4 w-32 bg-surface-2 rounded-md" />
              </div>
              <div className="h-6 w-3/4 max-w-[250px] bg-surface-2 rounded-lg" />
              <div className="flex items-center gap-3">
                <div className="h-4 w-20 bg-surface-2 rounded-md" />
                <div className="h-4 w-16 bg-surface-2 rounded-md" />
              </div>
            </div>
            
            <div className="flex items-center gap-2 mt-4 sm:mt-0 sm:ml-4">
               <div className="h-9 w-24 bg-surface-2 rounded-xl" />
               <div className="h-9 w-9 bg-surface-2 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
