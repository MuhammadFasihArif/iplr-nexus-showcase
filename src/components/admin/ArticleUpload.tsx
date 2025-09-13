import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Upload, FileText, Loader2 } from "lucide-react";

const articleSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  category: z.string().min(1, "Category is required"),
  content: z.string().optional(),
  featured: z.boolean(),
});

type ArticleForm = z.infer<typeof articleSchema>;

const ArticleUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();
  
  const form = useForm<ArticleForm>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: "",
      author: "",
      category: "",
      content: "",
      featured: false,
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid File Type",
        description: "Please select a PDF or Word document",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
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
      let extractedContent = data.content || "";

      // Upload file if selected
      if (selectedFile) {
        const fileName = `${Date.now()}-${selectedFile.name}`;
        const { error: uploadError } = await supabase.storage
          .from('articles')
          .upload(fileName, selectedFile);

        if (uploadError) {
          throw new Error("Failed to upload file");
        }

        fileUrl = fileName;
        
        // Extract text from the uploaded file using Python API
        if (!extractedContent) {
          try {
            console.log('Calling Python text extraction API for:', fileName);
            
            // Create FormData to send file to Python API
            const formData = new FormData();
            formData.append('file', selectedFile);
            
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const response = await fetch(`${apiUrl}/extract-text`, {
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
            extractedContent = `Content extracted from ${selectedFile.name}.\n\nText extraction service is currently unavailable. Please make sure the Python API server is running. The file has been uploaded successfully, but automatic text extraction failed. Please manually enter the content below.`;
          }
        }
      }

      // Save article to database
      const { error } = await supabase
        .from('articles')
        .insert({
          title: data.title,
          content: extractedContent,
          author: data.author,
          category: data.category,
          featured: data.featured,
          file_url: fileUrl,
        });

      if (error) {
        throw new Error("Failed to save article");
      }

      toast({
        title: "Article Uploaded",
        description: "Article has been successfully processed and uploaded",
      });

      // Reset form
      form.reset();
      setSelectedFile(null);
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Educational Technology">Educational Technology</SelectItem>
                  <SelectItem value="Research Methods">Research Methods</SelectItem>
                  <SelectItem value="Learning Psychology">Learning Psychology</SelectItem>
                  <SelectItem value="Sustainability">Sustainability</SelectItem>
                  <SelectItem value="Policy Analysis">Policy Analysis</SelectItem>
                  <SelectItem value="Professional Development">Professional Development</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* File Upload */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Upload Document (PDF/Word)</label>
          <div className="flex items-center gap-4">
            <Input
              id="file-upload"
              type="file"
              accept=".pdf,.doc,.docx"
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

        {/* Manual Content Entry */}
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Manual Content (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter article content manually (if not uploading a file)"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
                <FormLabel>Featured Article</FormLabel>
                <p className="text-xs text-muted-foreground">
                  Mark this article as featured to highlight it on the homepage
                </p>
              </div>
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
              Processing...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Upload Article
            </>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default ArticleUpload;