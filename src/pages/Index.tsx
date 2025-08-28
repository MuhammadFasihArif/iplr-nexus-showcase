import Header from "@/components/Header";
import HeroCarousel from "@/components/HeroCarousel";
import ContentGrid from "@/components/ContentGrid";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroCarousel />
        <ContentGrid />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
