import Header from "@/components/Header";
import HeroCarousel from "@/components/HeroCarousel";
import DynamicMasonryGrid from "@/components/DynamicMasonryGrid";
import ArticleDisplay from "@/components/ArticleDisplay";
import PublicMediaGallery from "@/components/PublicMediaGallery";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroCarousel />
        <DynamicMasonryGrid />
        <ArticleDisplay />
        <PublicMediaGallery />
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
