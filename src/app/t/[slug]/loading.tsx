import { Logo } from "@/components/ui/Logo";

export default function StudentTestLoading() {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-6 animate-pulse">
      <div className="w-full max-w-sm text-center">
        <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8 mb-4">
          <Logo className="w-12 h-12 mx-auto mb-5 drop-shadow-lg opacity-50" />
          
          {/* Educator name */}
          <div className="h-3 w-24 bg-surface-2 rounded-md mx-auto mb-2" />
          
          {/* Title */}
          <div className="h-6 w-48 bg-surface-2 rounded-lg mx-auto mb-2" />
          
          {/* Subject */}
          <div className="h-4 w-32 bg-surface-2 rounded-md mx-auto mb-6" />

          {/* Stats row */}
          <div className="flex items-center justify-center gap-6 mb-8">
            <div className="space-y-1">
              <div className="h-6 w-8 bg-surface-2 rounded-md mx-auto" />
              <div className="h-3 w-12 bg-surface-2 rounded-md mx-auto" />
            </div>
            <div className="w-px h-8 bg-border" />
            <div className="space-y-1">
              <div className="h-6 w-8 bg-surface-2 rounded-md mx-auto" />
              <div className="h-3 w-12 bg-surface-2 rounded-md mx-auto" />
            </div>
            <div className="w-px h-8 bg-border" />
            <div className="space-y-1">
              <div className="h-6 w-8 bg-surface-2 rounded-md mx-auto" />
              <div className="h-3 w-12 bg-surface-2 rounded-md mx-auto" />
            </div>
          </div>

          {/* Button */}
          <div className="h-12 w-full bg-surface-2 rounded-xl" />
        </div>
        
        <div className="h-3 w-32 bg-surface-2 rounded-md mx-auto mt-2" />
      </div>
    </div>
  );
}
