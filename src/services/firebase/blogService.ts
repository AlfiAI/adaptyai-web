import { collection, addDoc, getDocs, query, orderBy, limit, Timestamp, doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { BlogPostData } from '@/lib/dataAccess/types';

// Interface for blog posts from Firestore
export type FirestoreBlogPost = BlogPostData;

// Submit blog post to Firestore
export const submitBlogPost = async (postData: {
  title: string;
  excerpt: string;
  body: string;
  author: string;
  tags: string[];
  cover_image_url: string;
  published_at: Date;
}) => {
  try {
    const docRef = await addDoc(collection(db, 'blogs'), {
      title: postData.title,
      excerpt: postData.excerpt,
      body: postData.body,
      author: postData.author,
      tags: postData.tags,
      cover_image_url: postData.cover_image_url,
      published_at: Timestamp.fromDate(postData.published_at || new Date()),
      created_at: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error submitting blog post:', error);
    throw error;
  }
};

// Delete blog post from Firestore
export const deleteBlogPost = async (postId: string) => {
  try {
    await deleteDoc(doc(db, 'blogs', postId));
    return true;
  } catch (error) {
    console.error('Error deleting blog post:', error);
    throw error;
  }
};

// Get blog posts
export const getBlogPosts = async (): Promise<FirestoreBlogPost[]> => {
  try {
    const q = query(
      collection(db, 'blogs'),
      orderBy('published_at', 'desc'),
      limit(100)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      console.log("No blog posts found in Firestore");
      return [];
    }
    
    const posts = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title || 'Untitled Post',
        excerpt: data.excerpt || 'No description available',
        body: data.body || '',
        author: data.author || 'Anonymous',
        published_at: data.published_at || data.created_at || Timestamp.now(),
        tags: data.tags || [],
        cover_image_url: data.cover_image_url || '/placeholder.svg'
      } as FirestoreBlogPost;
    });
    
    return posts;
  } catch (error) {
    console.error('Error getting blog posts:', error);
    throw error;
  }
};
