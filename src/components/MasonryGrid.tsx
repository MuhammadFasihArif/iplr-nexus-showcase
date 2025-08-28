import { useState } from "react";
import { Play, FileText, BookOpen, Clock, User, ExternalLink, Bitcoin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import article1 from "@/assets/article-1.jpg";
import article2 from "@/assets/article-2.jpg";
import research1 from "@/assets/research-1.jpg";
import research2 from "@/assets/research-2.jpg";
import video1 from "@/assets/video-1.jpg";
import video2 from "@/assets/video-2.jpg";

interface ContentItem {
  id: string;
  type: "article" | "research" | "video" | "feature";
  title: string;
  description: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  thumbnail: string;
  featured?: boolean;
  size: "small" | "medium" | "large" | "featured";
  price?: string;
}

const MasonryGrid = () => {
  const [activeFilter, setActiveFilter] = useState<"all" | "articles" | "research" | "videos">("all");

  // Magazine-style content with varied sizes
  const contentItems: ContentItem[] = [
    {
      id: "1",
      type: "feature",
      title: "Le casque pour lire dans les pensées de Médor",
      description: "Revolutionary brain-computer interface technology for enhanced learning experiences in academic environments.",
      author: "Dr. Sarah Chen",
      date: "March 15, 2024",
      readTime: "5 min read",
      category: "Educational Technology",
      thumbnail: research2,
      featured: true,
      size: "featured",
      price: "6,99 bitcoins"
    },
    {
      id: "2",
      type: "article",
      title: "La villa perchée aux îles Vierges",
      description: "Remote learning environments and their impact on educational outcomes.",
      author: "Prof. Michael Johnson",
      date: "March 10, 2024",
      readTime: "12 min read",
      category: "Distance Learning",
      thumbnail: article1,
      size: "medium",
      price: "5,000,000 € / 3,000/NUIT"
    },
    {
      id: "3",
      type: "video",
      title: "Le yacht hybride",
      description: "Sustainable educational practices and green campus initiatives.",
      author: "IPLR Research Team",
      date: "March 8, 2024",
      readTime: "25 min watch",
      category: "Sustainability",
      thumbnail: video1,
      size: "small",
      price: "500,000 € / 2,150/NUIT"
    },
    {
      id: "4",
      type: "article",
      title: "Le tabouret en marbre par Fox & Morlie",
      description: "Innovative furniture design in modern learning spaces.",
      author: "Dr. Amanda Rodriguez",
      date: "March 5, 2024",
      readTime: "8 min read",
      category: "Design",
      thumbnail: article2,
      size: "small"
    },
    {
      id: "5",
      type: "research",
      title: "Neuron, un masque pour dormir beaucoup moins",
      description: "Sleep optimization research for enhanced cognitive performance in students.",
      author: "Dr. James Park",
      date: "February 28, 2024",
      readTime: "15 min read",
      category: "Neuroscience",
      thumbnail: research1,
      size: "medium",
      price: "50 € / 4,50/NUIT"
    },
    {
      id: "6",
      type: "article",
      title: "La tabouret qui marche. Boris Tellegen",
      description: "Adaptive furniture solutions for dynamic learning environments.",
      author: "Prof. Lisa Williams",
      date: "February 25, 2024",
      readTime: "6 min read",
      category: "Innovation",
      thumbnail: video2,
      size: "small"
    },
    {
      id: "7",
      type: "research",
      title: "Le Vladimir en sous-marin",
      description: "Underwater research facilities and their applications in marine biology education.",
      author: "Dr. Vladimir Petrov",
      date: "February 20, 2024",
      readTime: "18 min read",
      category: "Marine Science",
      thumbnail: research2,
      size: "large",
      price: "595,9 bitcoins"
    },
    {
      id: "8",
      type: "video",
      title: "Ferrari Adria, l'intégral d'el Bulli 2005-2011",
      description: "Culinary arts integration in hospitality education programs.",
      author: "Chef Rodriguez",
      date: "February 15, 2024",
      readTime: "35 min watch",
      category: "Culinary Arts",
      thumbnail: video1,
      size: "medium",
      price: "550 € / OUVRAGE"
    },
    {
      id: "9",
      type: "article",
      title: "La voiture à pédales hybride",
      description: "Sustainable transportation solutions for campus mobility.",
      author: "Engineering Dept.",
      date: "February 10, 2024",
      readTime: "7 min read",
      category: "Engineering",
      thumbnail: article1,
      size: "small"
    }
  ];

  const filteredItems = contentItems.filter(item => 
    activeFilter === "all" || 
    (activeFilter === "articles" && (item.type === "article" || item.type === "feature")) ||
    (activeFilter === "research" && item.type === "research") ||
    (activeFilter === "videos" && item.type === "video")
  );

  const getSizeClasses = (size: string) => {
    switch (size) {
      case "featured":
        return "md:col-span-2 md:row-span-2 h-[500px]";
      case "large":
        return "md:col-span-2 h-[400px]";
      case "medium":
        return "h-[350px]";
      case "small":
        return "h-[280px]";
      default:
        return "h-[350px]";
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "article": return <FileText className="h-3 w-3" />;
      case "research": return <BookOpen className="h-3 w-3" />;
      case "video": return <Play className="h-3 w-3" />;
      case "feature": return <Bitcoin className="h-3 w-3" />;
      default: return <FileText className="h-3 w-3" />;
    }
  };

  return (
    <section className="py-16 px-6 bg-background">
      <div className="container mx-auto max-w-7xl">
        {/* Magazine-style filter tabs */}
        <div className="flex justify-center mb-12 border-b border-border">
          <div className="flex items-center space-x-0">
            {[
              { key: "all" as const, label: "TOUS" },
              { key: "articles" as const, label: "ART" },
              { key: "research" as const, label: "RECHERCHE" },
              { key: "videos" as const, label: "VIDÉOS" }
            ].map((filter, index) => (
              <div key={filter.key} className="flex items-center">
                <button
                  onClick={() => setActiveFilter(filter.key)}
                  className={`px-6 py-3 text-xs font-body font-medium uppercase tracking-[0.1em] transition-all duration-200 border-b-2 ${
                    activeFilter === filter.key
                      ? "border-foreground text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {filter.label}
                </button>
                {index < 3 && (
                  <div className="w-px h-6 bg-border mx-2" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Masonry Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-min">
          {filteredItems.map((item) => (
            <Card 
              key={item.id} 
              className={`academic-card smooth-hover group overflow-hidden relative ${getSizeClasses(item.size)}`}
            >
              {/* Image */}
              <div className="relative h-full overflow-hidden">
                <img 
                  src={item.thumbnail}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                {/* Content Overlay */}
                <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                  {/* Category Badge */}
                  <div className="mb-3">
                    <Badge className="bg-white/20 text-white border-white/30 font-body text-xs backdrop-blur-sm">
                      <span className="flex items-center gap-1">
                        {getIcon(item.type)}
                        {item.category}
                      </span>
                    </Badge>
                  </div>

                  {/* Title */}
                  <h3 className="academic-title text-lg md:text-xl mb-2 group-hover:text-white/90 transition-colors duration-300">
                    {item.title}
                  </h3>

                  {/* Description - only show on larger cards */}
                  {(item.size === "featured" || item.size === "large") && (
                    <p className="font-body text-sm text-white/80 mb-3 line-clamp-2">
                      {item.description}
                    </p>
                  )}

                  {/* Price - Magazine style */}
                  {item.price && (
                    <div className="mb-3">
                      <span className="font-academic text-lg font-semibold text-white">
                        {item.price}
                      </span>
                    </div>
                  )}

                  {/* Meta Info */}
                  <div className="flex items-center justify-between text-xs font-body text-white/70">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {item.author.split(' ')[0]}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {item.readTime}
                      </span>
                    </div>
                    <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>

                {/* Featured Badge */}
                {item.featured && (
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-accent text-accent-foreground font-body text-xs">
                      FEATURED
                    </Badge>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* Load More - Magazine Style */}
        <div className="text-center mt-16 border-t border-border pt-8">
          <Button 
            variant="outline" 
            className="rounded-none border-2 border-foreground text-foreground hover:bg-foreground hover:text-background font-body font-medium px-8 py-3 uppercase tracking-[0.1em] text-xs transition-all duration-300"
          >
            Charger Plus
          </Button>
        </div>
      </div>
    </section>
  );
};

export default MasonryGrid;