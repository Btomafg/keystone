// app/admin/projects/[projectId]/_components/AdminProjectFilesTab.tsx

'use client';

import { AlertDialog, AlertDialogContent, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label'; // Added Label
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'; // Added RadioGroup for type
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea'; // Added Textarea
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'; // Added Tooltip
import { useToast } from '@/hooks/use-toast'; // Corrected path
import { formatDate, formatFileSize, getFileIcon } from '@/lib/utils'; // Adjust path if needed
import { Download, Loader2, Send, Trash2, UploadCloud, X } from 'lucide-react'; // Added X, Send
import { useCallback, useEffect, useState } from 'react';
import { FileRejection, useDropzone } from 'react-dropzone'; // Using react-dropzone for uploads
// --- Type Definition ---
interface ProjectFile {
  id: string | number;
  project_id: string | number;
  name: string;
  url: string;
  mime_type?: string | null;
  size?: number | null;
  uploaded_at?: string | Date | null;
  uploaded_by_user_id?: string | null;
  // Category now more important for admin upload
  file_category: 'Drawing' | 'Photo' | 'Agreement' | 'Invoice' | 'Other' | string | null; // Allow string for flexibility
  description?: string | null; // Optional description field
  uploader_name?: string | null;
}

// Simplified upload categories for the admin form
type UploadCategory = 'Drawing' | 'File';

// --- Component Props ---
interface AdminProjectFilesTabProps {
  project: any;
}

// --- DUMMY DATA ---
const DUMMY_FILES: ProjectFile[] = [
  /* ... same as before ... */
];

export function AdminProjectFilesTab({ project }: AdminProjectFilesTabProps) {
  const files = project?.files || []; // Use project.files if available
  console.log('Project Files:', files);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();
  const projectId = project?.id || 0; // Ensure projectId is available
  // State for pre-upload files and context
  const [selectedFilesToUpload, setSelectedFilesToUpload] = useState<File[]>([]);
  const [uploadCategory, setUploadCategory] = useState<UploadCategory>('File'); // Default to 'File'
  const [uploadDescription, setUploadDescription] = useState('');

  // --- Data Fetching ---
  const fetchFiles = useCallback(async () => {
    // ... (fetch logic as before) ...
    setIsLoading(true);
    console.log(`API CALL: Fetch files for project ${projectId}`);
    try {
      await new Promise((resolve) => setTimeout(resolve, 400));
      setFiles(DUMMY_FILES.filter((f) => f.project_id == projectId));
    } catch (error) {
      /* ... error handling ... */
    } finally {
      setIsLoading(false);
    }
  }, [projectId, toast]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  // --- API Call Placeholders ---
  const handleUploadSubmit = async () => {
    // Renamed from handleUpload
    if (selectedFilesToUpload.length === 0) return;
    setIsUploading(true);
    setUploadProgress(0);
    console.log('API CALL: Upload Files with Context', {
      files: selectedFilesToUpload.map((f) => f.name),
      category: uploadCategory,
      description: uploadDescription,
    });

    // --- Replace with your ACTUAL upload logic ---
    // You'll likely loop through selectedFilesToUpload and upload each one
    // Use FormData to send file + category + description + projectId
    const totalSize = selectedFilesToUpload.reduce((acc, file) => acc + file.size, 0);
    let uploadedSize = 0;
    let successCount = 0;

    for (const file of selectedFilesToUpload) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('projectId', String(projectId));
        formData.append('category', uploadCategory); // Send selected category
        if (uploadDescription) {
          formData.append('description', uploadDescription);
        }

        // Simulate chunked progress update for EACH file
        for (let i = 0; i <= 5; i++) {
          // Faster simulation
          await new Promise((resolve) => setTimeout(resolve, 40));
          const currentFileProgress = (file.size / 5) * i;
          setUploadProgress(Math.min(100, Math.round(((uploadedSize + currentFileProgress) / totalSize) * 100)));
        }

        // Your actual API call:
        // const response = await fetch('/api/upload', { method: 'POST', body: formData });
        // if (!response.ok) throw new Error(`Failed to upload ${file.name}`);

        uploadedSize += file.size; // Update total after simulated success
        setUploadProgress(Math.min(100, Math.round((uploadedSize / totalSize) * 100)));
        successCount++;
      } catch (error) {
        console.error(`Failed to upload ${file.name}:`, error);
        toast({ title: 'Upload Error', description: `Could not upload ${file.name}.`, variant: 'destructive' });
        // Decide if you want to stop on first error or continue with others
        // break;
      }
    }
    // --- End Upload Loop ---

    setIsUploading(false);
    if (successCount > 0) {
      toast({ title: 'Upload Complete', description: `${successCount} of ${selectedFilesToUpload.length} file(s) uploaded.` });
      setSelectedFilesToUpload([]); // Clear selection on success
      setUploadCategory('File'); // Reset category
      setUploadDescription(''); // Reset description
      await fetchFiles(); // Refetch files list
    }
  };

  const handleDeleteFile = async (fileId: string | number, fileName: string) => {
    /* ... as before ... */
  };

  // --- Dropzone Setup ---
  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      // Handle accepted files
      setSelectedFilesToUpload((current) => [...current, ...acceptedFiles]); // Append new files

      // Handle rejected files (optional)
      if (fileRejections.length > 0) {
        console.log('Rejected files:', fileRejections);
        toast({
          title: 'File Rejected',
          description: `${fileRejections[0].errors[0].message} (${fileRejections[0].file.name})`, // Show first error
          variant: 'warning',
        });
      }
    },
    [toast],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    disabled: isUploading,
    // Example: accept PDF and images only
    accept: {
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
    },
  });

  // Function to remove a file from the selection
  const removeFileFromSelection = (fileName: string) => {
    setSelectedFilesToUpload((current) => current.filter((file) => file.name !== fileName));
  };
  // Function to clear the entire selection
  const clearSelection = () => {
    setSelectedFilesToUpload([]);
    setUploadCategory('File');
    setUploadDescription('');
  };

  return (
    <div className="space-y-6">
      {/* === Upload Section === */}
      {/* Show Dropzone OR Selected Files + Inputs */}
      {selectedFilesToUpload.length === 0 && !isUploading ? (
        // Dropzone Input Area
        <Card
          {...getRootProps()}
          className={`border-2 border-dashed hover:border-primary hover:bg-primary/5 transition-colors cursor-pointer ${
            isDragActive ? 'border-primary bg-primary/10' : 'border-border bg-background'
          }`}
        >
          <CardContent className="p-6 text-center">
            <input {...getInputProps()} />
            <div className="space-y-1 text-muted-foreground">
              <UploadCloud className="h-8 w-8 mx-auto" />
              <p className="text-sm font-medium">Drag 'n' drop files here</p>
              <p className="text-xs">or click to select files</p>
              <p className="text-[10px] pt-2">(PDFs, JPG, PNG accepted)</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        // Selected Files & Upload Form Area
        <Card className="bg-muted/30">
          <CardHeader>
            <CardTitle className="text-base">Prepare Files for Upload</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* List Selected Files */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold">Selected Files:</Label>
              <ul className="text-sm space-y-1 max-h-32 overflow-y-auto pr-2">
                {selectedFilesToUpload.map((file, index) => (
                  <li key={`${file.name}-${index}`} className="flex justify-between items-center text-muted-foreground">
                    <span className="truncate">{file.name}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 text-destructive hover:text-destructive/80 flex-shrink-0 ml-2"
                      onClick={() => removeFileFromSelection(file.name)}
                      disabled={isUploading}
                      title="Remove file"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Category Selection */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold">File Category *</Label>
              <RadioGroup
                value={uploadCategory}
                onValueChange={(value: UploadCategory) => setUploadCategory(value)}
                className="flex space-x-4 pt-1"
                disabled={isUploading}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Drawing" id="cat-drawing" />
                  <Label htmlFor="cat-drawing" className="text-sm font-normal">
                    Drawing
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="File" id="cat-file" />
                  <Label htmlFor="cat-file" className="text-sm font-normal">
                    File/Document
                  </Label>
                  {/* Add more categories as needed (Photo, Agreement, etc.) */}
                </div>
              </RadioGroup>
            </div>

            {/* Description Input */}
            <div className="space-y-2">
              <Label htmlFor="upload-desc" className="text-xs font-semibold">
                Description (Optional)
              </Label>
              <Textarea
                id="upload-desc"
                placeholder="Add context about these file(s)..."
                value={uploadDescription}
                onChange={(e) => setUploadDescription(e.target.value)}
                rows={2}
                disabled={isUploading}
              />
            </div>

            {/* Progress Bar (shown during upload) */}
            {isUploading && (
              <div className="space-y-1 pt-2">
                <Progress value={uploadProgress} className="w-full h-2" />
                <p className="text-xs text-muted-foreground text-center">{uploadProgress}%</p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-end gap-3 border-t pt-4">
            <Button variant="outline" onClick={clearSelection} disabled={isUploading}>
              Clear Selection
            </Button>
            <Button onClick={handleUploadSubmit} disabled={isUploading}>
              {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
              Upload {selectedFilesToUpload.length} File(s)
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* === File List Table === */}
      <h3 className="text-lg font-semibold pt-4">Uploaded Files</h3>
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">Type</TableHead>
              <TableHead>Name & Description</TableHead> {/* Combined Name/Desc */}
              <TableHead>Size</TableHead>
              <TableHead>Uploaded</TableHead>
              <TableHead className="w-[120px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                </TableCell>
              </TableRow>
            ) : files.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  No files uploaded for this project.
                </TableCell>
              </TableRow>
            ) : (
              files.map((file) => (
                <TableRow key={file.id}>
                  <TableCell>
                    {/* Tooltip is optional but nice for icon meaning */}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>{getFileIcon(file.mime_type, file.file_category)}</TooltipTrigger>
                        <TooltipContent>{file.file_category || file.mime_type || 'File'}</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                  <TableCell className="text-sm">
                    <span className="font-medium break-all block">{file.name}</span>
                    {/* Display description if available */}
                    {file.description && <p className="text-xs text-muted-foreground mt-1">{file.description}</p>}
                  </TableCell>
                  <TableCell className="text-xs">{formatFileSize(file.size)}</TableCell>
                  <TableCell className="text-xs">{formatDate(file.uploaded_at)}</TableCell>
                  <TableCell className="text-right space-x-1">
                    {/* Download Button */}
                    <Button variant="outline" size="icon" className="h-7 w-7" asChild title="Download File">
                      <a href={file.url} download={file.name} target="_blank" rel="noopener noreferrer">
                        <Download className="h-4 w-4" /> <span className="sr-only">Download</span>
                      </a>
                    </Button>
                    {/* Delete Button */}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive h-7 w-7" title="Delete File">
                          <Trash2 className="h-4 w-4" /> <span className="sr-only">Delete</span>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent> {/* ... Delete Confirmation ... */} </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
