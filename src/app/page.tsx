import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero section */}
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to Our Documentation
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Comprehensive guides, tutorials, and API reference to help you get started 
          and make the most of our software platform.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            href="/quick-links/getting-started"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
          >
            Get Started
          </Link>
          <Link
            href="/api-reference"
            className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200"
          >
            API Reference
          </Link>
        </div>
      </div>

      {/* Quick access cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-8">
        <Link
          href="/quick-links"
          className="block p-6 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200"
        >
          <div className="flex items-center mb-3">
            <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="ml-3 text-lg font-semibold text-gray-900">Quick Links</h3>
          </div>
          <p className="text-gray-600">
            Fast access to installation guides, quick start instructions, and common tasks.
          </p>
        </Link>

        <Link
          href="/tutorials"
          className="block p-6 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200"
        >
          <div className="flex items-center mb-3">
            <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="ml-3 text-lg font-semibold text-gray-900">Tutorials</h3>
          </div>
          <p className="text-gray-600">
            Step-by-step guides for basic setup, advanced features, and integrations.
          </p>
        </Link>

        <Link
          href="/api-reference"
          className="block p-6 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200"
        >
          <div className="flex items-center mb-3">
            <div className="h-8 w-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="h-5 w-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <h3 className="ml-3 text-lg font-semibold text-gray-900">API Reference</h3>
          </div>
          <p className="text-gray-600">
            Complete API documentation with authentication, endpoints, and examples.
          </p>
        </Link>

        <Link
          href="/panel-overview"
          className="block p-6 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200"
        >
          <div className="flex items-center mb-3">
            <div className="h-8 w-8 bg-orange-100 rounded-lg flex items-center justify-center">
              <svg className="h-5 w-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="ml-3 text-lg font-semibold text-gray-900">Panel Overview</h3>
          </div>
          <p className="text-gray-600">
            Learn about the dashboard, features, and navigation of our platform.
          </p>
        </Link>

        <Link
          href="/chatbot"
          className="block p-6 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200"
        >
          <div className="flex items-center mb-3">
            <div className="h-8 w-8 bg-indigo-100 rounded-lg flex items-center justify-center">
              <svg className="h-5 w-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="ml-3 text-lg font-semibold text-gray-900">Chatbot</h3>
          </div>
          <p className="text-gray-600">
            Interactive AI assistant to help answer questions and guide you through tasks.
          </p>
        </Link>

        <Link
          href="/troubleshooting"
          className="block p-6 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200"
        >
          <div className="flex items-center mb-3">
            <div className="h-8 w-8 bg-red-100 rounded-lg flex items-center justify-center">
              <svg className="h-5 w-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="ml-3 text-lg font-semibold text-gray-900">Troubleshooting</h3>
          </div>
          <p className="text-gray-600">
            Common issues, error codes, and solutions to help resolve problems quickly.
          </p>
        </Link>

        <Link
          href="/faq"
          className="block p-6 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200"
        >
          <div className="flex items-center mb-3">
            <div className="h-8 w-8 bg-yellow-100 rounded-lg flex items-center justify-center">
              <svg className="h-5 w-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="ml-3 text-lg font-semibold text-gray-900">FAQ</h3>
          </div>
          <p className="text-gray-600">
            Frequently asked questions and answers to common queries.
          </p>
        </Link>
      </div>

      {/* Call to action */}
      <div className="bg-gray-50 rounded-lg p-8 text-center mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Need More Help?
        </h2>
        <p className="text-gray-600 mb-6">
          Can&apos;t find what you&apos;re looking for? Our support team is here to help.
        </p>
        <a
          href="mailto:support@example.com"
          className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
        >
          <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Contact Support
        </a>
      </div>
    </div>
  );
}
