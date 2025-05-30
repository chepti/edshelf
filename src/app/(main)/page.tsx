import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold my-8">Welcome to the AI Tools for Teachers Community!</h1>
      <p className="text-xl mb-8">
        Discover, share, and discuss AI tools that can help in education.
      </p>
      <div className="space-x-4">
        <Link href="/tools"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded text-lg"
        >
          Browse Tools
        </Link>
        <Link href="/add-tool"
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded text-lg"
        >
          Add a New Tool
        </Link>
      </div>
      {/* TODO: Add sections for featured tools, recent reviews, etc. */}
    </div>
  );
} 