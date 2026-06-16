const FeaturedMeals = () => {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-5">
        <h2 className="text-3xl font-bold mb-8">
          Featured Meals
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map(
            (item) => (
              <div
                key={item}
                className="border rounded-lg p-4"
              >
                <div className="h-40 bg-gray-200 rounded"></div>

                <h3 className="font-semibold mt-4">
                  Chicken Burger
                </h3>

                <p className="text-orange-500 font-bold">
                  ৳250
                </p>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
};

export default FeaturedMeals;