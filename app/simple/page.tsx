export default function SimplePage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl text-white">🧠</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">AI ProjectHub</h1>
          <p className="text-gray-600 mb-6">Welcome to your intelligent project management platform</p>
          
          <div className="space-y-4">
            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
              Get Started
            </button>
            <button className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors">
              Learn More
            </button>
          </div>
          
          <div className="mt-6 text-sm text-gray-500">
            <p>✅ Next.js 14 running</p>
            <p>✅ Tailwind CSS working</p>
            <p>✅ TypeScript configured</p>
          </div>
        </div>
      </div>
    </div>
  )
}
