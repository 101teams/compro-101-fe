import Link from "next/link";
import { useLocale } from "next-intl";

export default function NotFound() {
  const locale = useLocale();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Page Not Found</h2>
      <p className="mb-4">Could not find the requested page</p>
      <Link href={`/${locale}`} className="text-blue-500 hover:underline">
        Return Home
      </Link>
    </div>
  );
}
