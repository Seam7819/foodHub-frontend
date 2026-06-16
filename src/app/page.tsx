import Categories from "../components/home/Categories";
import FeaturedMeals from "../components/home/FeaturedMeals";
import Hero from "../components/home/Hero";
import Providers from "../components/home/Providers";
import WhyChooseUs from "../components/home/WhyChooseUs";


export default function HomePage() {
  return (
    <>
      <Hero />

      <Categories />

      <FeaturedMeals />

      <Providers />

      <WhyChooseUs />
    </>
  );
}