import { create } from 'zustand';
import { User as FirebaseUser } from 'firebase/auth';
import { collection, getDocs, addDoc, updateDoc, doc, arrayUnion, arrayRemove, query, orderBy, limit, startAfter, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../config/firebase';
import { Post } from '../types';

interface Store {
  currentUser: FirebaseUser | null;
  posts: Post[];
  loading: boolean;
  lastPost: any | null;
  setCurrentUser: (user: FirebaseUser | null) => void;
  createPost: (content: string, mediaFiles: File[]) => Promise<void>;
  fetchPosts: () => Promise<void>;
  loadMorePosts: () => Promise<void>;
  likePost: (postId: string) => Promise<void>;
  unlikePost: (postId: string) => Promise<void>;
}

const useStore = create<Store>((set, get) => ({
  currentUser: null,
  posts: [],
  loading: false,
  lastPost: null,
  
  setCurrentUser: (user) => set({ currentUser: user }),
  
  createPost: async (content, mediaFiles) => {
    const { currentUser } = get();
    if (!currentUser) return;

    try {
      set({ loading: true });
      const mediaUrls = await Promise.all(
        mediaFiles.map(async (file) => {
          const storageRef = ref(storage, `posts/${Date.now()}_${file.name}`);
          const snapshot = await uploadBytes(storageRef, file);
          return getDownloadURL(snapshot.ref);
        })
      );

      const postData: Omit<Post, 'id'> = {
        authorId: currentUser.uid,
        authorName: currentUser.displayName || '',
        authorPhotoURL: currentUser.photoURL || '',
        content,
        mediaUrls,
        likes: [],
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, 'posts'), postData);
      await get().fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      set({ loading: false });
    }
  },
  
  fetchPosts: async () => {
    set({ loading: true });
    try {
      const postsQuery = query(
        collection(db, 'posts'),
        orderBy('createdAt', 'desc'),
        limit(20)
      );
      const snapshot = await getDocs(postsQuery);
      const posts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Post[];
      set({ 
        posts,
        lastPost: snapshot.docs[snapshot.docs.length - 1]
      });
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      set({ loading: false });
    }
  },
  
  loadMorePosts: async () => {
    const { lastPost, posts } = get();
    if (!lastPost) return;

    try {
      set({ loading: true });
      const postsQuery = query(
        collection(db, 'posts'),
        orderBy('createdAt', 'desc'),
        startAfter(lastPost),
        limit(20)
      );
      const snapshot = await getDocs(postsQuery);
      const newPosts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Post[];
      
      set({
        posts: [...posts, ...newPosts],
        lastPost: snapshot.docs[snapshot.docs.length - 1],
      });
    } catch (error) {
      console.error('Error loading more posts:', error);
    } finally {
      set({ loading: false });
    }
  },
  
  likePost: async (postId: string) => {
    const { currentUser } = get();
    if (!currentUser) return;
    
    try {
      const postRef = doc(db, 'posts', postId);
      await updateDoc(postRef, {
        likes: arrayUnion(currentUser.uid)
      });
      
      set(state => ({
        posts: state.posts.map(post =>
          post.id === postId
            ? { ...post, likes: [...post.likes, currentUser.uid] }
            : post
        )
      }));
    } catch (error) {
      console.error('Error liking post:', error);
    }
  },
  
  unlikePost: async (postId: string) => {
    const { currentUser } = get();
    if (!currentUser) return;
    
    try {
      const postRef = doc(db, 'posts', postId);
      await updateDoc(postRef, {
        likes: arrayRemove(currentUser.uid)
      });
      
      set(state => ({
        posts: state.posts.map(post =>
          post.id === postId
            ? { ...post, likes: post.likes.filter((id: string) => id !== currentUser.uid) }
            : post
        )
      }));
    } catch (error) {
      console.error('Error unliking post:', error);
    }
  }
}));

export default useStore;
