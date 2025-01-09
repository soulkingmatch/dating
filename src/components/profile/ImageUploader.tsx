import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';
import { uploadProfileImage } from '../../services/profileService';

interface Props {
  currentImageUrl?: string | null;
  onUploadComplete: (url: string) => void;
  onError?: (error: string) => void;
}

export function ImageUploader({ currentImageUrl, onUploadComplete, onError }: Props) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImageUrl || null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      onError?.('Please upload an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      onError?.('Image size should be less than 5MB');
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file
    setUploading(true);
    try {
      const url = await uploadProfileImage(file);
      onUploadComplete(url);
    } catch (error) {
      onError?.(error instanceof Error ? error.message : 'Upload failed');
      setPreview(currentImageUrl);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setPreview(null);
    onUploadComplete('');
  };

  return (
    <div className="space-y-4">
      {preview ? (
        <div className="relative w-32 h-32 mx-auto">
          <img
            src={preview}
            alt="Profile preview"
            className="w-full h-full object-cover rounded-full"
          />
          <button
            onClick={removeImage}
            className="absolute -top-2 -right-2 p-1 bg-red-100 rounded-full text-red-600 hover:bg-red-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <label className="block">
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:border-purple-400">
            <div className="space-y-1 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-600">
                <span className="relative rounded-md font-medium text-purple-600 hover:text-purple-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-purple-500">
                  Upload a photo
                </span>
              </div>
              <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
            </div>
          </div>
          <input
            type="file"
            className="sr-only"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
          />
        </label>
      )}

      {uploading && (
        <div className="text-center text-sm text-gray-500">
          Uploading...
        </div>
      )}
    </div>
  );
}