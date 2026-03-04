import { getProducts } from "@/lib/getProducts";
import Footer from "../Components/Footer";
import HeroSection from "../Components/HeroSection";
import Landing from "../Components/Landing";
import LatestDrop from "../Components/LatestDrop";
import OffersSection from "../Components/OffersSection";
import SportsWearCollection from "../Components/SportsWearCollection";

const Home = async () => {
  const productsData = await getProducts();
  const { offerProducts, latestDrop } = productsData;

  return (
    <>
      <Landing />
      <OffersSection offerProducts={offerProducts} />
      <SportsWearCollection />
      <LatestDrop latestDrop={latestDrop} />
      <HeroSection />
      <Footer />
    </>
  );
};

export default Home;
