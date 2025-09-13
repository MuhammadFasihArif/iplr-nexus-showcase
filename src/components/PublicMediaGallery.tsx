import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Image, Video, ExternalLink, Eye } from "lucide-react";
import HoverVideoPlayer from "./HoverVideoPlayer";

interface MediaItem {
  id: string;
  filename: string;
  file_url: string;
  file_type: string;
  mime_type: string;
  file_size: number;
  alt_text: string;
  description: string | null;
  title: string | null;
  is_thumbnail?: boolean;
  created_at: string;
  external_url?: string;
}

const PublicMediaGallery = () => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);

  const fetchMedia = async () => {
    try {
      const { data, error } = await supabase
        .from('media_uploads')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(12); // Show only latest 12 items

      if (error) throw error;
      setMediaItems(data || []);
    } catch (error) {
      console.error('Failed to fetch media items:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  if (isLoading) {
    return (
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Media Gallery</h2>
            <p className="text-muted-foreground">Loading our latest media...</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <Card key={i} className="overflow-hidden animate-pulse">
                <div className="aspect-video bg-muted"></div>
                <div className="p-4">
                  <div className="h-4 bg-muted rounded mb-2"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (mediaItems.length === 0) {
    return (
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Media Gallery</h2>
            <p className="text-muted-foreground">No media available yet. Check back soon!</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Media Gallery</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore our collection of images and videos showcasing our latest work and achievements.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {mediaItems.map((item) => (
            <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
              {/* Media Preview */}
              <div className="aspect-video bg-muted relative overflow-hidden">
                {item.file_type === 'image' ? (
                  <img
                    src={item.file_url}
                    alt={item.alt_text}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : item.file_type === 'video_file' ? (
                  <HoverVideoPlayer
                    videoUrl={item.file_url}
                    title={item.title || item.alt_text}
                    className="w-full h-full"
                    previewDuration={5}
                  />
                ) : item.file_type === 'video_thumbnail' ? (
                  <div className="relative w-full h-full">
                    <img
                      src={item.file_url}
                      alt={item.alt_text}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {/* Play button overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-black/50 rounded-full p-3 group-hover:bg-black/70 transition-colors">
                        <ExternalLink className="h-8 w-8 text-white" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                    <div className="text-center">
                      <Video className="h-12 w-12 text-blue-600 mx-auto mb-2" />
                      <p className="text-sm text-blue-600 font-medium">Video Link</p>
                    </div>
                  </div>
                )}
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    onClick={() => setSelectedItem(item)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                </div>

                {/* Type Badge */}
                <div className="absolute top-2 right-2">
                  <Badge variant="secondary" className="text-xs">
                    {item.file_type === 'image' ? 'Image' : 
                     item.file_type === 'video_thumbnail' ? 'Video' : 'Video Link'}
                  </Badge>
                </div>
              </div>

              {/* Media Info */}
              <div className="p-4">
                <h3 className="font-semibold text-sm mb-2 line-clamp-2" title={item.alt_text}>
                  {item.alt_text}
                </h3>
                
                {item.description && (
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                    {item.description}
                  </p>
                )}
                
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{new Date(item.created_at).toLocaleDateString()}</span>
                  {(item.file_type === 'video_link' || item.file_type === 'video_thumbnail') && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 px-2 text-xs"
                      onClick={() => window.open(item.external_url || item.file_url, '_blank')}
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Watch
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* View More Button */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            View All Media
          </Button>
        </div>
      </div>

      {/* Media Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Media Details</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedItem(null)}
                >
                  ×
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Media Preview */}
                <div>
                  {selectedItem.file_type === 'image' ? (
                    <img
                      src={selectedItem.file_url}
                      alt={selectedItem.alt_text}
                      className="w-full rounded-lg"
                    />
                  ) : selectedItem.file_type === 'video_file' ? (
                    <div className="aspect-video bg-black rounded-lg overflow-hidden">
                      <HoverVideoPlayer
                        videoUrl={selectedItem.file_url}
                        title={selectedItem.title || selectedItem.alt_text}
                        className="w-full h-full"
                        previewDuration={5}
                      />
                    </div>
                  ) : selectedItem.file_type === 'video_thumbnail' ? (
                    <div className="relative">
                      <img
                        src={selectedItem.file_url}
                        alt={selectedItem.alt_text}
                        className="w-full rounded-lg"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Button
                          size="lg"
                          className="bg-black/50 hover:bg-black/70"
                          onClick={() => window.open(selectedItem.external_url, '_blank')}
                        >
                          <ExternalLink className="h-6 w-6 mr-2" />
                          Watch Video
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <Video className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground mb-4">Video Link</p>
                        <Button
                          variant="outline"
                          onClick={() => window.open(selectedItem.file_url, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Open Video
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Media Info */}
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Title</label>
                    <p className="text-sm">{selectedItem.title || selectedItem.alt_text}</p>
                  </div>

                  {selectedItem.description && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Description</label>
                      <p className="text-sm">{selectedItem.description}</p>
                    </div>
                  )}

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Type</label>
                    <p className="text-sm">
                      {selectedItem.file_type === 'image' ? 'Image' : 
                       selectedItem.file_type === 'video_file' ? 'Video File' :
                       selectedItem.file_type === 'video_thumbnail' ? 'Video Thumbnail' : 'Video Link'}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Uploaded</label>
                    <p className="text-sm">{new Date(selectedItem.created_at).toLocaleString()}</p>
                  </div>

                  {(selectedItem.file_type === 'video_link' || selectedItem.file_type === 'video_thumbnail') && (
                    <div>
                      <Button
                        variant="default"
                        className="w-full"
                        onClick={() => window.open(selectedItem.external_url || selectedItem.file_url, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Watch Video
                      </Button>
                    </div>
                  )}
                  
                  {selectedItem.file_type === 'video_file' && (
                    <div>
                      <Button
                        variant="default"
                        className="w-full"
                        onClick={() => window.open(selectedItem.file_url, '_blank')}
                      >
                        <Video className="h-4 w-4 mr-2" />
                        Open Video
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </section>
  );
};

export default PublicMediaGallery;
