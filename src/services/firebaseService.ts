
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
    return docRef.id;
  } catch (error) {
    console.error('Error submitting booking:', error);
    throw error;
  }
};

// Get blog posts
export const getBlogPosts = async (postsToLoad = 6) => {
  try {
    const q = query(
      collection(db, 'posts'),
      orderBy('createdAt', 'desc'),
      limit(postsToLoad)
    );
    
    const querySnapshot = await getDocs(q);
    const posts = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return posts;
  } catch (error) {
    console.error('Error getting blog posts:', error);
    throw error;
  }
};
