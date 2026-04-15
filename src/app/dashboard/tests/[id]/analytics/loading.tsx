export default function AnalyticsLoading() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 pb-24 sm:pb-10 animate-pulse">
      {/* Breadcrumb Skeleton */}
      <div className="flex items-center gap-2 mb-6">
        <div className="h-4 w-16 bg-surface-2 rounded-md" />
        <div className="h-4 w-4 bg-surface-2 rounded-full" />
        <div className="h-4 w-32 bg-surface-2 rounded-md" />
      </div>

      {/* Header Skeleton */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="h-8 w-64 bg-surface-2 rounded-lg mb-2" />
          <div className="h-4 w-48 bg-surface-2 rounded-md" />
        </div>
        <div className="h-10 w-28 bg-surface-2 rounded-xl" />
      </div>

      {/* Stat Blocks Skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-5 rounded-2xl border border-border bg-surface">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-surface-2" />
              <div className="h-4 w-20 bg-surface-2 rounded-md" />
            </div>
            <div className="h-8 w-16 bg-surface-2 rounded-lg mb-1" />
            <div className="h-3 w-24 bg-surface-2 rounded-md" />
          </div>
        ))}
      </div>

      {/* Main Content Area Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface rounded-2xl border border-border p-5 h-96" />
        </div>
        <div className="space-y-6">
          <div className="bg-surface rounded-2xl border border-border p-5 h-80" />
        </div>
      </div>
    </div>
  );
}
