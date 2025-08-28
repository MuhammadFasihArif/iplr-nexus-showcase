import { useState } from "react";
import { Play, FileText, BookOpen, Clock, User, ExternalLink } from "lucide-react";
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
  type: "article" | "research" | "video";
  title: string;
  description: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  thumbnail: string;
  featured?: boolean;
}

const ContentGrid = () => {
  const [activeFilter, setActiveFilter] = useState<"all" | "articles" | "research" | "videos">("all");

  // Sample content data
  const contentItems: ContentItem[] = [
    {
      id: "1",
      type: "article",
      title: "The Future of Digital Learning Environments",
      description: "Exploring how technology is reshaping educational experiences and creating new opportunities for student engagement.",
      author: "Dr. Sarah Chen",
      date: "March 15, 2024",
      readTime: "5 min read",
      category: "Educational Technology",
      thumbnail: article1,
      featured: true
    },
    {
      id: "2",
      type: "research",
      title: "Cognitive Load Theory in Modern Curriculum Design",
      description: "A comprehensive study examining the application of cognitive load principles in contemporary educational frameworks.",
      author: "Prof. Michael Johnson",
      date: "March 10, 2024",
      readTime: "12 min read",
      category: "Cognitive Science",
      thumbnail: research1
    },
    {
      id: "3",
      type: "video",
      title: "Innovation in STEM Education",
      description: "Watch our panel discussion on revolutionary approaches to science, technology, engineering, and mathematics education.",
      author: "IPLR Research Team",
      date: "March 8, 2024",
      readTime: "25 min watch",
      category: "STEM Education",
      thumbnail: video1
    },
    {
      id: "4",
      type: "article",
      title: "Assessment Methods in Higher Education",
      description: "Examining innovative assessment techniques that better measure student learning outcomes and academic progress.",
      author: "Dr. Amanda Rodriguez",
      date: "March 5, 2024",
      readTime: "8 min read",
      category: "Assessment",
      thumbnail: article2
    },
    {
      id: "5",
      type: "research",
      title: "Machine Learning Applications in Educational Analytics",
      description: "Research findings on how artificial intelligence can enhance personalized learning experiences and academic interventions.",
      author: "Dr. James Park",
      date: "February 28, 2024",
      readTime: "15 min read",
      category: "AI & Education",
      thumbnail: research2,
      featured: true
    },
    {
      id: "6",
      type: "video",
      title: "Faculty Development Workshop Series",
      description: "Professional development sessions designed to enhance teaching methodologies and academic leadership skills.",
      author: "Prof. Lisa Williams",
      date: "February 25, 2024",
      readTime: "40 min watch",
      category: "Professional Development",
      thumbnail: video2
    }
  ];

  const filteredItems = contentItems.filter(item => 
    activeFilter === "all" || 
    (activeFilter === "articles" && item.type === "article") ||
    (activeFilter === "research" && item.type === "research") ||
    (activeFilter === "videos" && item.type === "video")
  );

  const getIcon = (type: string) => {
    switch (type) {
      case "article": return <FileText className="h-4 w-4" />;
      case "research": return <BookOpen className="h-4 w-4" />;
      case "video": return <Play className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "article": return "bg-blue-100 text-blue-800 border-blue-200";
      case "research": return "bg-green-100 text-green-800 border-green-200";
      case "video": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <section className="py-16 px-6 bg-background">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-academic font-bold text-foreground mb-4">
            Latest Publications & Resources
          </h2>
          <p className="text-lg font-body text-muted-foreground max-w-2xl mx-auto">
            Discover our latest research findings, educational articles, and video content designed to advance learning and professional development.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {[
            { key: "all" as const, label: "All Content" },
            { key: "articles" as const, label: "Articles" },
            { key: "research" as const, label: "Research" },
            { key: "videos" as const, label: "Videos" }
          ].map((filter) => (
            <Button
              key={filter.key}
              variant={activeFilter === filter.key ? "default" : "outline"}
              onClick={() => setActiveFilter(filter.key)}
              className="rounded-full font-body font-medium transition-all duration-300"
            >
              {filter.label}
            </Button>
          ))}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <Card key={item.id} className="academic-card smooth-hover group overflow-hidden">
              {/* Thumbnail */}
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={item.thumbnail}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {item.featured && (
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-accent text-accent-foreground font-body text-xs">
                      Featured
                    </Badge>
                  </div>
                )}
                <div className="absolute top-3 right-3">
                  <Badge className={`${getTypeColor(item.type)} font-body text-xs border`}>
                    <span className="flex items-center gap-1">
                      {getIcon(item.type)}
                      {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                    </span>
                  </Badge>
                </div>
              </div>

              <CardContent className="p-6">
                {/* Category */}
                <p className="academic-subtitle mb-2">
                  {item.category}
                </p>

                {/* Title */}
                <h3 className="academic-title text-lg mb-3 group-hover:text-accent transition-colors duration-300">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="academic-text text-sm mb-4 line-clamp-3">
                  {item.description}
                </p>

                {/* Meta Information */}
                <div className="flex items-center justify-between text-xs font-body text-muted-foreground mb-4">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {item.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {item.readTime}
                    </span>
                  </div>
                </div>

                {/* Action Button */}
                <Button 
                  variant="ghost" 
                  className="w-full justify-between font-body font-medium hover:bg-accent hover:text-accent-foreground transition-all duration-300"
                >
                  <span>
                    {item.type === "video" ? "Watch Now" : "Read More"}
                  </span>
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-12">
          <Button 
            variant="outline" 
            size="lg"
            className="rounded-full font-body font-medium px-8 py-6 hover:bg-accent hover:text-accent-foreground transition-all duration-300"
          >
            Load More Content
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ContentGrid;