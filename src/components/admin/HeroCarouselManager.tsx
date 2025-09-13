import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Upload, Image, Edit, Trash2, Save, X, Plus, ArrowUp, ArrowDown } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image_url: string;
  order_index: number;
  is_active: boolean;
}

const HeroCarouselManager = () => {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();

  const fetchSlides = async () => {
    try {
      const { data, error } = await supabase
        .from('hero_slides')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;
      setSlides(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch hero slides",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File Type",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
  };

  const uploadImage = async (file: File): Promise<string> => {
    const fileName = `hero-${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from('media')
      .upload(fileName, file);

    if (uploadError) {
      throw new Error("Failed to upload image");
    }

    const { data: { publicUrl } } = supabase.storage
      .from('media')
      .getPublicUrl(fileName);

    return publicUrl;
  };

  const saveSlide = async (slideData: Partial<HeroSlide>) => {
    setIsUploading(true);
    try {
      let imageUrl = slideData.image_url;

      // Upload new image if selected
      if (selectedFile) {
        imageUrl = await uploadImage(selectedFile);
      }

      if (editingSlide?.id) {
        // Update existing slide
        const { error } = await supabase
          .from('hero_slides')
          .update({
            title: slideData.title,
            subtitle: slideData.subtitle,
            description: slideData.description,
            image_url: imageUrl,
            is_active: slideData.is_active,
          })
          .eq('id', editingSlide.id);

        if (error) {
          console.error('Update error:', error);
          throw new Error(`Failed to update slide: ${error.message}`);
        }
      } else {
        // Create new slide
        const maxOrder = Math.max(...slides.map(s => s.order_index), 0);
        const { error } = await supabase
          .from('hero_slides')
          .insert({
            title: slideData.title,
            subtitle: slideData.subtitle,
            description: slideData.description,
            image_url: imageUrl,
            order_index: maxOrder + 1,
            is_active: slideData.is_active ?? true,
          });

        if (error) {
          console.error('Insert error:', error);
          throw new Error(`Failed to create slide: ${error.message}`);
        }
      }

      toast({
        title: "Success",
        description: `Slide ${editingSlide?.id ? 'updated' : 'created'} successfully`,
      });

      setEditingSlide(null);
      setSelectedFile(null);
      fetchSlides();
    } catch (error) {
      console.error('Save slide error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save slide",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const deleteSlide = async (id: string) => {
    try {
      const { error } = await supabase
        .from('hero_slides')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Slide deleted successfully",
      });

      fetchSlides();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete slide",
        variant: "destructive",
      });
    }
  };

  const toggleSlideStatus = async (id: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('hero_slides')
        .update({ is_active: !isActive })
        .eq('id', id);

      if (error) throw error;

      setSlides(slides.map(slide => 
        slide.id === id ? { ...slide, is_active: !isActive } : slide
      ));

      toast({
        title: "Success",
        description: `Slide ${!isActive ? 'activated' : 'deactivated'}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update slide status",
        variant: "destructive",
      });
    }
  };

  const moveSlide = async (id: string, direction: 'up' | 'down') => {
    const currentIndex = slides.findIndex(s => s.id === id);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= slides.length) return;

    const newSlides = [...slides];
    [newSlides[currentIndex], newSlides[newIndex]] = [newSlides[newIndex], newSlides[currentIndex]];

    // Update order indices
    const updates = newSlides.map((slide, index) => ({
      id: slide.id,
      order_index: index + 1
    }));

    try {
      for (const update of updates) {
        await supabase
          .from('hero_slides')
          .update({ order_index: update.order_index })
          .eq('id', update.id);
      }

      setSlides(newSlides);
      toast({
        title: "Success",
        description: "Slide order updated",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update slide order",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-4 animate-pulse">
            <div className="h-4 bg-muted rounded mb-2"></div>
            <div className="h-3 bg-muted rounded w-1/2"></div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Add New Slide Button */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Hero Carousel Slides</h3>
        <Button
          onClick={() => setEditingSlide({
            id: '',
            title: '',
            subtitle: '',
            description: '',
            image_url: '',
            order_index: 0,
            is_active: true
          })}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add New Slide
        </Button>
      </div>

      {/* Slides List */}
      <div className="space-y-4">
        {slides.map((slide, index) => (
          <Card key={slide.id} className="p-4">
            <div className="flex items-start gap-4">
              {/* Slide Image */}
              <div className="w-32 h-20 bg-muted rounded-md overflow-hidden flex-shrink-0">
                {slide.image_url ? (
                  <img
                    src={slide.image_url}
                    alt={slide.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Image className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
              </div>

              {/* Slide Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-medium truncate">{slide.title}</h4>
                    <p className="text-sm text-muted-foreground">{slide.subtitle}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={slide.is_active ? "default" : "secondary"}>
                      {slide.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {slide.description}
                </p>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditingSlide(slide)}
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleSlideStatus(slide.id, slide.is_active)}
                  >
                    {slide.is_active ? "Deactivate" : "Activate"}
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => moveSlide(slide.id, 'up')}
                    disabled={index === 0}
                  >
                    <ArrowUp className="h-3 w-3" />
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => moveSlide(slide.id, 'down')}
                    disabled={index === slides.length - 1}
                  >
                    <ArrowDown className="h-3 w-3" />
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="destructive">
                        <Trash2 className="h-3 w-3 mr-1" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete this slide?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the slide.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteSlide(slide.id)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Edit/Add Slide Modal */}
      {editingSlide && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold">
              {editingSlide.id ? 'Edit Slide' : 'Add New Slide'}
            </h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setEditingSlide(null);
                setSelectedFile(null);
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const isActiveCheckbox = e.currentTarget.querySelector('input[name="is_active"]') as HTMLInputElement;
              saveSlide({
                title: formData.get('title') as string,
                subtitle: formData.get('subtitle') as string,
                description: formData.get('description') as string,
                is_active: isActiveCheckbox?.checked ?? true,
              });
            }}
            className="space-y-4"
          >
            {/* Image Upload */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Slide Image</label>
              <div className="flex items-center gap-4">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="flex-1"
                />
                {selectedFile && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Image className="h-4 w-4" />
                    {selectedFile.name}
                  </div>
                )}
              </div>
              {editingSlide.image_url && !selectedFile && (
                <div className="w-32 h-20 bg-muted rounded-md overflow-hidden">
                  <img
                    src={editingSlide.image_url}
                    alt="Current slide"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>

            <Input
              name="title"
              placeholder="Slide Title"
              defaultValue={editingSlide.title}
              required
            />

            <Input
              name="subtitle"
              placeholder="Slide Subtitle"
              defaultValue={editingSlide.subtitle}
              required
            />

            <Textarea
              name="description"
              placeholder="Slide Description"
              defaultValue={editingSlide.description}
              required
            />

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="is_active"
                defaultChecked={editingSlide.is_active}
                className="rounded"
                value="true"
              />
              <label className="text-sm font-medium">Active</label>
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={isUploading}>
                {isUploading ? (
                  <>
                    <Upload className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Slide
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setEditingSlide(null);
                  setSelectedFile(null);
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
};

export default HeroCarouselManager;
