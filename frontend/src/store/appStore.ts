import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Flashcard } from '../utils/mockData';
import { FLASHCARDS } from '../utils/mockData';

export interface User {
  email: string;
  name: string;
  avatar?: string;
  experience: 'Fresher' | 'Experienced';
  targetRole: string;
  targetCompany: string;
  skills: string[];
}

export interface InterviewAttempt {
  id: string;
  date: string;
  company: string;
  role: string;
  score: number;
  type: 'Mock' | 'HR' | 'Coding' | 'System Design' | 'Behavioral';
}

export interface NoteItem {
  id: string;
  title: string;
  content: string;
  folder: string;
  updatedAt: string;
}

export interface AppState {
  // Auth
  isLoggedIn: boolean;
  user: User | null;
  login: (email: string, name: string) => void;
  logout: () => void;
  updateProfile: (updated: Partial<User>) => void;

  // Navigation
  currentPage: string;
  setCurrentPage: (page: string) => void;

  // History & Progress
  attempts: InterviewAttempt[];
  streak: number;
  lastActiveDate: string | null;
  addAttempt: (attempt: Omit<InterviewAttempt, 'id' | 'date'>) => void;
  checkAndUpdateStreak: () => void;

  // Daily Challenge status
  dailyChallengeStatus: {
    coding: boolean;
    hr: boolean;
    aptitude: boolean;
    systemDesign: boolean;
  };
  completeDailyChallenge: (type: 'coding' | 'hr' | 'aptitude' | 'systemDesign') => void;

  // Notes
  notes: NoteItem[];
  folders: string[];
  addNote: (title: string, folder: string, content?: string) => void;
  updateNote: (id: string, content: string) => void;
  deleteNote: (id: string) => void;
  addFolder: (name: string) => void;

  // Flashcards
  flashcards: Flashcard[];
  reviewFlashcard: (id: string, quality: 'again' | 'good' | 'easy') => void;
  addFlashcard: (front: string, back: string, category: string) => void;

  // Notifications
  notifications: { id: string; message: string; type: 'info' | 'success' | 'warning' }[];
  addNotification: (message: string, type?: 'info' | 'success' | 'warning') => void;
  clearNotification: (id: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Auth default state
      isLoggedIn: false,
      user: null,
      login: (email, name) => {
        const dummyUser: User = {
          email,
          name,
          experience: 'Fresher',
          targetRole: 'Software Engineer',
          targetCompany: 'Google',
          skills: ['React', 'JavaScript', 'Python'],
          avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${name}`
        };
        set({ isLoggedIn: true, user: dummyUser, currentPage: 'dashboard' });
        get().addNotification(`Welcome back, ${name}!`, 'success');
        get().checkAndUpdateStreak();
      },
      logout: () => {
        set({ isLoggedIn: false, user: null, currentPage: 'landing' });
      },
      updateProfile: (updated) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...updated } : null
        }));
        get().addNotification('Profile updated successfully!', 'success');
      },

      // Navigation
      currentPage: 'landing',
      setCurrentPage: (page) => set({ currentPage: page }),

      // Attempts & Streak
      attempts: [
        { id: '1', date: '2026-07-15', company: 'Google', role: 'Software Engineer', score: 82, type: 'Coding' },
        { id: '2', date: '2026-07-16', company: 'Amazon', role: 'Software Engineer', score: 75, type: 'Mock' }
      ],
      streak: 3,
      lastActiveDate: '2026-07-16',
      addAttempt: (attempt) => {
        const newAttempt: InterviewAttempt = {
          ...attempt,
          id: Math.random().toString(36).substr(2, 9),
          date: new Date().toISOString().split('T')[0]
        };
        set((state) => ({
          attempts: [newAttempt, ...state.attempts]
        }));
        get().checkAndUpdateStreak();
      },

      // Check and update streak method (called on activities)
      checkAndUpdateStreak: () => {
        const today = new Date().toISOString().split('T')[0];
        const last = get().lastActiveDate;
        if (!last) {
          set({ streak: 1, lastActiveDate: today });
          return;
        }
        if (last === today) return; // Already logged today

        const lastDate = new Date(last);
        const todayDate = new Date(today);
        const diffTime = Math.abs(todayDate.getTime() - lastDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          // Increment streak
          set((state) => ({ streak: state.streak + 1, lastActiveDate: today }));
          get().addNotification(`Daily streak maintained! You are on a ${get().streak} day streak. 🔥`, 'success');
        } else if (diffDays > 1) {
          // Streak broken
          set({ streak: 1, lastActiveDate: today });
          get().addNotification('New streak started! Practice daily to keep the fire going.', 'info');
        }
      },

      // Daily challenges
      dailyChallengeStatus: {
        coding: false,
        hr: false,
        aptitude: false,
        systemDesign: false
      },
      completeDailyChallenge: (type) => {
        set((state) => {
          const updated = { ...state.dailyChallengeStatus, [type]: true };
          // Check if all are completed
          const allCompleted = Object.values(updated).every(val => val === true);
          if (allCompleted) {
            get().addNotification('All daily challenges completed! Perfect score today. 🌟', 'success');
          }
          return { dailyChallengeStatus: updated };
        });
      },

      // Notes
      notes: [
        { id: 'n1', title: 'Dynamic Programming Patterns', content: '# DP Notes\n\n1. Knapsack Pattern\n2. Fibonacci Series\n3. Longest Common Subsequence (LCS)\n\nEnsure to define state constraints first.', folder: 'DSA', updatedAt: new Date().toISOString() },
        { id: 'n2', title: 'System Design Checklist', content: '# Load Balancing\n\n- Round Robin\n- Consistent Hashing\n- Least Connections\n\nStore indices properly.', folder: 'System Design', updatedAt: new Date().toISOString() }
      ],
      folders: ['DSA', 'System Design', 'General'],
      addNote: (title, folder, content = '') => {
        const newNote: NoteItem = {
          id: Math.random().toString(36).substr(2, 9),
          title,
          content,
          folder,
          updatedAt: new Date().toISOString()
        };
        set((state) => ({
          notes: [newNote, ...state.notes]
        }));
      },
      updateNote: (id, content) => {
        set((state) => ({
          notes: state.notes.map(n => n.id === id ? { ...n, content, updatedAt: new Date().toISOString() } : n)
        }));
      },
      deleteNote: (id) => {
        set((state) => ({
          notes: state.notes.filter(n => n.id !== id)
        }));
      },
      addFolder: (name) => {
        if (!get().folders.includes(name)) {
          set((state) => ({ folders: [...state.folders, name] }));
        }
      },

      // Flashcards (spaced repetition scheduling)
      flashcards: FLASHCARDS,
      reviewFlashcard: (id, quality) => {
        set((state) => {
          const updatedCards = state.flashcards.map(card => {
            if (card.id !== id) return card;
            let intervalDays = card.intervalDays;
            if (quality === 'again') {
              intervalDays = 1;
            } else if (quality === 'good') {
              intervalDays = card.intervalDays * 2;
            } else if (quality === 'easy') {
              intervalDays = card.intervalDays * 4;
            }
            
            const nextDate = new Date();
            nextDate.setDate(nextDate.getDate() + intervalDays);
            
            return {
              ...card,
              intervalDays,
              nextReviewDate: nextDate.toISOString()
            };
          });
          return { flashcards: updatedCards };
        });
      },
      addFlashcard: (front, back, category) => {
        const newCard: Flashcard = {
          id: Math.random().toString(36).substr(2, 9),
          front,
          back,
          category,
          nextReviewDate: new Date().toISOString(),
          intervalDays: 1
        };
        set((state) => ({ flashcards: [newCard, ...state.flashcards] }));
      },

      // Notifications
      notifications: [],
      addNotification: (message, type = 'info') => {
        const id = Math.random().toString(36).substr(2, 9);
        set((state) => ({
          notifications: [...state.notifications, { id, message, type }]
        }));
        // Auto-remove notification after 4 seconds
        setTimeout(() => {
          set((state) => ({
            notifications: state.notifications.filter(n => n.id !== id)
          }));
        }, 4000);
      },
      clearNotification: (id) => {
        set((state) => ({
          notifications: state.notifications.filter(n => n.id !== id)
        }));
      }
    }),
    {
      name: 'interviewprep-ai-storage',
      partialize: (state) => ({
        isLoggedIn: state.isLoggedIn,
        user: state.user,
        attempts: state.attempts,
        streak: state.streak,
        lastActiveDate: state.lastActiveDate,
        notes: state.notes,
        folders: state.folders,
        flashcards: state.flashcards
      })
    }
  )
);
export default useAppStore;
