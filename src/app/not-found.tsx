"use client";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 dark:text-gray-100">404</h1>
        <p className="mt-4 text-xl text-gray-600 dark:text-gray-400">Page not found</p>
        <p className="mt-2 text-gray-500 dark:text-gray-500">
          The page you are looking for doesn't exist.
        </p>
        <a
          href="/"
          className="mt-6 inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Go Home
        </a>
      </div>
    </div>
  );
}
