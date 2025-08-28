import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage1 from "@/assets/hero-1.jpg";
import heroImage2 from "@/assets/hero-2.jpg";
import heroImage3 from "@/assets/hero-3.jpg";

interface Slide {
  image: string;
  title: string;
  subtitle: string;
  description: string;
}

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides: Slide[] = [
    {
      image: heroImage1,
      title: "Advancing Academic Excellence",
      subtitle: "Featured Research",
      description: "Discover groundbreaking research and innovative methodologies that shape the future of education and professional development."
    },
    {
      image: heroImage2,
      title: "Learning Without Boundaries",
      subtitle: "Educational Innovation",
      description: "Explore modern learning environments and collaborative spaces that foster intellectual growth and academic achievement."
    },
    {
      image: heroImage3,
      title: "Research & Innovation",
      subtitle: "Scientific Discovery",
      description: "Access cutting-edge research facilities and scientific breakthroughs that drive progress in various academic disciplines."
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
      {/* Slides */}
      <div className="relative h-full">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${slide.image})` }}
            />
            <div className="absolute inset-0 bg-black/30" />
            
            {/* Content Overlay */}
            <div className="relative h-full flex items-center justify-center text-center px-6">
              <div className="max-w-4xl mx-auto text-white">
                <p className="academic-subtitle text-white/80 mb-4 tracking-wider">
                  {slide.subtitle}
                </p>
                <h1 className="text-4xl md:text-6xl font-academic font-bold mb-6 leading-tight">
                  {slide.title}
                </h1>
                <p className="text-lg md:text-xl font-body font-light leading-relaxed max-w-2xl mx-auto opacity-90">
                  {slide.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <Button
        variant="ghost"
        size="sm"
        onClick={prevSlide}
        className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 border border-white/20 text-white p-3 rounded-full backdrop-blur-sm transition-all duration-300"
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={nextSlide}
        className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 border border-white/20 text-white p-3 rounded-full backdrop-blur-sm transition-all duration-300"
      >
        <ChevronRight className="h-5 w-5" />
      </Button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? "bg-white scale-110" 
                : "bg-white/50 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroCarousel;