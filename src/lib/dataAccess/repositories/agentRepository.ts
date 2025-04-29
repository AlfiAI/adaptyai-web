
import { collection, doc, getDoc, getDocs, query, addDoc, updateDoc, deleteDoc, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { BaseRepository } from './baseRepository';
import { AgentInfo } from '../types';

/**
 * Repository for AI agent info using Firebase
 */
export class FirebaseAgentRepository extends BaseRepository<AgentInfo> {
  constructor() {
    super('Firebase');
  }

  async getAll(): Promise<AgentInfo[]> {
    try {
      const q = query(
        collection(db, 'agents'),
        orderBy('createdAt', 'desc')
      );
      
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        console.log("No agents found in Firestore");
        return [];
      }
      
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name || 'Unnamed Agent',
          description: data.description || '',
          capabilities: data.capabilities || [],
          avatarUrl: data.avatarUrl,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate()
        };
      });
    } catch (error) {
      return this.handleError(error, 'getAll agents');
    }
  }

  async getById(id: string): Promise<AgentInfo | null> {
    try {
      const docRef = doc(db, 'agents', id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return null;
      }

      const data = docSnap.data();
      return {
        id: docSnap.id,
        name: data.name || 'Unnamed Agent',
        description: data.description || '',
        capabilities: data.capabilities || [],
        avatarUrl: data.avatarUrl,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate()
      };
    } catch (error) {
      return this.handleError(error, 'getById agent');
    }
  }

  async create(agentData: Omit<AgentInfo, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'agents'), {
        name: agentData.name,
        description: agentData.description,
        capabilities: agentData.capabilities || [],
        avatarUrl: agentData.avatarUrl,
        createdAt: new Date(),
      });
      return docRef.id;
    } catch (error) {
      return this.handleError(error, 'create agent');
    }
  }

  async update(id: string, agentData: Partial<AgentInfo>): Promise<boolean> {
    try {
      const docRef = doc(db, 'agents', id);
      const updateData = {
        ...agentData,
        updatedAt: new Date()
      };
      
      await updateDoc(docRef, updateData);
      return true;
    } catch (error) {
      return this.handleError(error, 'update agent');
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await deleteDoc(doc(db, 'agents', id));
      return true;
    } catch (error) {
      return this.handleError(error, 'delete agent');
    }
  }
}
