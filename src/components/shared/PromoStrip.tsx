import Link from "next/link";

const PromoStrip = () => {
  return (
    <div className="bg-orange-50/80 border-b">
      <div className="max-w-7xl mx-auto px-5 py-2 flex items-center justify-between gap-4">
        <div className="text-sm font-medium text-orange-700">Limited time: Free delivery over ৳2,000 • 30-day returns</div>
        <div className="flex items-center gap-3">
          <Link href="/products?deal=today" className="rounded-full bg-orange-600 px-4 py-1 text-sm font-semibold text-white">Today&apos;s Deals</Link>
          <Link href="/products" className="text-sm text-slate-700 underline">Shop Products</Link>
        </div>
      </div>
    </div>
  );
};

export default PromoStrip;
