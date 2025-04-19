
import { collection, addDoc, getDocs, query, orderBy, limit, Timestamp, doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Interface for podcast episodes from Firestore
export interface FirestorePodcast {
  id: string;
  title: string;
  description: string;
  audio_url: string;
  guest_name?: string;
  duration: string;
  published_at: any;
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
      limit(100)
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
