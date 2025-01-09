import React, { useState } from 'react';
import { Video, X, Upload } from 'lucide-react';
import { uploadProfileVideo } from '../../services/profileService';

interface Props {
  currentVideoUrl?: string | null;
  onUploadComplete: (url: string) => void;
  onError?: (error: string) => void;
}

export function VideoUploader({ currentVideoUrl, onUploadComplete, onError }: Props) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentVideoUrl || null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('video/')) {
      onError?.('Please upload a video file');
      return;
    }

    // Validate file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      onError?.('Video size should be less than 50MB');
      return;
    }

    // Upload file
    setUploading(true);
    try {
      const url = await uploadProfileVideo(file);
      setPreview(url);
      onUploadComplete(url);
    } catch (error) {
      onError?.(error instanceof Error ? error.message : 'Upload failed');
      setPreview(currentVideoUrl);
    } finally {
      setUploading(false);
    }
  };

  const removeVideo = () => {
    setPreview(null);
    onUploadComplete('');
  };

  return (
    <div className="space-y-4">
      {preview ? (
        <div className="relative w-full max-w-md mx-auto">
          <video 
            src={preview}
            controls
            className="w-full rounded-lg"
          />
          <button
            onClick={removeVideo}
            className="absolute -top-2 -right-2 p-1 bg-red-100 rounded-full text-red-600 hover:bg-red-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <label className="block">
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:border-purple-400">
            <div className="space-y-1 text-center">
              <Video className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-600">
                <span className="relative rounded-md font-medium text-purple-600 hover:text-purple-500">
                  Upload an intro video
                </span>
              </div>
              <p className="text-xs text-gray-500">MP4, WebM up to 50MB</p>
            </div>
          </div>
          <input
            type="file"
            className="sr-only"
            accept="video/*"
            onChange={handleFileChange}
            disabled={uploading}
          />
        </label>
      )}

      {uploading && (
        <div className="text-center text-sm text-gray-500">
          Uploading video... This may take a few minutes.
        </div>
      )}
    </div>
  );
}