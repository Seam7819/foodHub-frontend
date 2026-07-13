import HomeInsights from "@/src/components/home/HomeInsights";

const AboutPage = () => {
  return (
    <div className="mx-auto max-w-7xl px-5 py-16">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-orange-600">About Cartora</p>
        <h1 className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">A modern marketplace built for discovery and growth.</h1>
        <p className="mt-5 text-lg text-slate-600 dark:text-slate-300">
          Cartora helps customers discover a wide range of products while giving providers a simple platform to present and manage their catalog.
        </p>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {[
          ["For shoppers", "Browse curated products, compare details, and buy with confidence."],
          ["For providers", "Create a storefront, list products, and manage availability from one dashboard."],
          ["For growth", "A responsive experience designed for scale across mobile, tablet, and desktop."],
        ].map(([title, description]) => (
          <div key={title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">{title}</h2>
            <p className="mt-3 text-slate-600 dark:text-slate-300">{description}</p>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <HomeInsights />
      </div>
    </div>
  );
};

export default AboutPage;
