
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'admin' | 'editor' | 'viewer' | null;

interface AuthState {
  authenticated: boolean;
  role: UserRole;
  login: (password: string) => boolean;
  logout: () => void;
  checkAuth: () => boolean;
}

// Simple password authentication for now
// This will be replaced with proper auth in a future phase
const ADMIN_PASSWORD = "adapty2025";

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      authenticated: false,
      role: null,
      
      login: (password: string) => {
        if (password === ADMIN_PASSWORD) {
          set({ authenticated: true, role: 'admin' });
          return true;
        }
        return false;
      },
      
      logout: () => {
        set({ authenticated: false, role: null });
      },
      
      checkAuth: () => {
        return get().authenticated;
      }
    }),
    {
      name: 'adapty-auth-storage',
    }
  )
);
