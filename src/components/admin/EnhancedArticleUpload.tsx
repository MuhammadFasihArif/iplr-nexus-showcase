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
import { Upload, FileText, Image, Loader2, Star } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

const articleSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  category: z.string().min(1, "Category is required"),
  content: z.string().optional(),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
});

type ArticleForm = z.infer<typeof articleSchema>;

const EnhancedArticleUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const { toast } = useToast();
  
  const form = useForm<ArticleForm>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: "",
      author: "",
      category: "",
      content: "",
      featured: false,
      published: true,
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid File Type",
        description: "Please select a PDF or DOCX file",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    setSelectedImage(file);
  };

  const onSubmit = async (data: ArticleForm) => {
    if (!selectedFile && !data.content) {
      toast({
        title: "Content Required",
        description: "Please either upload a file or enter content manually",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      let fileUrl = null;
      let featuredImageUrl = null;
      let featuredImageAlt = null;
      let extractedContent = data.content || "";

      // Upload PDF/DOCX file if provided
      if (selectedFile) {
        const fileName = `${Date.now()}-${selectedFile.name}`;
        const { error: uploadError } = await supabase.storage
          .from('articles')
          .upload(fileName, selectedFile);

        if (uploadError) {
          throw new Error("Failed to upload file");
        }

        const { data: { publicUrl } } = supabase.storage
          .from('articles')
          .getPublicUrl(fileName);
        
        fileUrl = publicUrl;
        
        // Extract text from the uploaded file using Python API
        if (!extractedContent) {
          try {
            console.log('Calling Python text extraction API for:', fileName);
            
            // Create FormData to send file to Python API
            const formData = new FormData();
            formData.append('file', selectedFile);
            
            const response = await fetch('http://localhost:5000/extract-text', {
              method: 'POST',
              body: formData,
            });
            
            const extractionResult = await response.json();
            
            if (!response.ok || !extractionResult.success) {
              console.error('Text extraction error:', extractionResult.error);
              extractedContent = `Content extracted from ${selectedFile.name}.\n\nText extraction service encountered an issue: ${extractionResult.error || 'Unknown error'}. The file has been uploaded successfully, but automatic text extraction failed. Please manually enter the content below.`;
            } else if (extractionResult.extractedText) {
              extractedContent = extractionResult.extractedText;
              console.log('Text successfully extracted, length:', extractedContent.length);
            } else {
              extractedContent = `Content extracted from ${selectedFile.name}.\n\nNo readable text content was found in this file. The file has been uploaded successfully, but may contain primarily images or require manual content entry.`;
            }
          } catch (error) {
            console.error('Error calling text extraction API:', error);
            extractedContent = `Content extracted from ${selectedFile.name}.\n\nText extraction service is currently unavailable. Please make sure the Python API server is running on http://localhost:5000. The file has been uploaded successfully, but automatic text extraction failed. Please manually enter the content below.`;
          }
        }
      }

      // Upload featured image if provided
      if (selectedImage) {
        const fileName = `${Date.now()}-featured-${selectedImage.name}`;
        const { error: imageUploadError } = await supabase.storage
          .from('media')
          .upload(fileName, selectedImage);

        if (imageUploadError) {
          throw new Error("Failed to upload featured image");
        }

        const { data: { publicUrl } } = supabase.storage
          .from('media')
          .getPublicUrl(fileName);
        
        featuredImageUrl = publicUrl;
        featuredImageAlt = data.title; // Use article title as alt text
      }

      // Save article to database
      const { error } = await supabase
        .from('articles')
        .insert({
          title: data.title,
          author: data.author,
          category: data.category,
          content: extractedContent,
          featured: data.featured,
          published: data.published,
          file_url: fileUrl,
          featured_image_url: featuredImageUrl,
          featured_image_alt: featuredImageAlt,
        });

      if (error) {
        throw new Error("Failed to save article");
      }

      toast({
        title: "Article Created",
        description: "Article has been successfully created",
      });

      // Reset form
      form.reset();
      setSelectedFile(null);
      setSelectedImage(null);
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      const imageInput = document.getElementById('image-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      if (imageInput) imageInput.value = '';

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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Enhanced Article Upload
        </CardTitle>
        <CardDescription>
          Create articles with featured images and file attachments
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Article Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Article Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter article title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="author"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Author</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter author name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Educational Technology, Research, etc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* File Uploads */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* PDF/DOCX Upload */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Upload PDF/DOCX (Optional)</label>
                <div className="flex items-center gap-4">
                  <Input
                    id="file-upload"
                    type="file"
                    accept=".pdf,.docx"
                    onChange={handleFileChange}
                    className="flex-1"
                  />
                  {selectedFile && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <FileText className="h-4 w-4" />
                      {selectedFile.name}
                    </div>
                  )}
                </div>
              </div>

              {/* Featured Image Upload */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Featured Image (Optional)</label>
                <div className="flex items-center gap-4">
                  <Input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="flex-1"
                  />
                  {selectedImage && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Image className="h-4 w-4" />
                      {selectedImage.name}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Article Content */}
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Article Content</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter the full article content..."
                      className="min-h-[200px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Options */}
            <div className="flex items-center space-x-6">
              <FormField
                control={form.control}
                name="featured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="flex items-center gap-2">
                        <Star className="h-4 w-4" />
                        Featured Article
                      </FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Mark this article as featured
                      </p>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="published"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Published</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Make this article visible to public
                      </p>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full"
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Article...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Create Article
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default EnhancedArticleUpload;
