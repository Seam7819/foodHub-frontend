import Link from "next/link";

const MealCard = ({
  meal,
}: {
  meal: any;
}) => {
  return (
    <div className="border rounded-xl overflow-hidden bg-white">
      <img
        src={
          meal.image ||
          "https://placehold.co/600x400"
        }
        alt={meal.name}
        className="w-full h-52 object-cover"
      />

      <div className="p-4">
        <h2 className="font-bold text-xl">
          {meal.name}
        </h2>

        <p className="text-gray-500 mt-2">
          {
            meal.provider
              ?.businessName
          }
        </p>

        <p className="font-semibold text-orange-500 mt-2">
          ৳ {meal.price}
        </p>

        <Link
          href={`/meals/${meal.id}`}
          className="mt-4 inline-block bg-orange-500 text-white px-4 py-2 rounded"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default MealCard;