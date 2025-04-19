
import { collection, addDoc, getDocs, query, orderBy, limit, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Contact form submission
export const submitContactForm = async (formData: {
  name: string;
  email: string;
  company?: string;
  message: string;
}) => {
  try {
    const docRef = await addDoc(collection(db, 'contacts'), {
      ...formData,
      createdAt: Timestamp.now()
    });
    console.log("Contact form submitted with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error submitting contact form:', error);
    throw error;
  }
};

// Schedule booking submission
export const submitScheduleBooking = async (bookingData: {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  topic?: string;
  date: string;
  time: string;
}) => {
  try {
    const docRef = await addDoc(collection(db, 'bookings'), {
      ...bookingData,
      createdAt: Timestamp.now(),
      status: 'pending'
    });
    console.log("Booking submitted with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error submitting booking:', error);
    throw error;
  }
};

// Interface for blog posts from Firestore
export interface FirestoreBlogPost {
  id: string;
  title: string;
  excerpt: string;
  content?: string;
  date: any; // Could be Timestamp or date string
  author: string;
  category: string;
  image: string;
  slug?: string;
  tags?: string[];
  published?: boolean;
}

// Get blog posts
export const getBlogPosts = async (postsToLoad = 6): Promise<FirestoreBlogPost[]> => {
  try {
    const q = query(
      collection(db, 'posts'),
      orderBy('createdAt', 'desc'),
      limit(postsToLoad)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      console.log("No blog posts found in Firestore, using placeholders");
      return [];
    }
    
    const posts = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title || 'Untitled Post',
        excerpt: data.excerpt || 'No description available',
        date: data.date || data.createdAt || Timestamp.now(),
        author: data.author || 'Anonymous',
        category: data.category || 'Uncategorized',
        image: data.image || '/placeholder.svg',
        slug: data.slug || doc.id,
        content: data.content || '',
        tags: data.tags || [],
        published: data.published !== false // Default to true if not specified
      } as FirestoreBlogPost;
    });
    
    return posts;
  } catch (error) {
    console.error('Error getting blog posts:', error);
    throw error;
  }
};
