
import { collection, doc, getDoc, getDocs, query, addDoc, updateDoc, deleteDoc, orderBy, Timestamp, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { AgentBaseRepository } from './baseRepository';
import { AgentData, AgentInfo, AgentFeature, AgentFaq } from '../types';

/**
 * Repository for agent data using Firebase
 */
export class FirebaseAgentRepository extends AgentBaseRepository<AgentInfo> {
  constructor() {
    super('Firebase');
  }

  async getAll(): Promise<AgentInfo[]> {
    try {
      const q = query(collection(db, 'agents'));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name,
          title: data.title,
          shortDescription: data.shortDescription,
          fullDescription: data.fullDescription,
          avatarUrl: data.avatarUrl,
          themeColor: data.themeColor || '#60a5fa',
          agentType: data.agentType,
          capabilities: data.capabilities || [],
          slug: data.slug,
          createdAt: data.createdAt || new Date().toISOString(),
          updatedAt: data.updatedAt
        };
      });
    } catch (error) {
      return this.handleError(error, 'get all agents');
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
        name: data.name,
        title: data.title,
        shortDescription: data.shortDescription,
        fullDescription: data.fullDescription,
        avatarUrl: data.avatarUrl,
        themeColor: data.themeColor || '#60a5fa',
        agentType: data.agentType,
        capabilities: data.capabilities || [],
        slug: data.slug,
        createdAt: data.createdAt || new Date().toISOString(),
        updatedAt: data.updatedAt
      };
    } catch (error) {
      return this.handleError(error, 'get agent by id');
    }
  }

  async getBySlug(slug: string): Promise<AgentInfo | null> {
    try {
      const q = query(collection(db, 'agents'), where('slug', '==', slug));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        return null;
      }
      
      const doc = querySnapshot.docs[0];
      const data = doc.data();
      
      return {
        id: doc.id,
        name: data.name,
        title: data.title,
        shortDescription: data.shortDescription,
        fullDescription: data.fullDescription,
        avatarUrl: data.avatarUrl,
        themeColor: data.themeColor || '#60a5fa',
        agentType: data.agentType,
        capabilities: data.capabilities || [],
        slug: data.slug,
        createdAt: data.createdAt || new Date().toISOString(),
        updatedAt: data.updatedAt
      };
    } catch (error) {
      return this.handleError(error, 'get agent by slug');
    }
  }

  async getFeatures(agentId: string): Promise<AgentFeature[]> {
    try {
      const q = query(
        collection(db, 'agent_features'),
        where('agentId', '==', agentId),
        orderBy('displayOrder')
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          agentId: data.agentId,
          title: data.title,
          description: data.description,
          icon: data.icon,
          displayOrder: data.displayOrder
        };
      });
    } catch (error) {
      return this.handleError(error, 'get agent features');
    }
  }

  async getFAQs(agentId: string): Promise<AgentFaq[]> {
    try {
      const q = query(
        collection(db, 'agent_faqs'),
        where('agentId', '==', agentId),
        orderBy('displayOrder')
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          agentId: data.agentId,
          question: data.question,
          answer: data.answer,
          displayOrder: data.displayOrder,
          createdAt: data.createdAt || new Date().toISOString()
        };
      });
    } catch (error) {
      return this.handleError(error, 'get agent FAQs');
    }
  }

  async create(agentData: Omit<AgentData, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'agents'), {
        name: agentData.name,
        slug: agentData.slug,
        title: agentData.title,
        shortDescription: agentData.shortDescription,
        fullDescription: agentData.fullDescription,
        agentType: agentData.agentType,
        capabilities: agentData.capabilities || [],
        avatarUrl: agentData.avatarUrl,
        themeColor: agentData.themeColor,
        createdAt: new Date(),
      });
      return docRef.id;
    } catch (error) {
      return this.handleError(error, 'create agent');
    }
  }

  async update(id: string, agentData: Partial<AgentData>): Promise<boolean> {
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
