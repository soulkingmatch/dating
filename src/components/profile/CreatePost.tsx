import React, { useState } from 'react';
import { Image, Send } from 'lucide-react';
import { useFeedStore } from '../../store/feedStore';
import { useProfileStore } from '../../store/profileStore';
import { uploadMedia } from '../../services/uploadService';

export function CreatePost() {
  const [content, setContent] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const { addFeedItem } = useFeedStore();
  const { profile } = useProfileStore();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !image) return;

    try {
      setUploading(true);
      let imageUrl: string | undefined;
      
      if (image) {
        imageUrl = await uploadMedia(image, 'feed-images');
      }

      await addFeedItem(content, imageUrl);
      setContent('');
      setImage(null);
      setPreview(null);
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-xl p-4">
      <form onSubmit={handleSubmit}>
        <div className="flex items-start space-x-4">
          <div className="w-10 h-10 rounded-full bg-purple-100 flex-shrink-0">
            {profile?.avatar_url ? (
              <img 
                src={profile.avatar_url} 
                alt={profile.full_name || ''} 
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-lg text-purple-600 font-bold">
                  {profile?.full_name?.[0]}
                </span>
              </div>
            )}
          </div>
          <div className="flex-grow">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind?"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              rows={3}
              disabled={uploading}
            />
            {preview && (
              <div className="mt-2 relative">
                <img 
                  src={preview} 
                  alt="Preview" 
                  className="max-h-48 rounded-lg object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImage(null);
                    setPreview(null);
                  }}
                  className="absolute top-2 right-2 p-1 bg-gray-800 bg-opacity-50 rounded-full text-white hover:bg-opacity-70"
                >
                  ×
                </button>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <label className="flex items-center space-x-2 text-gray-600 cursor-pointer hover:text-purple-600">
            <Image className="w-5 h-5" />
            <span>Add Photo</span>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
              disabled={uploading}
            />
          </label>
          <button
            type="submit"
            disabled={(!content.trim() && !image) || uploading}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <Send className="w-4 h-4" />
            <span>{uploading ? 'Posting...' : 'Post'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}