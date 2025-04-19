
import { collection, addDoc, getDocs, query, orderBy, limit, Timestamp, doc, deleteDoc, updateDoc, where, DocumentData } from 'firebase/firestore';
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

// Submit blog post to Firestore
export const submitBlogPost = async (postData: {
  title: string;
  summary: string;
  content: string;
  category: string;
  author: string;
  coverImageURL: string;
  slug: string;
  date: Date;
}) => {
  try {
    // Check if a post with the same slug already exists
    const slugQuery = query(
      collection(db, 'posts'),
      where('slug', '==', postData.slug)
    );
    
    const slugQuerySnapshot = await getDocs(slugQuery);
    
    if (!slugQuerySnapshot.empty) {
      // If we're updating an existing post
      const docId = slugQuerySnapshot.docs[0].id;
      await updateDoc(doc(db, 'posts', docId), {
        title: postData.title,
        excerpt: postData.summary,
        content: postData.content,
        category: postData.category,
        author: postData.author,
        image: postData.coverImageURL,
        updatedAt: Timestamp.now()
      });
      return docId;
    } else {
      // Creating a new post
      const docRef = await addDoc(collection(db, 'posts'), {
        title: postData.title,
        excerpt: postData.summary,
        content: postData.content,
        category: postData.category,
        author: postData.author,
        image: postData.coverImageURL,
        slug: postData.slug,
        createdAt: Timestamp.now(),
        date: Timestamp.fromDate(postData.date),
        published: true
      });
      return docRef.id;
    }
  } catch (error) {
    console.error('Error submitting blog post:', error);
    throw error;
  }
};

// Delete blog post from Firestore
export const deleteBlogPost = async (postId: string) => {
  try {
    await deleteDoc(doc(db, 'posts', postId));
    return true;
  } catch (error) {
    console.error('Error deleting blog post:', error);
    throw error;
  }
};

// Get blog posts with all content
export const getBlogPosts = async (postsToLoad = 100): Promise<FirestoreBlogPost[]> => {
  try {
    const q = query(
      collection(db, 'posts'),
      orderBy('createdAt', 'desc'),
      limit(postsToLoad)
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
        content: data.content || '',
        date: data.date || data.createdAt || Timestamp.now(),
        author: data.author || 'Anonymous',
        category: data.category || 'Uncategorized',
        image: data.image || '/placeholder.svg',
        slug: data.slug || doc.id,
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

// Interface for podcast episodes from Firestore
export interface FirestorePodcast {
  id: string;
  episodeTitle: string;
  guestName: string;
  topic: string;
  description: string;
  date: any; // Could be Timestamp or date string
  audioLink: string;
  coverImageURL: string;
}

// Submit podcast to Firestore
export const submitPodcast = async (podcastData: {
  episodeTitle: string;
  guestName: string;
  topic: string;
  description: string;
  audioLink: string;
  coverImageURL: string;
  date: Date;
}) => {
  try {
    const docRef = await addDoc(collection(db, 'podcasts'), {
      episodeTitle: podcastData.episodeTitle,
      guestName: podcastData.guestName,
      topic: podcastData.topic,
      description: podcastData.description,
      audioLink: podcastData.audioLink,
      coverImageURL: podcastData.coverImageURL,
      createdAt: Timestamp.now(),
      date: Timestamp.fromDate(podcastData.date),
      published: true
    });
    return docRef.id;
  } catch (error) {
    console.error('Error submitting podcast:', error);
    throw error;
  }
};

// Delete podcast from Firestore
export const deletePodcast = async (podcastId: string) => {
  try {
    await deleteDoc(doc(db, 'podcasts', podcastId));
    return true;
  } catch (error) {
    console.error('Error deleting podcast:', error);
    throw error;
  }
};

// Get podcasts from Firestore
export const getPodcasts = async (limit = 100): Promise<FirestorePodcast[]> => {
  try {
    const q = query(
      collection(db, 'podcasts'),
      orderBy('createdAt', 'desc'),
      limit
    );
    
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      console.log("No podcasts found in Firestore");
      return [];
    }
    
    const podcasts = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        episodeTitle: data.episodeTitle || 'Untitled Episode',
        guestName: data.guestName || 'Anonymous',
        topic: data.topic || 'Uncategorized',
        description: data.description || 'No description available',
        date: data.date || data.createdAt || Timestamp.now(),
        audioLink: data.audioLink || '',
        coverImageURL: data.coverImageURL || '/placeholder.svg'
      } as FirestorePodcast;
    });
    
    return podcasts;
  } catch (error) {
    console.error('Error getting podcasts:', error);
    throw error;
  }
};
