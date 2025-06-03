import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold my-8">ברוכים הבאים לקהילת אוסף כלי הבינה של חולמים תקשוב!</h1>
      <p className="text-xl mb-8">
        גלו, שתפו ודונו בכלי בינה מלאכותית שיכולים לסייע בחינוך ובהוראה.
      </p>
      <div className="space-x-4">
        <Link href="/tools"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded text-lg"
        >
          לכל הכלים
        </Link>
        <Link href="/add-tool"
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded text-lg"
        >
          הוספת כלי חדש
        </Link>
      </div>
      {/* TODO: Add sections for featured tools, recent reviews, etc. */}
    </div>
  );
} 