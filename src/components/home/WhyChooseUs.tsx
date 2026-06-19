const WhyChooseUs = () => {
  const features = [
    "Fast Delivery",
    "Fresh Food",
    "Trusted Providers",
    "Secure Ordering",
  ];

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-5">
        <h2 className="text-3xl font-bold mb-8 text-orange-400">
          Why Choose FoodHub
        </h2>

        <div className="grid md:grid-cols-4 gap-5">
          {features.map(
            (feature) => (
              <div
                key={feature}
                className="border p-6 rounded-lg"
              >
                {feature}
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;