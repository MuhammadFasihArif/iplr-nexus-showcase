import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Image, Video, Trash2, Eye, Download, Search, Filter } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface MediaItem {
  id: string;
  filename: string;
  file_url: string;
  file_type: string;
  mime_type: string;
  file_size: number;
  alt_text: string;
  description: string | null;
  created_at: string;
}

const MediaGallery = () => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const { toast } = useToast();

  const fetchMedia = async () => {
    try {
      const { data, error } = await supabase
        .from('media_uploads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMediaItems(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch media items",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteMedia = async (id: string, filename: string) => {
    try {
      // Delete from storage if it's an uploaded file
      if (filename && !filename.startsWith('http')) {
        const { error: storageError } = await supabase.storage
          .from('media')
          .remove([filename]);
        
        if (storageError) {
          console.warn('Failed to remove storage object:', storageError);
        }
      }

      // Delete from database
      const { error } = await supabase
        .from('media_uploads')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Media item deleted successfully",
      });

      fetchMedia();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete media item",
        variant: "destructive",
      });
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const filteredMedia = mediaItems.filter(item => {
    const matchesSearch = item.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.alt_text.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = filterType === "all" || item.file_type === filterType;
    
    return matchesSearch && matchesFilter;
  });

  useEffect(() => {
    fetchMedia();
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <Card key={i} className="p-4 animate-pulse">
            <div className="aspect-video bg-muted rounded mb-3"></div>
            <div className="h-4 bg-muted rounded mb-2"></div>
            <div className="h-3 bg-muted rounded w-1/2"></div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Media Gallery</h3>
        <div className="text-sm text-muted-foreground">
          {filteredMedia.length} of {mediaItems.length} items
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search media..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="image">Images</SelectItem>
            <SelectItem value="video_link">Video Links</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Media Grid */}
      {filteredMedia.length === 0 ? (
        <div className="text-center py-12">
          <Image className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No media found</h3>
          <p className="text-muted-foreground">
            {searchTerm || filterType !== "all" 
              ? "Try adjusting your search or filter criteria"
              : "Upload some images or add video links to get started"
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredMedia.map((item) => (
            <Card key={item.id} className="overflow-hidden hover:shadow-md transition-shadow">
              {/* Media Preview */}
              <div className="aspect-video bg-muted relative group">
                {item.file_type === 'image' ? (
                  <img
                    src={item.file_url}
                    alt={item.alt_text}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Video className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
                
                {/* Overlay Actions */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setSelectedItem(item)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  {item.file_type === 'image' && (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => window.open(item.file_url, '_blank')}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Media Info */}
              <div className="p-3">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-sm truncate flex-1" title={item.filename}>
                    {item.filename}
                  </h4>
                  <Badge variant="outline" className="text-xs ml-2">
                    {item.file_type === 'image' ? 'Image' : 'Video'}
                  </Badge>
                </div>
                
                <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                  {item.alt_text}
                </p>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{formatFileSize(item.file_size)}</span>
                  <span>{new Date(item.created_at).toLocaleDateString()}</span>
                </div>

                {/* Actions */}
                <div className="flex gap-1 mt-3">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 text-xs"
                    onClick={() => setSelectedItem(item)}
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    View
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="destructive" className="text-xs">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete this media item?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the media item{item.file_type === 'image' ? ' and its file' : ''}.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteMedia(item.id, item.filename)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

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
                  <X className="h-4 w-4" />
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
                  ) : (
                    <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <Video className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">Video Link</p>
                        <Button
                          variant="outline"
                          className="mt-2"
                          onClick={() => window.open(selectedItem.file_url, '_blank')}
                        >
                          Open Video
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Media Info */}
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Filename</label>
                    <p className="text-sm">{selectedItem.filename}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Alt Text</label>
                    <p className="text-sm">{selectedItem.alt_text}</p>
                  </div>

                  {selectedItem.description && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Description</label>
                      <p className="text-sm">{selectedItem.description}</p>
                    </div>
                  )}

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Type</label>
                    <p className="text-sm">{selectedItem.file_type === 'image' ? 'Image' : 'Video Link'}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Size</label>
                    <p className="text-sm">{formatFileSize(selectedItem.file_size)}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Uploaded</label>
                    <p className="text-sm">{new Date(selectedItem.created_at).toLocaleString()}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">URL</label>
                    <div className="flex gap-2">
                      <Input
                        value={selectedItem.file_url}
                        readOnly
                        className="text-xs"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          navigator.clipboard.writeText(selectedItem.file_url);
                          toast({
                            title: "Copied",
                            description: "URL copied to clipboard",
                          });
                        }}
                      >
                        Copy
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default MediaGallery;
