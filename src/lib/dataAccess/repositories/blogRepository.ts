
import { BaseRepository } from './baseRepository';
import { BlogPostData } from '../types';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, query, orderBy, limit, Timestamp, doc, deleteDoc, getDoc, updateDoc } from 'firebase/firestore';

/**
 * Repository for blog posts using Firebase
 */
export class FirebaseBlogRepository extends BaseRepository<BlogPostData> {
  constructor() {
    super('Firebase');
  }

  async getAll(): Promise<BlogPostData[]> {
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
          id: doc.id, // This is now guaranteed to be a string
          title: data.title || 'Untitled Post',
          excerpt: data.excerpt || 'No description available',
          body: data.body || '',
          author: data.author || 'Anonymous',
          published_at: data.published_at || data.created_at || Timestamp.now(),
          tags: data.tags || [],
          cover_image_url: data.cover_image_url || '/placeholder.svg'
        } as BlogPostData;
      });
      
      return posts;
    } catch (error) {
      return this.handleError(error, 'get blog posts');
    }
  }

  async getById(id: string): Promise<BlogPostData | null> {
    try {
      const docRef = doc(db, 'blogs', id);
      const docSnapshot = await getDoc(docRef);
      
      if (!docSnapshot.exists()) {
        return null;
      }
      
      const data = docSnapshot.data();
      return {
        id: docSnapshot.id,
        title: data.title || 'Untitled Post',
        excerpt: data.excerpt || 'No description available',
        body: data.body || '',
        author: data.author || 'Anonymous',
        published_at: data.published_at || data.created_at || Timestamp.now(),
        tags: data.tags || [],
        cover_image_url: data.cover_image_url || '/placeholder.svg'
      };
    } catch (error) {
      return this.handleError(error, 'get blog post by id');
    }
  }

  async create(postData: Omit<BlogPostData, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'blogs'), {
        title: postData.title,
        excerpt: postData.excerpt,
        body: postData.body,
        author: postData.author,
        tags: postData.tags,
        cover_image_url: postData.cover_image_url,
        published_at: postData.published_at instanceof Date 
          ? Timestamp.fromDate(postData.published_at) 
          : typeof postData.published_at === 'string'
            ? Timestamp.fromDate(new Date(postData.published_at))
            : Timestamp.now(),
        created_at: Timestamp.now(),
      });
      return docRef.id;
    } catch (error) {
      return this.handleError(error, 'create blog post');
    }
  }

  async update(id: string, postData: Partial<BlogPostData>): Promise<boolean> {
    try {
      const docRef = doc(db, 'blogs', id);
      const updateData: Record<string, any> = {
        ...postData,
        updated_at: Timestamp.now()
      };
      
      // Convert Date objects to Firestore Timestamps
      if (postData.published_at instanceof Date) {
        updateData.published_at = Timestamp.fromDate(postData.published_at);
      }
      
      await updateDoc(docRef, updateData);
      return true;
    } catch (error) {
      return this.handleError(error, 'update blog post');
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await deleteDoc(doc(db, 'blogs', id));
      return true;
    } catch (error) {
      return this.handleError(error, 'delete blog post');
    }
  }
}
