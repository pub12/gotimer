export default function Loading() {
  return (
    <main className="min-h-screen flex flex-col items-center bg-background p-4 pt-20">
      <div className="w-full max-w-4xl mx-auto animate-pulse">
        <div className="h-4 w-56 bg-gray-200 rounded mb-4" />
        <div className="h-10 w-72 bg-gray-200 rounded mb-3" />
        <div className="h-5 w-full bg-gray-200 rounded mb-6" />
        <div className="bg-card rounded-xl p-6 border mb-6">
          <div className="flex justify-between mb-4">
            <div className="h-8 w-32 bg-gray-200 rounded" />
            <div className="h-8 w-32 bg-gray-200 rounded" />
          </div>
          <div className="h-48 w-full bg-gray-200 rounded" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-card rounded-xl p-4 border">
              <div className="h-5 w-full bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
