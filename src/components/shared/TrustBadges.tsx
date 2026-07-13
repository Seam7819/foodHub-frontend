const TrustBadges = () => {
  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-5 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div>
            <div className="mx-auto mb-2 inline-flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-700">🔒</div>
            <div className="text-sm font-semibold text-slate-900">Secure Checkout</div>
            <div className="text-xs text-slate-600">SSL encrypted payments</div>
          </div>

          <div>
            <div className="mx-auto mb-2 inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">⚡</div>
            <div className="text-sm font-semibold text-slate-900">Fast Delivery</div>
            <div className="text-xs text-slate-600">Timely shipping from providers</div>
          </div>

          <div>
            <div className="mx-auto mb-2 inline-flex h-10 w-10 items-center justify-center rounded-full bg-sky-100 text-sky-700">↩️</div>
            <div className="text-sm font-semibold text-slate-900">Easy Returns</div>
            <div className="text-xs text-slate-600">30-day hassle-free returns</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrustBadges;
