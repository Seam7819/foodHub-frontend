import Link from "next/link";

const Hero = () => {
  // Sample carousel data
  const carouselItems = [
    {
      id: "1",
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1200&h=400&fit=crop",
      title: "Discover Delicious Meals",
      description: "Browse meals from trusted providers and enjoy food at your doorstep.",
      link: "/meals",
    },
    {
      id: "2",
      image: "https://images.unsplash.com/photo-1504674900923-c6c1f2b28e45?w=1200&h=400&fit=crop",
      title: "Premium Food Delivery",
      description: "Fast and reliable delivery service with fresh, hot meals every time.",
      link: "/meals",
    },
    {
      id: "3",
      image: "https://images.unsplash.com/photo-1495202411685-52f3b7bfc2ae?w=1200&h=400&fit=crop",
      title: "Explore Your Favorite Restaurants",
      description: "Find your next favorite meal from thousands of restaurants.",
      link: "/providers",
    },
  ];

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-5">
        <div className="relative w-full h-96 bg-gradient-to-r from-slate-800 via-cyan-700 to-cyan-500 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-white px-5">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                Build a stronger
                <span className="block text-cyan-100">organization with OrgNest</span>
              </h1>

              <p className="mt-6 text-sm sm:text-base md:text-lg text-cyan-100/90 mb-8">
                Align teams, services, and projects with modern workflows and secure collaboration tools.
              </p>

              <div className="flex justify-center gap-2 sm:gap-4 flex-wrap flex-col sm:flex-row">
                <Link
                  href="/meals"
                  className="px-4 sm:px-8 py-2 sm:py-3 bg-white text-slate-900 rounded-lg font-semibold hover:bg-slate-100 transition text-sm sm:text-base"
                >
                  Explore Services
                </Link>

                <Link
                  href="/register"
                  className="px-4 sm:px-8 py-2 sm:py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition text-sm sm:text-base"
                >
                  Start Collaboration
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;