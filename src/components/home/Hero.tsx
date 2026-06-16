import Link from "next/link";

const Hero = () => {
  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-5 text-center">
        <h1 className="text-5xl font-bold">
          Discover & Order
          <span className="text-orange-500">
            {" "}
            Delicious Meals
          </span>
        </h1>

        <p className="mt-6 text-lg text-gray-600">
          Browse meals from trusted
          providers and enjoy food at
          your doorstep.
        </p>

        <div className="flex justify-center gap-4 mt-8">
          <Link
            href="/meals"
            className="px-6 py-3 bg-orange-500 text-white rounded-md"
          >
            Browse Meals
          </Link>

          <Link
            href="/register"
            className="px-6 py-3 border rounded-md"
          >
            Become Provider
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;