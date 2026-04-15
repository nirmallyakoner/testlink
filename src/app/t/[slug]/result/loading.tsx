export default function ResultLoading() {
  return (
    <div className="min-h-screen bg-bg relative animate-pulse">
      <div className="relative z-10 max-w-xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        
        {/* Top actions Skeleton */}
        <div className="flex items-center justify-between mb-6">
          <div className="h-4 w-24 bg-surface-2 rounded-md" />
          <div className="h-9 w-24 bg-surface-2 rounded-xl" />
        </div>

        {/* Test info Skeleton */}
        <div className="flex flex-col items-center mb-8">
          <div className="h-5 w-48 bg-surface-2 rounded-md mb-2" />
        </div>

        {/* Rank Skeleton */}
        <div className="flex flex-col items-center mb-8">
          <div className="h-4 w-24 bg-surface-2 rounded-md mb-2" />
          <div className="h-20 w-32 bg-surface-2 rounded-xl" />
          <div className="h-4 w-32 bg-surface-2 rounded-md mt-4" />
        </div>

        {/* Score summary 3-col Skeleton */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-surface border border-border rounded-2xl p-3 sm:p-4 text-center">
              <div className="h-7 w-16 bg-surface-2 rounded-lg mx-auto mb-2" />
              <div className="h-3 w-10 bg-surface-2 rounded-md mx-auto" />
            </div>
          ))}
        </div>

        {/* Score bar Skeleton */}
        <div className="mb-10 w-full h-2 bg-surface-2 rounded-full" />

        {/* Leaderboard Skeleton */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="h-5 w-24 bg-surface-2 rounded-md" />
            <div className="h-4 w-12 bg-surface-2 rounded-md" />
          </div>

          <div className="bg-surface border border-border rounded-2xl overflow-hidden">
            <div className="p-4 space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-surface-2 rounded-md shrink-0" />
                  <div className="h-8 w-8 bg-surface-2 rounded-full shrink-0" />
                  <div className="h-5 w-32 bg-surface-2 rounded-md flex-1" />
                  <div className="space-y-1">
                    <div className="h-4 w-12 bg-surface-2 rounded-md ml-auto" />
                    <div className="h-3 w-8 bg-surface-2 rounded-md ml-auto" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
