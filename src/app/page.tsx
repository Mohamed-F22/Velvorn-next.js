export const dynamic = "force-dynamic";

import { getProducts } from "@/app/lib/actions";
import Landing from "./Components/Landing";
import LatestDrop from "./Components/LatestDrop";
import OffersSection from "./Components/OffersSection";
import SportsWearCollection from "./Components/SportsWearCollection";
import HeroSection from "./Components/HeroSection";
import Footer from "./Components/Footer";

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
