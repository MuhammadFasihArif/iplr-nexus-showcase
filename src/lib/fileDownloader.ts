import { supabase } from "@/integrations/supabase/client";

export const downloadOriginalFile = async (fileUrl: string, filename: string): Promise<void> => {
  try {
    // Extract the file path from the Supabase URL
    const url = new URL(fileUrl);
    const pathParts = url.pathname.split('/');
    const bucket = pathParts[pathParts.length - 2]; // articles bucket
    const fileName = pathParts[pathParts.length - 1]; // actual filename
    
    // Download the file from Supabase storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .download(fileName);
    
    if (error) {
      throw new Error(`Failed to download file: ${error.message}`);
    }
    
    if (!data) {
      throw new Error('No file data received');
    }
    
    // Create a blob URL and trigger download
    const blob = new Blob([data], { type: data.type });
    const blobUrl = window.URL.createObjectURL(blob);
    
    // Create a temporary anchor element to trigger download
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
    
  } catch (error) {
    console.error('Error downloading file:', error);
    throw new Error('Failed to download file. Please try again.');
  }
};

export const getFileExtension = (filename: string): string => {
  return filename.split('.').pop()?.toLowerCase() || '';
};

export const getFileTypeIcon = (filename: string): string => {
  const extension = getFileExtension(filename);
  
  switch (extension) {
    case 'pdf':
      return '📄';
    case 'doc':
    case 'docx':
      return '📝';
    case 'txt':
      return '📃';
    default:
      return '📎';
  }
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

