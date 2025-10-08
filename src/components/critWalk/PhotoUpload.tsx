import { useState, useRef } from 'react';

interface PhotoUploadProps {
  onPhotosSelected: (files: File[]) => void;
  maxPhotos?: number;
}

export function PhotoUpload({ onPhotosSelected, maxPhotos = 10 }: PhotoUploadProps) {
  const [previews, setPreviews] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const totalFiles = files.length + selectedFiles.length;

    if (totalFiles > maxPhotos) {
      alert(`You can only upload up to ${maxPhotos} photos`);
      return;
    }

    const newFiles = [...files, ...selectedFiles];
    setFiles(newFiles);
    onPhotosSelected(newFiles);

    // Create previews
    selectedFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);

    setFiles(newFiles);
    setPreviews(newPreviews);
    onPhotosSelected(newFiles);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Photos ({files.length}/{maxPhotos})
      </label>

      {previews.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
          {previews.map((preview, index) => (
            <div key={index} className="relative">
              <img
                src={preview}
                alt={`Preview ${index + 1}`}
                className="w-full h-32 object-cover rounded-md"
              />
              <button
                type="button"
                onClick={() => removePhoto(index)}
                className="absolute top-1 right-1 bg-brand-red text-white rounded-full w-11 h-11 flex items-center justify-center hover:bg-brand-red-light"
                aria-label="Remove photo"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={files.length >= maxPhotos}
        className="w-full px-4 py-6 md:py-3 border-2 border-dashed border-gray-300 rounded-md hover:border-brand-blue transition disabled:opacity-50 disabled:cursor-not-allowed min-h-[80px] md:min-h-0"
      >
        <div className="text-center">
          <span className="text-2xl md:text-xl mb-2 block">📷</span>
          <p className="text-base md:text-sm text-gray-600 font-medium">
            {files.length === 0 ? 'Take Photo / Upload' : 'Add More Photos'}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            JPG, PNG up to 10MB each
          </p>
        </div>
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        multiple
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
