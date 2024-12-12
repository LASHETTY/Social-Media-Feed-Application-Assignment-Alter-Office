import React, { useState, useRef } from 'react';
import { PhotoIcon, VideoCameraIcon, CameraIcon } from '@heroicons/react/24/outline';
import useStore from '../store/useStore';

const CreatePost: React.FC = () => {
  const [content, setContent] = useState('');
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [mediaPreviewUrls, setMediaPreviewUrls] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'photos' | 'videos'>('photos');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const createPost = useStore(state => state.createPost);
  const currentUser = useStore(state => state.currentUser);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setMediaFiles(prev => [...prev, ...files]);
    
    // Create preview URLs
    const newPreviewUrls = files.map(file => URL.createObjectURL(file));
    setMediaPreviewUrls(prev => [...prev, ...newPreviewUrls]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && mediaFiles.length === 0) return;

    await createPost(content, mediaFiles);
    setContent('');
    setMediaFiles([]);
    setMediaPreviewUrls([]);
  };

  if (!currentUser) return null;

  return (
    <div className="bg-white rounded-lg shadow p-4 max-w-xl mx-auto">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="What's on your mind?"
            className="flex-1 p-3 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg"
          >
            <PhotoIcon className="w-5 h-5 text-gray-600" />
            <span>Photos</span>
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg"
          >
            <VideoCameraIcon className="w-5 h-5 text-gray-600" />
            <span>Video</span>
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg"
          >
            <CameraIcon className="w-5 h-5 text-gray-600" />
            <span>Camera</span>
          </button>
        </div>

        {mediaPreviewUrls.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {mediaPreviewUrls.map((url, index) => (
              <div key={index} className="relative aspect-square">
                <img
                  src={url}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            ))}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={!content.trim() && mediaFiles.length === 0}
          className="w-full bg-black text-white py-2 rounded-lg font-medium hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          CREATE
        </button>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={activeTab === 'photos' ? 'image/*' : 'video/*'}
        multiple
        className="hidden"
      />
    </div>
  );
};

export default CreatePost;
