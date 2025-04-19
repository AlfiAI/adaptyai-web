
import { collection, addDoc, getDocs, query, orderBy, limit as firestoreLimit, Timestamp, doc, deleteDoc, updateDoc, where, DocumentData } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';

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

// Upload image to Firebase Storage
export const uploadImage = async (file: File, path: string): Promise<string> => {
  try {
    const storageRef = ref(storage, `${path}/${file.name}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

// Upload audio to Firebase Storage
export const uploadAudio = async (file: File): Promise<string> => {
  try {
    const storageRef = ref(storage, `podcasts/audio/${file.name}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading audio:', error);
    throw error;
  }
};

// Interface for blog posts from Firestore
export interface FirestoreBlogPost {
  id: string;
  title: string;
  excerpt: string;
  body: string; // Markdown or rich text content
  author: string;
  published_at: any; // Could be Timestamp or date string
  tags: string[];
  cover_image_url: string;
}

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
      firestoreLimit(100)
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

// Interface for podcast episodes from Firestore
export interface FirestorePodcast {
  id: string;
  title: string;
  description: string;
  audio_url: string;
  guest_name?: string;
  duration: string;
  published_at: any; // Could be Timestamp or date string
  cover_image_url: string;
}

// Submit podcast to Firestore
export const submitPodcast = async (podcastData: {
  title: string;
  description: string;
  audio_url: string;
  guest_name?: string;
  duration: string;
  cover_image_url: string;
  published_at: Date;
}) => {
  try {
    const docRef = await addDoc(collection(db, 'podcasts'), {
      title: podcastData.title,
      description: podcastData.description,
      audio_url: podcastData.audio_url,
      guest_name: podcastData.guest_name || '',
      duration: podcastData.duration,
      cover_image_url: podcastData.cover_image_url,
      published_at: Timestamp.fromDate(podcastData.published_at || new Date()),
      created_at: Timestamp.now()
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
export const getPodcasts = async (): Promise<FirestorePodcast[]> => {
  try {
    const q = query(
      collection(db, 'podcasts'),
      orderBy('published_at', 'desc'),
      firestoreLimit(100)
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
        title: data.title || 'Untitled Episode',
        description: data.description || 'No description available',
        audio_url: data.audio_url || '',
        guest_name: data.guest_name || '',
        duration: data.duration || '00:00',
        published_at: data.published_at || data.created_at || Timestamp.now(),
        cover_image_url: data.cover_image_url || '/placeholder.svg'
      } as FirestorePodcast;
    });
    
    return podcasts;
  } catch (error) {
    console.error('Error getting podcasts:', error);
    throw error;
  }
};
