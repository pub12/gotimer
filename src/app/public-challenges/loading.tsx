export default function Loading() {
  return (
    <main className="min-h-screen flex flex-col items-center bg-background p-4 pt-20">
      <div className="w-full max-w-4xl mx-auto animate-pulse">
        <div className="h-4 w-48 bg-gray-200 rounded mb-4" />
        <div className="h-8 w-64 bg-gray-200 rounded mb-2" />
        <div className="h-5 w-96 bg-gray-200 rounded mb-6" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-card rounded-xl p-5 border">
              <div className="h-6 w-48 bg-gray-200 rounded mb-2" />
              <div className="h-4 w-full bg-gray-200 rounded mb-3" />
              <div className="flex gap-4">
                <div className="h-4 w-24 bg-gray-200 rounded" />
                <div className="h-4 w-20 bg-gray-200 rounded" />
                <div className="h-4 w-32 bg-gray-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
