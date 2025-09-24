"use client"

export function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-background animate-fade-in">
      {/* Header Skeleton */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-6 w-6 bg-muted rounded animate-pulse loading-skeleton"></div>
              <div className="h-6 w-20 bg-muted rounded animate-pulse loading-skeleton"></div>
              <div className="h-5 w-32 bg-muted rounded-full animate-pulse loading-skeleton hidden sm:block"></div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="h-4 w-4 bg-muted rounded animate-pulse loading-skeleton"></div>
              <div className="h-4 w-16 bg-muted rounded animate-pulse loading-skeleton hidden sm:block"></div>
              <div className="h-4 w-24 bg-muted rounded animate-pulse loading-skeleton hidden md:block"></div>
              <div className="h-8 w-8 bg-muted rounded-full animate-pulse loading-skeleton"></div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Skeleton */}
      <main className="container mx-auto px-4 py-6">
        <div className="space-y-6">
          {/* Welcome Section Skeleton */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-2">
              <div className="h-8 w-48 bg-muted rounded animate-pulse loading-skeleton"></div>
              <div className="h-4 w-64 bg-muted rounded animate-pulse loading-skeleton"></div>
              <div className="h-3 w-40 bg-muted rounded animate-pulse loading-skeleton"></div>
            </div>
            <div className="h-9 w-24 bg-muted rounded animate-pulse loading-skeleton"></div>
          </div>

          {/* Quick Stats Skeleton */}
          <div className="grid grid-cols-4 gap-2 sm:gap-3 md:gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className={`bg-card border border-border rounded-lg p-3 animate-fade-in stagger-${i}`}>
                <div className="text-center space-y-2">
                  <div className="h-6 w-12 bg-muted rounded animate-pulse loading-skeleton mx-auto"></div>
                  <div className="h-3 w-16 bg-muted rounded animate-pulse loading-skeleton mx-auto"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Consumption Cards Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className={`bg-card border border-border rounded-lg p-6 animate-fade-in stagger-${i}`}>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="h-4 w-24 bg-muted rounded animate-pulse loading-skeleton"></div>
                    <div className="h-4 w-4 bg-muted rounded animate-pulse loading-skeleton"></div>
                  </div>
                  <div className="flex items-baseline space-x-2">
                    <div className="h-8 w-16 bg-muted rounded animate-pulse loading-skeleton"></div>
                    <div className="h-4 w-20 bg-muted rounded animate-pulse loading-skeleton"></div>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full animate-pulse loading-skeleton"></div>
                  <div className="flex justify-between items-center">
                    <div className="h-3 w-20 bg-muted rounded animate-pulse loading-skeleton"></div>
                    <div className="h-5 w-16 bg-muted rounded-full animate-pulse loading-skeleton"></div>
                  </div>
                  <div className="h-3 w-32 bg-muted rounded animate-pulse loading-skeleton"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Billing and Services Skeleton */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <div key={i} className={`bg-card border border-border rounded-lg p-6 animate-fade-in stagger-${i + 3}`}>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="h-4 w-32 bg-muted rounded animate-pulse loading-skeleton"></div>
                    <div className="h-4 w-4 bg-muted rounded animate-pulse loading-skeleton"></div>
                  </div>
                  <div className="space-y-3">
                    {[1, 2, 3, 4].map((j) => (
                      <div key={j} className="h-16 w-full bg-muted rounded animate-pulse loading-skeleton"></div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Customer Info Skeleton */}
          <div className="bg-card border border-border rounded-lg p-6 animate-fade-in stagger-6">
            <div className="space-y-4">
              <div className="h-4 w-40 bg-muted rounded animate-pulse loading-skeleton"></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-3 w-16 bg-muted rounded animate-pulse loading-skeleton"></div>
                    <div className="h-4 w-32 bg-muted rounded animate-pulse loading-skeleton"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Skeleton */}
      <footer className="border-t border-border bg-card/50 backdrop-blur-sm mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center space-y-2">
            <div className="h-4 w-96 bg-muted rounded animate-pulse loading-skeleton mx-auto"></div>
            <div className="h-3 w-64 bg-muted rounded animate-pulse loading-skeleton mx-auto"></div>
          </div>
        </div>
      </footer>
    </div>
  )
}
