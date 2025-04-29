
import { BaseRepository } from './baseRepository';
import { PodcastData } from '../types';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, query, orderBy, limit, Timestamp, doc, deleteDoc, getDoc, updateDoc } from 'firebase/firestore';

/**
 * Repository for podcast episodes using Firebase
 */
export class FirebasePodcastRepository extends BaseRepository<PodcastData> {
  constructor() {
    super('Firebase');
  }

  async getAll(): Promise<PodcastData[]> {
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
        } as PodcastData;
      });
      
      return podcasts;
    } catch (error) {
      return this.handleError(error, 'get podcasts');
    }
  }

  async getById(id: string): Promise<PodcastData | null> {
    try {
      const docRef = doc(db, 'podcasts', id);
      const docSnapshot = await getDoc(docRef);
      
      if (!docSnapshot.exists()) {
        return null;
      }
      
      const data = docSnapshot.data();
      return {
        id: docSnapshot.id,
        title: data.title || 'Untitled Episode',
        description: data.description || 'No description available',
        audio_url: data.audio_url || '',
        guest_name: data.guest_name || '',
        duration: data.duration || '00:00',
        published_at: data.published_at || data.created_at || Timestamp.now(),
        cover_image_url: data.cover_image_url || '/placeholder.svg'
      };
    } catch (error) {
      return this.handleError(error, 'get podcast by id');
    }
  }

  async create(podcastData: Omit<PodcastData, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'podcasts'), {
        title: podcastData.title,
        description: podcastData.description,
        audio_url: podcastData.audio_url,
        guest_name: podcastData.guest_name || '',
        duration: podcastData.duration,
        cover_image_url: podcastData.cover_image_url,
        published_at: podcastData.published_at instanceof Date 
          ? Timestamp.fromDate(podcastData.published_at) 
          : typeof podcastData.published_at === 'string'
            ? Timestamp.fromDate(new Date(podcastData.published_at))
            : Timestamp.now(),
        created_at: Timestamp.now()
      });
      return docRef.id;
    } catch (error) {
      return this.handleError(error, 'create podcast');
    }
  }

  async update(id: string, podcastData: Partial<PodcastData>): Promise<boolean> {
    try {
      const docRef = doc(db, 'podcasts', id);
      const updateData: Record<string, any> = {
        ...podcastData,
        updated_at: Timestamp.now()
      };
      
      // Convert Date objects to Firestore Timestamps
      if (podcastData.published_at instanceof Date) {
        updateData.published_at = Timestamp.fromDate(podcastData.published_at);
      }
      
      await updateDoc(docRef, updateData);
      return true;
    } catch (error) {
      return this.handleError(error, 'update podcast');
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await deleteDoc(doc(db, 'podcasts', id));
      return true;
    } catch (error) {
      return this.handleError(error, 'delete podcast');
    }
  }
}
