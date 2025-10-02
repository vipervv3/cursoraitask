export default function TestPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">🎉 AI ProjectHub Test</h1>
        <p className="text-lg text-gray-600 mb-8">The application is running successfully!</p>
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
          <h2 className="text-xl font-semibold mb-4">✅ Demo Mode Active</h2>
          <p className="text-gray-600 mb-4">
            This is a demonstration version of the AI ProjectHub application.
            All features are working in demo mode.
          </p>
          <a 
            href="/" 
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Login
          </a>
        </div>
      </div>
    </div>
  )
}
