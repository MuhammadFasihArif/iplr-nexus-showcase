import Header from "@/components/Header";
import HeroCarousel from "@/components/HeroCarousel";
import MasonryGrid from "@/components/MasonryGrid";
import ArticleDisplay from "@/components/ArticleDisplay";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroCarousel />
        <MasonryGrid />
        <ArticleDisplay />
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
