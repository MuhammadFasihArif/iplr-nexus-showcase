import Header from "@/components/Header";
import HeroCarousel from "@/components/HeroCarousel";
import MasonryGrid from "@/components/MasonryGrid";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroCarousel />
        <MasonryGrid />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
