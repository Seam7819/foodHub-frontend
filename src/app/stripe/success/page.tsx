import Link from "next/link";

export default function StripeSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-20 px-4">
      <div className="mx-auto max-w-xl rounded-3xl bg-white p-10 shadow-xl ring-1 ring-slate-200">
        <h1 className="text-3xl font-semibold text-slate-900">Payment Successful</h1>
        <p className="mt-4 text-gray-600">
          Thank you for your order. Your payment has been processed successfully.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/meals"
            className="rounded bg-orange-500 px-5 py-3 text-white hover:bg-orange-600"
          >
            Continue Shopping
          </Link>
          <Link
            href="/profile"
            className="rounded border border-slate-200 px-5 py-3 text-slate-700 hover:bg-slate-50"
          >
            View My Orders
          </Link>
        </div>
      </div>
    </div>
  );
}
