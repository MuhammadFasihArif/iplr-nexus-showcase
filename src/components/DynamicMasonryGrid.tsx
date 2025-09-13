import { useState, useEffect } from "react";
import { Play, FileText, BookOpen, Clock, User, ExternalLink, Star, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { downloadOriginalFile, getFileTypeIcon } from "@/lib/fileDownloader";
import HoverVideoPlayer from "./HoverVideoPlayer";

interface Article {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  featured?: boolean;
  featured_image_url?: string;
  featured_image_alt?: string;
  file_url?: string;
}

interface MediaItem {
  id: string;
  filename: string;
  file_url: string;
  file_type: string;
  mime_type: string;
  file_size: number;
  alt_text?: string;
  description?: string;
  title?: string;
  external_url?: string;
  is_thumbnail?: boolean;
  created_at: string;
}

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
  size: "small" | "medium" | "large" | "featured";
  external_url?: string;
  file_url?: string;
  file_type?: string;
}

const DynamicMasonryGrid = () => {
  const [activeFilter, setActiveFilter] = useState<"all" | "articles" | "research" | "videos">("all");
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      setLoading(true);
      
      // Fetch all published articles
      const { data: allArticles, error: articlesError } = await supabase
        .from('articles')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false })
        .limit(20);

      // Separate articles with featured images from those without
      const articles = allArticles?.filter(article => article.featured_image_url) || [];
      const research = allArticles?.filter(article => 
        !article.featured_image_url && 
        (article.category.toLowerCase().includes('research') || 
         article.category.toLowerCase().includes('study') || 
         article.category.toLowerCase().includes('analysis'))
      ) || [];

      if (articlesError) {
        console.error('Error fetching articles:', articlesError);
      }

      // Fetch video thumbnails and video files
      const { data: media, error: mediaError } = await supabase
        .from('media_uploads')
        .select('*')
        .in('file_type', ['video_thumbnail', 'video_file'])
        .order('created_at', { ascending: false })
        .limit(8);

      if (mediaError) {
        console.error('Error fetching media:', mediaError);
      }

      // Transform enhanced articles to content items
      const articleItems: ContentItem[] = (articles || []).map((article, index) => ({
        id: `article-${article.id}`,
        type: "article" as const,
        title: article.title,
        description: article.content?.substring(0, 150) + "..." || "Read more about this enhanced article.",
        author: article.author,
        date: new Date(article.created_at).toLocaleDateString(),
        readTime: `${Math.ceil((article.content?.length || 0) / 500)} min read`,
        category: article.category,
        thumbnail: article.featured_image_url || "/placeholder.svg",
        featured: true,
        size: index === 0 ? "featured" as const : index < 2 ? "large" as const : "medium" as const,
        file_url: article.file_url
      }));

      // Transform research articles to content items
      const researchItems: ContentItem[] = (research || []).map((article, index) => ({
        id: `research-${article.id}`,
        type: "research" as const,
        title: article.title,
        description: article.content?.substring(0, 150) + "..." || "Read more about this research study.",
        author: article.author,
        date: new Date(article.created_at).toLocaleDateString(),
        readTime: `${Math.ceil((article.content?.length || 0) / 500)} min read`,
        category: article.category,
        thumbnail: article.featured_image_url || "/placeholder.svg",
        featured: false,
        size: index < 2 ? "medium" as const : "small" as const,
        file_url: article.file_url
      }));

      // Transform video thumbnails and video files to content items
      const videoItems: ContentItem[] = (media || []).map((item, index) => ({
        id: `video-${item.id}`,
        type: "video" as const,
        title: item.title || item.alt_text || "Educational Video",
        description: item.description || "Watch this educational content",
        author: "IPLR",
        date: new Date(item.created_at).toLocaleDateString(),
        readTime: "Watch",
        category: "Video",
        thumbnail: item.file_url,
        size: index < 2 ? "medium" as const : "small" as const,
        external_url: item.external_url,
        file_type: item.file_type
      }));

      // Combine all content types
      const allItems = [...articleItems, ...researchItems, ...videoItems];
      setContentItems(allItems);
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = contentItems.filter(item => 
    activeFilter === "all" || 
    (activeFilter === "articles" && item.type === "article") ||
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
      default: return <FileText className="h-3 w-3" />;
    }
  };

  const handleItemClick = (item: ContentItem) => {
    if (item.type === "video") {
      if (item.file_type === "video_file") {
        // For video files, open the video URL
        window.open(item.thumbnail, '_blank');
      } else if (item.external_url) {
        // For video thumbnails, open external URL
        window.open(item.external_url, '_blank');
      }
    } else if (item.type === "article" || item.type === "research") {
      // Scroll to article display section
      const articleSection = document.getElementById('article-display');
      if (articleSection) {
        articleSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleDownload = async (e: React.MouseEvent, article: Article) => {
    e.stopPropagation(); // Prevent card click
    
    if (!article.file_url) {
      alert('No original file available for download');
      return;
    }

    try {
      // Extract filename from the file URL
      const urlParts = article.file_url.split('/');
      const fileName = urlParts[urlParts.length - 1];
      
      await downloadOriginalFile(article.file_url, fileName);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download file. Please try again.');
    }
  };

  if (loading) {
    return (
      <section className="py-16 px-6 bg-background">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading featured content...</p>
          </div>
        </div>
      </section>
    );
  }

  if (contentItems.length === 0) {
    return (
      <section className="py-16 px-6 bg-background">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center">
            <h3 className="text-2xl font-academic font-bold text-foreground mb-4">Featured Content</h3>
            <p className="font-body text-muted-foreground mb-8">
              No featured content available yet. Upload some articles and videos to see them here!
            </p>
            <Button 
              onClick={() => window.location.href = '/admin'}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Go to Admin Panel
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-6 bg-background">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-academic font-bold text-foreground mb-4">Featured Content</h2>
          <p className="font-body text-muted-foreground">Discover our latest articles and educational videos</p>
        </div>

        {/* Filter tabs */}
        <div className="flex justify-center mb-12 border-b border-border">
          <div className="flex items-center">
            {[
              { key: "all" as const, label: "ALL" },
              { key: "articles" as const, label: "ARTICLES" },
              { key: "research" as const, label: "RESEARCH" },
              { key: "videos" as const, label: "VIDEOS" }
            ].map((filter) => (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key)}
                className={`px-8 py-3 text-xs font-body font-medium uppercase tracking-[0.1em] transition-all duration-200 border-b-2 ${
                  activeFilter === filter.key
                    ? "border-foreground text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Masonry Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 auto-rows-min">
          {filteredItems.map((item) => (
            <Card 
              key={item.id} 
              className={`academic-card smooth-hover group overflow-hidden relative border border-border/50 shadow-sm cursor-pointer ${getSizeClasses(item.size)}`}
              onClick={() => handleItemClick(item)}
            >
              {/* Image */}
              <div className="relative h-full overflow-hidden">
                {item.type === "video" && item.file_type === "video_file" ? (
                  <HoverVideoPlayer
                    videoUrl={item.thumbnail}
                    title={item.title}
                    className="absolute inset-0 w-full h-full"
                    previewDuration={5}
                  />
                ) : (
                  <img 
                    src={item.thumbnail}
                    alt={item.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                )}
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                {/* Video Play Button Overlay */}
                {item.type === "video" && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30 group-hover:bg-white/30 transition-all duration-300">
                      <Play className="h-6 w-6 text-white ml-1" />
                    </div>
                  </div>
                )}
                
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
                    <div className="flex items-center gap-2">
                      {(item.type === "article" || item.type === "research") && item.file_url && (
                        <button
                          onClick={(e) => handleDownload(e, item as any)}
                          className="p-1 rounded-full bg-white/20 hover:bg-white/30 transition-colors duration-200"
                          title="Download original file"
                        >
                          <Download className="h-3 w-3 text-white" />
                        </button>
                      )}
                      <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </div>
                </div>

                {/* Featured Badge */}
                {item.featured && (
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-accent text-accent-foreground font-body text-xs">
                      <Star className="h-3 w-3 mr-1" />
                      FEATURED
                    </Badge>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-16 border-t border-border pt-8">
          <Button 
            variant="outline" 
            className="rounded-none border-2 border-foreground text-foreground hover:bg-foreground hover:text-background font-body font-medium px-8 py-3 uppercase tracking-[0.1em] text-xs transition-all duration-300"
            onClick={fetchContent}
          >
            Refresh Content
          </Button>
        </div>
      </div>
    </section>
  );
};

export default DynamicMasonryGrid;
