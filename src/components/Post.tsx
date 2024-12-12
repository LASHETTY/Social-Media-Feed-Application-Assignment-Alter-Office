import React from 'react';
import { HeartIcon, ChatBubbleLeftIcon, ShareIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import useStore from '../store/useStore';

interface PostProps {
  post: {
    id: string;
    content: string;
    mediaUrls: string[];
    authorId: string;
    authorName: string;
    authorPhotoURL: string;
    likes: string[];
    createdAt: any;
  };
}

const Post: React.FC<PostProps> = ({ post }) => {
  const currentUser = useStore(state => state.currentUser);
  const likePost = useStore(state => state.likePost);
  const unlikePost = useStore(state => state.unlikePost);

  const isLiked = currentUser && post.likes.includes(currentUser.uid || '');

  const handleLike = () => {
    if (!currentUser) return;
    if (isLiked) {
      unlikePost(post.id);
    } else {
      likePost(post.id);
    }
  };

  const formatTimestamp = (timestamp: any) => {
    if (!timestamp || !timestamp.toDate) return '';
    const date = timestamp.toDate();
    const now = new Date();
    const diffTime = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffTime === 0) return 'Today';
    if (diffTime === 1) return 'Yesterday';
    if (diffTime < 7) return `${diffTime} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      {/* Author Info */}
      <div className="flex items-center mb-4">
        <img
          src={post.authorPhotoURL}
          alt={post.authorName}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="ml-3">
          <h3 className="font-semibold">{post.authorName}</h3>
          <p className="text-sm text-gray-500">{formatTimestamp(post.createdAt)}</p>
        </div>
      </div>

      {/* Post Content */}
      {post.content && (
        <p className="mb-4 text-gray-800">{post.content}</p>
      )}

      {/* Media Grid */}
      {post.mediaUrls && post.mediaUrls.length > 0 && (
        <div className={`grid gap-2 mb-4 ${
          post.mediaUrls.length === 1 ? 'grid-cols-1' :
          post.mediaUrls.length === 2 ? 'grid-cols-2' :
          'grid-cols-3'
        }`}>
          {post.mediaUrls.map((url, index) => (
            <div key={index} className="relative aspect-square">
              <img
                src={url}
                alt={`Post media ${index + 1}`}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          ))}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center gap-6 pt-3 border-t">
        <button
          onClick={handleLike}
          className={`flex items-center gap-2 ${
            isLiked ? 'text-red-500' : 'text-gray-600'
          } hover:text-red-500 transition-colors`}
        >
          {isLiked ? (
            <HeartIconSolid className="w-6 h-6" />
          ) : (
            <HeartIcon className="w-6 h-6" />
          )}
          <span>{post.likes.length}</span>
        </button>
        
        <button className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors">
          <ChatBubbleLeftIcon className="w-6 h-6" />
          <span>Comment</span>
        </button>
        
        <button className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors">
          <ShareIcon className="w-6 h-6" />
          <span>Share</span>
        </button>
      </div>
    </div>
  );
};

export default Post;
