import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">HR Knowledge Quiz</h1>
        <p className="text-gray-500 mb-8">
          Test your knowledge of employment law and workplace compliance.
        </p>
        <Link
          href="/quiz"
          className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3 rounded-xl transition-colors"
        >
          Take the Quiz →
        </Link>
      </div>
    </main>
  );
}
