import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Upload, Image, Link, Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const imageSchema = z.object({
  alt_text: z.string().min(1, "Alt text is required"),
  description: z.string().optional(),
});

const videoSchema = z.object({
  title: z.string().min(1, "Title is required"),
  url: z.string().url("Please enter a valid URL"),
  description: z.string().optional(),
});

type ImageForm = z.infer<typeof imageSchema>;
type VideoForm = z.infer<typeof videoSchema>;

const MediaUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();
  
  const imageForm = useForm<ImageForm>({
    resolver: zodResolver(imageSchema),
    defaultValues: {
      alt_text: "",
      description: "",
    },
  });

  const videoForm = useForm<VideoForm>({
    resolver: zodResolver(videoSchema),
    defaultValues: {
      title: "",
      url: "",
      description: "",
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
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

  const onImageSubmit = async (data: ImageForm) => {
    if (!selectedFile) {
      toast({
        title: "File Required",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      // Upload image
      const fileName = `${Date.now()}-${selectedFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(fileName, selectedFile);

      if (uploadError) {
        throw new Error("Failed to upload image");
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(fileName);

      // Save media record
      const { error } = await supabase
        .from('media_uploads')
        .insert({
          filename: selectedFile.name,
          file_url: publicUrl,
          file_type: 'image',
          mime_type: selectedFile.type,
          file_size: selectedFile.size,
          alt_text: data.alt_text,
          description: data.description || null,
        });

      if (error) {
        throw new Error("Failed to save media record");
      }

      toast({
        title: "Image Uploaded",
        description: "Image has been successfully uploaded",
      });

      // Reset form
      imageForm.reset();
      setSelectedFile(null);
      const fileInput = document.getElementById('image-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

    } catch (error) {
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "An error occurred during upload",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const onVideoSubmit = async (data: VideoForm) => {
    setIsUploading(true);
    try {
      // Save video link
      const { error } = await supabase
        .from('media_uploads')
        .insert({
          filename: data.title,
          file_url: data.url,
          file_type: 'video_link',
          mime_type: 'text/url',
          file_size: 0,
          alt_text: data.title,
          description: data.description || null,
        });

      if (error) {
        throw new Error("Failed to save video link");
      }

      toast({
        title: "Video Link Added",
        description: "Video link has been successfully added",
      });

      // Reset form
      videoForm.reset();

    } catch (error) {
      toast({
        title: "Save Failed",
        description: error instanceof Error ? error.message : "An error occurred while saving",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Tabs defaultValue="images" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="images">Images</TabsTrigger>
        <TabsTrigger value="videos">Video Links</TabsTrigger>
      </TabsList>
      
      <TabsContent value="images" className="space-y-4">
        <Form {...imageForm}>
          <form onSubmit={imageForm.handleSubmit(onImageSubmit)} className="space-y-4">
            {/* File Upload */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Upload Image</label>
              <div className="flex items-center gap-4">
                <Input
                  id="image-upload"
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
            </div>

            <FormField
              control={imageForm.control}
              name="alt_text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alt Text</FormLabel>
                  <FormControl>
                    <Input placeholder="Describe the image for accessibility" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={imageForm.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Additional description for the image"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full"
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Image
                </>
              )}
            </Button>
          </form>
        </Form>
      </TabsContent>
      
      <TabsContent value="videos" className="space-y-4">
        <Form {...videoForm}>
          <form onSubmit={videoForm.handleSubmit(onVideoSubmit)} className="space-y-4">
            <FormField
              control={videoForm.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Video Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter video title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={videoForm.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Video URL</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..." 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={videoForm.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Description of the video content"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full"
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Link className="mr-2 h-4 w-4" />
                  Add Video Link
                </>
              )}
            </Button>
          </form>
        </Form>
      </TabsContent>
    </Tabs>
  );
};

export default MediaUpload;