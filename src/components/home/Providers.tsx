const Providers = () => {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-5">
        <h2 className="text-3xl font-bold mb-8">
          Top Providers
        </h2>

        <div className="grid md:grid-cols-3 gap-5">
          {[1, 2, 3].map(
            (item) => (
              <div
                key={item}
                className="border rounded-lg p-5"
              >
                <h3 className="font-semibold">
                  Burger King
                </h3>

                <p className="text-gray-500 mt-2">
                  Premium food provider
                </p>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
};

export default Providers;