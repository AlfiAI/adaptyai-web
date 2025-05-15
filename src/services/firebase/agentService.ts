
import { collection, addDoc, getDocs, query, orderBy, limit, Timestamp, doc, deleteDoc, updateDoc, where, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { AgentInfo, AgentFeature, AgentFaq } from '@/lib/dataAccess/types';

// Get all agents from Firestore
export const getAgents = async (): Promise<AgentInfo[]> => {
  try {
    const q = query(
      collection(db, 'agents'),
      orderBy('name', 'asc')
    );
    
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      console.log("No agents found in Firestore");
      return [];
    }
    
    const agents = querySnapshot.docs.map(doc => {
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
        createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString(),
        updatedAt: data.updatedAt?.toDate()?.toISOString()
      } as AgentInfo;
    });
    
    return agents;
  } catch (error) {
    console.error('Error getting agents:', error);
    throw error;
  }
};

// Get agent features
export const getAgentFeatures = async (agentId: string): Promise<AgentFeature[]> => {
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
    console.error('Error getting agent features:', error);
    throw error;
  }
};

// Get agent FAQs
export const getAgentFaqs = async (agentId: string): Promise<AgentFaq[]> => {
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
    console.error('Error getting agent FAQs:', error);
    throw error;
  }
};

// Get agent by slug
export const getAgentBySlug = async (slug: string): Promise<AgentInfo | null> => {
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
      createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString(),
      updatedAt: data.updatedAt?.toDate()?.toISOString()
    };
  } catch (error) {
    console.error('Error getting agent by slug:', error);
    throw error;
  }
};
