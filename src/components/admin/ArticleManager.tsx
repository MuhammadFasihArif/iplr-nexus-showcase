import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Calendar, User, Eye, Star, Trash2 } from "lucide-react";
import { format } from "date-fns";

interface Article {
  id: string;
  title: string;
  author: string;
  category: string;
  featured: boolean;
  published: boolean;
  created_at: string;
}

const ArticleManager = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchArticles = async () => {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('id, title, author, category, featured, published, created_at')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      
      setArticles(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch articles",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFeatured = async (id: string, featured: boolean) => {
    try {
      const { error } = await supabase
        .from('articles')
        .update({ featured: !featured })
        .eq('id', id);

      if (error) throw error;

      setArticles(articles.map(article => 
        article.id === id 
          ? { ...article, featured: !featured }
          : article
      ));

      toast({
        title: "Success",
        description: `Article ${!featured ? 'marked as featured' : 'removed from featured'}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update article",
        variant: "destructive",
      });
    }
  };

  const togglePublished = async (id: string, published: boolean) => {
    try {
      const { error } = await supabase
        .from('articles')
        .update({ published: !published })
        .eq('id', id);

      if (error) throw error;

      setArticles(articles.map(article => 
        article.id === id 
          ? { ...article, published: !published }
          : article
      ));

      toast({
        title: "Success",
        description: `Article ${!published ? 'published' : 'unpublished'}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update article",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-3 border border-border rounded-md animate-pulse">
            <div className="h-4 bg-muted rounded mb-2"></div>
            <div className="h-3 bg-muted rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No articles found</p>
        <p className="text-sm">Upload your first article to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {articles.map((article) => (
        <div key={article.id} className="p-4 border border-border rounded-md space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h4 className="font-medium truncate">{article.title}</h4>
              <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                <span className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {article.author}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {format(new Date(article.created_at), 'MMM dd')}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 ml-2">
              {article.featured && (
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
              )}
              <Badge variant={article.published ? "default" : "secondary"}>
                {article.published ? "Published" : "Draft"}
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => toggleFeatured(article.id, article.featured)}
              className="text-xs"
            >
              <Star className="h-3 w-3 mr-1" />
              {article.featured ? "Unfeature" : "Feature"}
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              onClick={() => togglePublished(article.id, article.published)}
              className="text-xs"
            >
              <Eye className="h-3 w-3 mr-1" />
              {article.published ? "Unpublish" : "Publish"}
            </Button>

            <Badge variant="outline" className="text-xs">
              {article.category}
            </Badge>
          </div>
        </div>
      ))}
      
      <div className="text-center pt-2">
        <Button variant="ghost" size="sm" className="text-xs">
          View All Articles
        </Button>
      </div>
    </div>
  );
};

export default ArticleManager;