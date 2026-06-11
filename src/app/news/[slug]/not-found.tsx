import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function NewsNotFound() {
  return (
    <>
      <Navbar />
      <main className="flex min-h-[60vh] flex-col items-center justify-center px-4 pt-28 text-center">
        <h1 className="font-heading text-3xl font-bold text-slate-900">
          Article not found
        </h1>
        <p className="mt-3 max-w-md text-slate-600">
          This news item may have been removed or is temporarily unavailable.
        </p>
        <Link
          href="/#news"
          className="mt-8 rounded-xl bg-orange-600 px-6 py-3 font-semibold text-white hover:bg-orange-700"
        >
          Back to News
        </Link>
      </main>
      <Footer />
    </>
  );
}
