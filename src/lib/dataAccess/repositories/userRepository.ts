
import { collection, doc, getDoc, getDocs, query, addDoc, updateDoc, deleteDoc, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { BaseRepository } from './baseRepository';
import { UserProfile } from '../types';

/**
 * Repository for user profiles using Firebase
 */
export class FirebaseUserRepository extends BaseRepository<UserProfile> {
  constructor() {
    super('Firebase');
  }

  async getAll(): Promise<UserProfile[]> {
    try {
      const usersRef = collection(db, 'profiles');
      const snapshot = await getDocs(usersRef);

      if (snapshot.empty) {
        console.log("No user profiles found in Firestore");
        return [];
      }

      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          email: data.email || '',
          displayName: data.displayName || '',
          role: data.role || 'viewer',
          createdAt: data.createdAt?.toDate() || new Date(),
          avatarUrl: data.avatarUrl
        };
      });
    } catch (error) {
      return this.handleError(error, 'getAll user profiles');
    }
  }

  async getById(id: string): Promise<UserProfile | null> {
    try {
      const docRef = doc(db, 'profiles', id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return null;
      }

      const data = docSnap.data();
      return {
        id: docSnap.id,
        email: data.email || '',
        displayName: data.displayName || '',
        role: data.role || 'viewer',
        createdAt: data.createdAt?.toDate() || new Date(),
        avatarUrl: data.avatarUrl
      };
    } catch (error) {
      return this.handleError(error, 'getById user profile');
    }
  }

  async getByEmail(email: string): Promise<UserProfile | null> {
    try {
      const q = query(collection(db, 'profiles'), where('email', '==', email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        return null;
      }

      const doc = querySnapshot.docs[0];
      const data = doc.data();

      return {
        id: doc.id,
        email: data.email || '',
        displayName: data.displayName || '',
        role: data.role || 'viewer',
        createdAt: data.createdAt?.toDate() || new Date(),
        avatarUrl: data.avatarUrl
      };
    } catch (error) {
      return this.handleError(error, 'getByEmail user profile');
    }
  }

  async create(userData: Omit<UserProfile, 'id'>): Promise<string> {
    try {
      const usersRef = collection(db, 'profiles');
      const docRef = await addDoc(usersRef, {
        email: userData.email,
        displayName: userData.displayName || '',
        role: userData.role || 'viewer',
        createdAt: new Date(),
        avatarUrl: userData.avatarUrl || null,
      });

      return docRef.id;
    } catch (error) {
      return this.handleError(error, 'create user profile');
    }
  }

  async update(id: string, userData: Partial<UserProfile>): Promise<boolean> {
    try {
      const docRef = doc(db, 'profiles', id);
      await updateDoc(docRef, {
        ...userData,
        updatedAt: new Date(),
      });

      return true;
    } catch (error) {
      return this.handleError(error, 'update user profile');
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const docRef = doc(db, 'profiles', id);
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      return this.handleError(error, 'delete user profile');
    }
  }
}
