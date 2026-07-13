const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-200 mt-20">
      <div className="w-full">
        <div className="max-w-7xl mx-auto px-5 py-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Cartora</h2>
            <p className="mt-3 max-w-xl text-slate-400">
              A modern marketplace for discovering products, supporting trusted providers, and shopping with confidence.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-slate-400">
            <a href="/about" className="hover:text-white">About</a>
            <a href="/contact" className="hover:text-white">Contact</a>
            <a href="/products" className="hover:text-white">Browse Products</a>
            <a href="/blog" className="hover:text-white">Blog</a>
          </div>
        </div>

        <p className="mt-8 text-sm text-slate-500">
          © 2026 Cartora. All rights reserved.
        </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;