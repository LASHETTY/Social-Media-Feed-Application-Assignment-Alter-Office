export interface User {
  id: string;
  name: string;
  email: string;
  photoURL: string;
  bio?: string;
}

export interface Post {
  id: string;
  content: string;
  mediaUrls: string[];
  authorId: string;
  authorName: string;
  authorPhotoURL: string;
  likes: string[];
  createdAt: any;
}
