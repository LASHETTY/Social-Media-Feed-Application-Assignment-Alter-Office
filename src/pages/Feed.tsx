import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import useStore from '../store/useStore';
import Post from '../components/Post';
import CreatePost from '../components/CreatePost';
import { auth } from '../config/firebase';
import { Post as PostType } from '../types';

const Feed = () => {
  const navigate = useNavigate();
  const { posts, loading, fetchPosts, loadMorePosts } = useStore();
  const currentUser = useStore(state => state.currentUser);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate('/login');
      }
    });

    fetchPosts();
    return () => unsubscribe();
  }, [navigate, fetchPosts]);

  if (!currentUser) {
    return <div>Please sign in to view the feed.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-4 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Feeds</h1>
        <CreatePost />
      </div>
      
      <InfiniteScroll
        dataLength={posts.length}
        next={loadMorePosts}
        hasMore={true}
        loader={
          loading ? (
            <div className="flex justify-center p-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : null
        }
        endMessage={
          <p className="text-center text-gray-500 my-4">
            No more posts to load.
          </p>
        }
        className="space-y-4"
      >
        {posts.map((post: PostType) => (
          <Post key={post.id} post={post} />
        ))}
      </InfiniteScroll>

      {loading && posts.length === 0 && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      )}
    </div>
  );
};

export default Feed;
