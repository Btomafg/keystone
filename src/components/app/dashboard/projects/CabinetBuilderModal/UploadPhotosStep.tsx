import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, XCircle } from 'lucide-react';
import { DragEvent } from 'react';


interface UploadPhotosStepProps {
    spacePhotos: FilePreview[];
    setSpacePhotos: React.Dispatch<React.SetStateAction<FilePreview[]>>;
    inspirationPhotos: FilePreview[];
    setInspirationPhotos: React.Dispatch<React.SetStateAction<FilePreview[]>>;
}

const UploadPhotosStep: React.FC<UploadPhotosStepProps> = ({
    spacePhotos,
    setSpacePhotos,
    inspirationPhotos,
    setInspirationPhotos,
}) => {
    const handleFileSelection = (files: FileList, setState: React.Dispatch<React.SetStateAction<FilePreview[]>>) => {
        const fileArray = Array.from(files).map((file) => ({
            file,
            previewUrl: URL.createObjectURL(file),
        }));
        setState((prev) => [...prev, ...fileArray]);
    };

    const handleRemoveFile = (index: number, setState: React.Dispatch<React.SetStateAction<FilePreview[]>>) => {
        setState((prev) => {
            const updated = [...prev];
            URL.revokeObjectURL(updated[index].previewUrl);
            updated.splice(index, 1);
            return updated;
        });
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>, setState: React.Dispatch<React.SetStateAction<FilePreview[]>>) => {
        e.preventDefault();
        const droppedFiles = e.dataTransfer.files;
        handleFileSelection(droppedFiles, setState);
    };

    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold text-center">Upload Photos</h2>
            {/* Photos of Your Space */}
            <div className="space-y-2">
                <Label className="block text-sm font-medium">Photos of Your Space</Label>
                <div
                    className="relative flex flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-300 p-6 text-center transition-colors hover:border-blue-400"
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, setSpacePhotos)}
                >
                    <Upload className="mb-2 h-8 w-8 text-gray-400" />
                    <p className="text-sm text-gray-500">Drag &amp; drop or click to select files</p>
                    <Input
                        type="file"
                        multiple
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={(e) => e.target.files && handleFileSelection(e.target.files, setSpacePhotos)}
                    />
                </div>
                {spacePhotos.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-3">
                        {spacePhotos.map((preview, i) => (
                            <div key={i} className="relative group">
                                <img
                                    src={preview.previewUrl}
                                    alt={`Space Photo ${i + 1}`}
                                    className="h-24 w-24 object-cover rounded-md shadow"
                                />
                                <button
                                    type="button"
                                    className="absolute -top-2 -right-2 hidden group-hover:block"
                                    onClick={() => handleRemoveFile(i, setSpacePhotos)}
                                >
                                    <XCircle className="text-red-500 hover:text-red-600 h-6 w-6" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {/* Inspiration Photos */}
            <div className="space-y-2">
                <Label className="block text-sm font-medium">Inspiration Photos</Label>
                <div
                    className="relative flex flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-300 p-6 text-center transition-colors hover:border-blue-400"
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, setInspirationPhotos)}
                >
                    <Upload className="mb-2 h-8 w-8 text-gray-400" />
                    <p className="text-sm text-gray-500">Drag &amp; drop or click to select files</p>
                    <Input
                        type="file"
                        multiple
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={(e) => e.target.files && handleFileSelection(e.target.files, setInspirationPhotos)}
                    />
                </div>
                {inspirationPhotos.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-3">
                        {inspirationPhotos.map((preview, i) => (
                            <div key={i} className="relative group">
                                <img
                                    src={preview.previewUrl}
                                    alt={`Inspiration Photo ${i + 1}`}
                                    className="h-24 w-24 object-cover rounded-md shadow"
                                />
                                <button
                                    type="button"
                                    className="absolute -top-2 -right-2 hidden group-hover:block"
                                    onClick={() => handleRemoveFile(i, setInspirationPhotos)}
                                >
                                    <XCircle className="text-red-500 hover:text-red-600 h-6 w-6" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UploadPhotosStep;
