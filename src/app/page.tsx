import Footer from "../Components/Footer";
import HeroSection from "../Components/HeroSection";
import Landing from "../Components/Landing";
import LatestDrop from "../Components/LatestDrop";
import OffersSection from "../Components/OffersSection";
import SportsWearCollection from "../Components/SportsWearCollection";

const Home = () => {
  return (
    <>
      <Landing />
      <OffersSection />
      <SportsWearCollection />
      <LatestDrop />
      <HeroSection />
      <Footer />
    </>
  );
};

export default Home;
