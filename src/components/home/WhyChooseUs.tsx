const WhyChooseUs = () => {
  const features = [
    "Team Collaboration",
    "Secure Workflows",
    "Performance Insights",
    "Trusted Partners",
  ];

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-5">
        <h2 className="text-3xl font-bold mb-8 text-cyan-600">
          Why Choose OrgNest
        </h2>

        <div className="grid md:grid-cols-4 gap-5">
          {features.map((feature) => (
            <div key={feature} className="border p-6 rounded-lg bg-slate-50 dark:bg-slate-900">
              <h3 className="font-semibold text-slate-900 dark:text-white">{feature}</h3>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                Empower your organization with reliable tools for every team and every project.
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;