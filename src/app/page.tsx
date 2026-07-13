import Categories from "../components/home/Categories";
import FeaturedBenefits from "../components/home/FeaturedBenefits";
import FeaturedMeals from "../components/home/FeaturedMeals";
import FAQSection from "../components/home/FAQSection";
import Hero from "../components/home/Hero";
import MarketplaceStory from "../components/home/MarketplaceStory";
import NewsletterCTA from "../components/home/NewsletterCTA";
import Providers from "../components/home/Providers";
import ResultsSection from "../components/home/ResultsSection";
import Testimonials from "../components/home/Testimonials";
import WhyChooseUs from "../components/home/WhyChooseUs";
import PromoStrip from "../components/shared/PromoStrip";
import TrustBadges from "../components/shared/TrustBadges";


export default function HomePage() {
  return (
    <>
      <PromoStrip />
      <Hero />
      <TrustBadges />

      <Categories />

      <FeaturedBenefits />

      <FeaturedMeals />

      <MarketplaceStory />

      <ResultsSection />

      <Testimonials />

      <FAQSection />

      <Providers />

      <WhyChooseUs />

      <NewsletterCTA />
    </>
  );
}