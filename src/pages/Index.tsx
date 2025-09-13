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
        <section id="home">
          <HeroCarousel />
        </section>
        <section id="articles" className="scroll-mt-20">
          <DynamicMasonryGrid />
        </section>
        <section id="research" className="scroll-mt-20">
          <ArticleDisplay />
        </section>
        <section id="workshops" className="scroll-mt-20">
          <PublicMediaGallery />
        </section>
        <section id="about" className="scroll-mt-20">
          <AboutSection />
        </section>
        <section id="contact" className="scroll-mt-20">
          <ContactSection />
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
