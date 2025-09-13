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
import { Upload, Image, Link, Loader2, Video, ExternalLink } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const imageSchema = z.object({
  alt_text: z.string().min(1, "Alt text is required"),
  description: z.string().optional(),
});

const videoThumbnailSchema = z.object({
  title: z.string().min(1, "Title is required"),
  external_url: z.string().url("Please enter a valid URL"),
  description: z.string().optional(),
});

const videoLinkSchema = z.object({
  title: z.string().min(1, "Title is required"),
  url: z.string().url("Please enter a valid URL"),
  description: z.string().optional(),
});

const videoFileSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
});

type ImageForm = z.infer<typeof imageSchema>;
type VideoThumbnailForm = z.infer<typeof videoThumbnailSchema>;
type VideoLinkForm = z.infer<typeof videoLinkSchema>;
type VideoFileForm = z.infer<typeof videoFileSchema>;

const EnhancedMediaUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedThumbnail, setSelectedThumbnail] = useState<File | null>(null);
  const [selectedVideoFile, setSelectedVideoFile] = useState<File | null>(null);
  const { toast } = useToast();
  
  const imageForm = useForm<ImageForm>({
    resolver: zodResolver(imageSchema),
    defaultValues: {
      alt_text: "",
      description: "",
    },
  });

  const videoThumbnailForm = useForm<VideoThumbnailForm>({
    resolver: zodResolver(videoThumbnailSchema),
    defaultValues: {
      title: "",
      external_url: "",
      description: "",
    },
  });

  const videoLinkForm = useForm<VideoLinkForm>({
    resolver: zodResolver(videoLinkSchema),
    defaultValues: {
      title: "",
      url: "",
      description: "",
    },
  });

  const videoFileForm = useForm<VideoFileForm>({
    resolver: zodResolver(videoFileSchema),
    defaultValues: {
      title: "",
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

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File Type",
        description: "Please select an image file for thumbnail",
        variant: "destructive",
      });
      return;
    }

    setSelectedThumbnail(file);
  };

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('video/')) {
      toast({
        title: "Invalid File Type",
        description: "Please select a video file",
        variant: "destructive",
      });
      return;
    }

    // Check file size (limit to 50MB - conservative limit for now)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      toast({
        title: "File Too Large",
        description: "Please select a video file smaller than 50MB. For larger files, please compress the video or contact support.",
        variant: "destructive",
      });
      return;
    }

    setSelectedVideoFile(file);
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
          is_thumbnail: false,
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

  const onVideoThumbnailSubmit = async (data: VideoThumbnailForm) => {
    if (!selectedThumbnail) {
      toast({
        title: "Thumbnail Required",
        description: "Please select a thumbnail image",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      // Upload thumbnail
      const fileName = `${Date.now()}-thumbnail-${selectedThumbnail.name}`;
      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(fileName, selectedThumbnail);

      if (uploadError) {
        throw new Error("Failed to upload thumbnail");
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(fileName);

      // Save media record with external URL
      const { error } = await supabase
        .from('media_uploads')
        .insert({
          filename: data.title,
          file_url: publicUrl,
          file_type: 'video_thumbnail',
          mime_type: selectedThumbnail.type,
          file_size: selectedThumbnail.size,
          alt_text: data.title,
          description: data.description || null,
          external_url: data.external_url,
          is_thumbnail: true,
        });

      if (error) {
        throw new Error("Failed to save video thumbnail record");
      }

      toast({
        title: "Video Thumbnail Added",
        description: "Video thumbnail has been successfully added",
      });

      // Reset form
      videoThumbnailForm.reset();
      setSelectedThumbnail(null);
      const fileInput = document.getElementById('thumbnail-upload') as HTMLInputElement;
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

  const onVideoLinkSubmit = async (data: VideoLinkForm) => {
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
          is_thumbnail: false,
        });

      if (error) {
        throw new Error("Failed to save video link");
      }

      toast({
        title: "Video Link Added",
        description: "Video link has been successfully added",
      });

      // Reset form
      videoLinkForm.reset();

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

  const onVideoFileSubmit = async (data: VideoFileForm) => {
    if (!selectedVideoFile) {
      toast({
        title: "File Required",
        description: "Please select a video file",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      // Sanitize filename
      const sanitizedFileName = selectedVideoFile.name
        .replace(/[^a-zA-Z0-9.-]/g, '_')
        .replace(/_{2,}/g, '_')
        .replace(/^_|_$/g, '');

      // Upload video file
      const fileName = `${Date.now()}-${sanitizedFileName}`;
      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(fileName, selectedVideoFile);

      if (uploadError) {
        console.error('Video upload error details:', uploadError);
        
        // Provide more specific error messages
        if (uploadError.message.includes('exceeded the maximum allowed size')) {
          throw new Error(`File too large: ${selectedVideoFile.name} (${(selectedVideoFile.size / (1024 * 1024)).toFixed(1)}MB) exceeds the 50MB limit. Please compress the video or use a smaller file.`);
        } else if (uploadError.message.includes('Invalid key')) {
          throw new Error(`Invalid filename: Please rename the file to remove special characters.`);
        } else {
          throw new Error(`Upload failed: ${uploadError.message}`);
        }
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(fileName);

      // Save media record
      const { error } = await supabase
        .from('media_uploads')
        .insert({
          filename: selectedVideoFile.name,
          file_url: publicUrl,
          file_type: 'video_file',
          mime_type: selectedVideoFile.type,
          file_size: selectedVideoFile.size,
          title: data.title,
          description: data.description || null,
          is_thumbnail: false,
        });

      if (error) {
        console.error('Database insert error:', error);
        throw new Error(`Failed to save video record: ${error.message}`);
      }

      toast({
        title: "Video Uploaded",
        description: "Video has been successfully uploaded",
      });

      // Reset form
      videoFileForm.reset();
      setSelectedVideoFile(null);
      const fileInput = document.getElementById('video-file-upload') as HTMLInputElement;
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Enhanced Workshop & Training Upload
          </CardTitle>
          <CardDescription>
            Upload images, video files, video thumbnails with external links, or simple video links
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="images" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="images">Images</TabsTrigger>
              <TabsTrigger value="video-files">Video Files</TabsTrigger>
              <TabsTrigger value="video-thumbnails">Video Thumbnails</TabsTrigger>
              <TabsTrigger value="video-links">Video Links</TabsTrigger>
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
            
            <TabsContent value="video-files" className="space-y-4">
              <Form {...videoFileForm}>
                <form onSubmit={videoFileForm.handleSubmit(onVideoFileSubmit)} className="space-y-4">
                  {/* Video File Upload */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Upload Video File</label>
                    <div className="flex items-center gap-4">
                      <Input
                        id="video-file-upload"
                        type="file"
                        accept="video/*"
                        onChange={handleVideoFileChange}
                        className="flex-1"
                      />
                      {selectedVideoFile && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Video className="h-4 w-4" />
                          {selectedVideoFile.name}
                          <span className="text-xs">
                            ({(selectedVideoFile.size / (1024 * 1024)).toFixed(1)} MB)
                          </span>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Supported formats: MP4, AVI, MOV, WMV, WebM. Max size: 50MB
                    </p>
                  </div>

                  <FormField
                    control={videoFileForm.control}
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
                    control={videoFileForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Additional description for the video"
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
                        Upload Video
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </TabsContent>
            
            <TabsContent value="video-thumbnails" className="space-y-4">
              <Form {...videoThumbnailForm}>
                <form onSubmit={videoThumbnailForm.handleSubmit(onVideoThumbnailSubmit)} className="space-y-4">
                  {/* Thumbnail Upload */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Upload Thumbnail Image</label>
                    <div className="flex items-center gap-4">
                      <Input
                        id="thumbnail-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleThumbnailChange}
                        className="flex-1"
                      />
                      {selectedThumbnail && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Image className="h-4 w-4" />
                          {selectedThumbnail.name}
                        </div>
                      )}
                    </div>
                  </div>

                  <FormField
                    control={videoThumbnailForm.control}
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
                    control={videoThumbnailForm.control}
                    name="external_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>External Video URL</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="https://instagram.com/p/... or https://youtube.com/watch?v=..." 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={videoThumbnailForm.control}
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
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Video className="mr-2 h-4 w-4" />
                        Upload Video Thumbnail
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </TabsContent>
            
            <TabsContent value="video-links" className="space-y-4">
              <Form {...videoLinkForm}>
                <form onSubmit={videoLinkForm.handleSubmit(onVideoLinkSubmit)} className="space-y-4">
                  <FormField
                    control={videoLinkForm.control}
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
                    control={videoLinkForm.control}
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
                    control={videoLinkForm.control}
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
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedMediaUpload;
