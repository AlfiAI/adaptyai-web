
import { BaseRepository } from './baseRepository';
import { Conversation, ConversationMessage } from '../types';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, query, orderBy, limit, Timestamp, doc, deleteDoc, getDoc, updateDoc, setDoc, where } from 'firebase/firestore';

/**
 * Repository for AI assistant conversations using Firebase
 */
export class FirebaseConversationRepository extends BaseRepository<Conversation> {
  constructor() {
    super('Firebase');
  }

  async getAll(): Promise<Conversation[]> {
    try {
      const q = query(
        collection(db, 'conversations'),
        orderBy('updatedAt', 'desc'),
        limit(100)
      );
      
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        console.log("No conversations found in Firestore");
        return [];
      }
      
      const conversations: Conversation[] = [];
      
      for (const conversationDoc of querySnapshot.docs) {
        const data = conversationDoc.data();
        
        // Get messages for this conversation
        const messagesQuery = query(
          collection(db, 'conversations', conversationDoc.id, 'messages'),
          orderBy('timestamp', 'asc')
        );
        
        const messagesSnapshot = await getDocs(messagesQuery);
        const messages = messagesSnapshot.docs.map(messageDoc => {
          const messageData = messageDoc.data();
          return {
            id: messageDoc.id,
            role: messageData.role,
            content: messageData.content,
            timestamp: messageData.timestamp,
            conversationId: conversationDoc.id
          } as ConversationMessage;
        });
        
        conversations.push({
          id: conversationDoc.id,
          userId: data.userId || undefined,
          title: data.title || 'Untitled Conversation',
          createdAt: data.createdAt || Timestamp.now(),
          updatedAt: data.updatedAt || Timestamp.now(),
          messages
        });
      }
      
      return conversations;
    } catch (error) {
      return this.handleError(error, 'get conversations');
    }
  }

  async getById(id: string): Promise<Conversation | null> {
    try {
      const docRef = doc(db, 'conversations', id);
      const docSnapshot = await getDoc(docRef);
      
      if (!docSnapshot.exists()) {
        return null;
      }
      
      const data = docSnapshot.data();
      
      // Get messages for this conversation
      const messagesQuery = query(
        collection(db, 'conversations', id, 'messages'),
        orderBy('timestamp', 'asc')
      );
      
      const messagesSnapshot = await getDocs(messagesQuery);
      const messages = messagesSnapshot.docs.map(messageDoc => {
        const messageData = messageDoc.data();
        return {
          id: messageDoc.id,
          role: messageData.role,
          content: messageData.content,
          timestamp: messageData.timestamp,
          conversationId: id
        } as ConversationMessage;
      });
      
      return {
        id,
        userId: data.userId || undefined,
        title: data.title || 'Untitled Conversation',
        createdAt: data.createdAt || Timestamp.now(),
        updatedAt: data.updatedAt || Timestamp.now(),
        messages
      };
    } catch (error) {
      return this.handleError(error, 'get conversation by id');
    }
  }

  async create(conversation: Omit<Conversation, 'id'>): Promise<string> {
    try {
      const { messages, ...conversationData } = conversation;
      
      // Create conversation document
      const conversationRef = await addDoc(collection(db, 'conversations'), {
        ...conversationData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      
      // Add messages to subcollection
      if (messages && messages.length > 0) {
        for (const message of messages) {
          await addDoc(collection(db, 'conversations', conversationRef.id, 'messages'), {
            role: message.role,
            content: message.content,
            timestamp: message.timestamp instanceof Date 
              ? Timestamp.fromDate(message.timestamp) 
              : typeof message.timestamp === 'string'
                ? Timestamp.fromDate(new Date(message.timestamp))
                : Timestamp.now(),
          });
        }
      }
      
      return conversationRef.id;
    } catch (error) {
      return this.handleError(error, 'create conversation');
    }
  }

  async update(id: string, conversation: Partial<Conversation>): Promise<boolean> {
    try {
      const { messages, ...conversationData } = conversation;
      
      // Update conversation document
      const conversationRef = doc(db, 'conversations', id);
      await updateDoc(conversationRef, {
        ...conversationData,
        updatedAt: Timestamp.now()
      });
      
      // Add new messages if provided
      if (messages && messages.length > 0) {
        for (const message of messages) {
          if (!message.id) {
            await addDoc(collection(db, 'conversations', id, 'messages'), {
              role: message.role,
              content: message.content,
              timestamp: message.timestamp instanceof Date 
                ? Timestamp.fromDate(message.timestamp) 
                : typeof message.timestamp === 'string'
                  ? Timestamp.fromDate(new Date(message.timestamp))
                  : Timestamp.now(),
            });
          }
        }
      }
      
      return true;
    } catch (error) {
      return this.handleError(error, 'update conversation');
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      // Delete all messages in subcollection first
      const messagesQuery = query(collection(db, 'conversations', id, 'messages'));
      const messagesSnapshot = await getDocs(messagesQuery);
      
      const deletePromises = messagesSnapshot.docs.map(messageDoc => 
        deleteDoc(doc(db, 'conversations', id, 'messages', messageDoc.id))
      );
      
      await Promise.all(deletePromises);
      
      // Then delete the conversation document
      await deleteDoc(doc(db, 'conversations', id));
      
      return true;
    } catch (error) {
      return this.handleError(error, 'delete conversation');
    }
  }

  async addMessage(conversationId: string, message: Omit<ConversationMessage, 'id' | 'conversationId'>): Promise<string> {
    try {
      // Add message to subcollection
      const messageRef = await addDoc(
        collection(db, 'conversations', conversationId, 'messages'),
        {
          role: message.role,
          content: message.content,
          timestamp: message.timestamp instanceof Date 
            ? Timestamp.fromDate(message.timestamp) 
            : typeof message.timestamp === 'string'
              ? Timestamp.fromDate(new Date(message.timestamp))
              : Timestamp.now(),
        }
      );
      
      // Update conversation updatedAt timestamp
      await updateDoc(doc(db, 'conversations', conversationId), {
        updatedAt: Timestamp.now()
      });
      
      return messageRef.id;
    } catch (error) {
      return this.handleError(error, 'add message to conversation');
    }
  }
}
