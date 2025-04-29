
import { collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, addDoc, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { BaseRepository } from './baseRepository';
import type { Conversation, ConversationMessage, ConversationRepository } from '../types';

/**
 * Repository for AI assistant conversations
 */
export class FirebaseConversationRepository extends BaseRepository<Conversation> implements ConversationRepository {
  constructor() {
    super('firebase');
  }

  async getAll(): Promise<Conversation[]> {
    try {
      const conversationsRef = collection(db, 'conversations');
      const snapshot = await getDocs(conversationsRef);

      if (snapshot.empty) {
        return [];
      }

      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          userId: data.userId,
          title: data.title || 'Untitled',
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
          messages: data.messages || []
        };
      });
    } catch (error) {
      return this.handleError(error, 'getAll conversations');
    }
  }

  async getById(id: string): Promise<Conversation | null> {
    try {
      const docRef = doc(db, 'conversations', id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return null;
      }

      const data = docSnap.data();
      return {
        id: docSnap.id,
        userId: data.userId,
        title: data.title || 'Untitled',
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
        messages: data.messages || []
      };
    } catch (error) {
      return this.handleError(error, 'getById conversation');
    }
  }

  async create(conversation: Omit<Conversation, 'id'>): Promise<string> {
    try {
      const conversationsRef = collection(db, 'conversations');
      const docRef = await addDoc(conversationsRef, {
        userId: conversation.userId,
        title: conversation.title,
        createdAt: new Date(),
        updatedAt: new Date(),
        messages: conversation.messages || []
      });

      return docRef.id;
    } catch (error) {
      return this.handleError(error, 'create conversation');
    }
  }

  async update(id: string, conversation: Partial<Conversation>): Promise<boolean> {
    try {
      const docRef = doc(db, 'conversations', id);
      const updates: any = { ...conversation, updatedAt: new Date() };
      
      await updateDoc(docRef, updates);
      return true;
    } catch (error) {
      return this.handleError(error, 'update conversation');
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const docRef = doc(db, 'conversations', id);
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      return this.handleError(error, 'delete conversation');
    }
  }

  async addMessage(conversationId: string, message: Omit<ConversationMessage, 'id' | 'conversationId'>): Promise<string> {
    try {
      const conversationRef = doc(db, 'conversations', conversationId);
      const conversation = await getDoc(conversationRef);
      
      if (!conversation.exists()) {
        throw new Error(`Conversation with ID ${conversationId} not found`);
      }
      
      const data = conversation.data();
      const messages = data.messages || [];
      const newMessage = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        conversationId,
        ...message,
        timestamp: new Date()
      };
      
      messages.push(newMessage);
      
      await updateDoc(conversationRef, { 
        messages, 
        updatedAt: new Date() 
      });
      
      return newMessage.id;
    } catch (error) {
      return this.handleError(error, 'add message to conversation');
    }
  }

  async getConversationsForUser(userId: string): Promise<Conversation[]> {
    try {
      const conversationsRef = collection(db, 'conversations');
      const q = query(conversationsRef, where("userId", "==", userId));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        return [];
      }

      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          userId: data.userId,
          title: data.title || 'Untitled',
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
          messages: data.messages || []
        };
      });
    } catch (error) {
      return this.handleError(error, 'get conversations for user');
    }
  }
}
