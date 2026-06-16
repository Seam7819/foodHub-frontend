const categories = [
  "Pizza",
  "Burger",
  "Chinese",
  "Dessert",
  "Drinks",
  "Sea Food",
];

const Categories = () => {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-5">
        <h2 className="text-3xl font-bold mb-8">
          Categories
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
          {categories.map(
            (category) => (
              <div
                key={category}
                className="border p-6 rounded-lg text-center hover:shadow"
              >
                {category}
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
};

export default Categories;