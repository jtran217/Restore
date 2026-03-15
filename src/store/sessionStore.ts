import { create } from 'zustand';
import { postJournal, postSessionSummary } from '../lib/api';

export type SessionState = 'idle' | 'focus' | 'intervention' | 'summary';

interface SessionData {
  sessionId?: string;
  startTime: number;
  endTime?: number;
  interventionCount: number;
  avgHR: number;
  peakStrain: number;
  focusQuality: number;
  distinctApps?: number;
  avgDwellTime?: number;
  distinctDomains?: number;
  tabSwitchesPerMinute?: number;
}

interface SessionStore {
  sessionState: SessionState;
  currentSession: SessionData | null;
  pastSessions: SessionData[];

  startSession: () => void;
  endSession: (data?: Partial<SessionData>) => void;
  triggerIntervention: () => void;
  resumeFocus: () => void;
  saveToJournal: (reflectionText?: string) => void;
}

export const useSessionStore = create<SessionStore>((set, get) => ({
  sessionState: 'idle',
  currentSession: null,
  pastSessions: JSON.parse(localStorage.getItem('flow-sessions') || '[]'),

  startSession: () => {
    const sessionId = `flow-session-${Date.now()}`;
    set({
      sessionState: 'focus',
      currentSession: {
        sessionId,
        startTime: Date.now(),
        interventionCount: 0,
        avgHR: 0,
        peakStrain: 0,
        focusQuality: 0,
      },
    });
  },

  endSession: (data) => {
    const current = get().currentSession;
    if (!current) return;
    set({
      sessionState: 'summary',
      currentSession: {
        ...current,
        endTime: Date.now(),
        ...data,
      },
    });
  },

  triggerIntervention: () => {
    const current = get().currentSession;
    if (current) {
      set({
        sessionState: 'intervention',
        currentSession: {
          ...current,
          interventionCount: current.interventionCount + 1,
        },
      });
    }
  },

  resumeFocus: () => {
    set({ sessionState: 'focus' });
  },

  saveToJournal: (reflectionText?: string) => {
    const current = get().currentSession;
    if (!current) return;
    const text = reflectionText?.trim() || 'Session ended.';
    if (current.sessionId) {
      postJournal(current.sessionId, 'session_ended', text);
      postSessionSummary(current.sessionId);
    }
    const sessions = [...get().pastSessions, current];
    localStorage.setItem('flow-sessions', JSON.stringify(sessions));
    set({
      pastSessions: sessions,
      currentSession: null,
      sessionState: 'idle',
    });
  },
}));
