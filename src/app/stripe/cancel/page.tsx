import Link from "next/link";

export default function StripeCancelPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-20 px-4">
      <div className="mx-auto max-w-xl rounded-3xl bg-white dark:bg-slate-800 p-10 shadow-xl ring-1 ring-slate-200 dark:ring-slate-700">
        <div className="flex items-center justify-center mb-6">
          <svg className="w-16 h-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l-2-2m0 0l-2-2m2 2l2-2m-2 2l-2 2m8-8l-2 2m0 0l-2-2m2 2l2-2m-2 2l-2 2" />
          </svg>
        </div>
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-white text-center">Payment Cancelled</h1>
        <p className="mt-4 text-gray-600 dark:text-gray-300 text-center">
          Your payment was cancelled. You can return to your cart and try again.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/cart"
            className="rounded bg-orange-500 px-5 py-3 text-white hover:bg-orange-600 font-semibold transition text-center"
          >
            Return to Cart
          </Link>
          <Link
            href="/products"
            className="rounded border border-orange-300 px-5 py-3 text-orange-600 hover:bg-orange-50 dark:border-orange-700 dark:text-orange-400 dark:hover:bg-slate-700 font-semibold transition text-center"
          >
            Browse Products
          </Link>
        </div>
      </div>
    </div>
  );
}
