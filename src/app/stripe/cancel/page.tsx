import Link from "next/link";

export default function StripeCancelPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-20 px-4">
      <div className="mx-auto max-w-xl rounded-3xl bg-white p-10 shadow-xl ring-1 ring-slate-200">
        <h1 className="text-3xl font-semibold text-slate-900">Payment Cancelled</h1>
        <p className="mt-4 text-gray-600">
          Your payment was cancelled. You can return to your cart and try again.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/cart"
            className="rounded bg-orange-500 px-5 py-3 text-white hover:bg-orange-600"
          >
            Return to Cart
          </Link>
          <Link
            href="/meals"
            className="rounded border border-slate-200 px-5 py-3 text-slate-700 hover:bg-slate-50"
          >
            Browse Meals
          </Link>
        </div>
      </div>
    </div>
  );
}
