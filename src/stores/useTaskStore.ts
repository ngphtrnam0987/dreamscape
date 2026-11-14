import { create } from 'zustand';
import { TaskItem } from '../types/task';
import confetti from 'canvas-confetti';

interface TaskStoreState {
  tasks: TaskItem[];
  activeTaskId: string | null;

  addTask: (title: string) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  clearCompleted: () => void;
  setActiveTaskId: (id: string | null) => void;
  getActiveTask: () => TaskItem | undefined;
}

const STORAGE_KEY = 'dreamscape_tasks_state';

function loadStoredTasks(): { tasks: TaskItem[]; activeTaskId: string | null } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        tasks: Array.isArray(parsed.tasks) ? parsed.tasks : [],
        activeTaskId: typeof parsed.activeTaskId === 'string' ? parsed.activeTaskId : null,
      };
    }
  } catch {}
  return {
    tasks: [
      {
        id: 'welcome-task-1',
        title: 'Bắt đầu phiên làm việc sâu (Deep work session)',
        completed: false,
        createdAt: Date.now(),
      },
      {
        id: 'welcome-task-2',
        title: 'Thưởng thức âm thanh thiên nhiên & tiếng mưa',
        completed: true,
        createdAt: Date.now() - 60000,
        completedAt: Date.now(),
      },
    ],
    activeTaskId: 'welcome-task-1',
  };
}

const initial = loadStoredTasks();

export const useTaskStore = create<TaskStoreState>((set, get) => ({
  tasks: initial.tasks,
  activeTaskId: initial.activeTaskId,

  addTask: (title: string) => {
    const trimmed = title.trim();
    if (!trimmed) return;

    const newTask: TaskItem = {
      id: 'task-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6),
      title: trimmed,
      completed: false,
      createdAt: Date.now(),
    };

    set(state => {
      const updated = [newTask, ...state.tasks];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          tasks: updated,
          activeTaskId: state.activeTaskId || newTask.id,
        }));
      } catch {}
      return {
        tasks: updated,
        activeTaskId: state.activeTaskId || newTask.id,
      };
    });
  },

  toggleTask: (id: string) => {
    set(state => {
      let nowCompleted = false;
      const updated = state.tasks.map(t => {
        if (t.id === id) {
          const willComplete = !t.completed;
          nowCompleted = willComplete;
          return {
            ...t,
            completed: willComplete,
            completedAt: willComplete ? Date.now() : undefined,
          };
        }
        return t;
      });

      // If task was marked complete
      if (nowCompleted) {
        const remainingIncomplete = updated.filter(t => !t.completed).length;
        if (remainingIncomplete === 0 && updated.length > 0) {
          // Celebrate with confetti!
          try {
            confetti({
              particleCount: 80,
              spread: 70,
              origin: { y: 0.6 },
              colors: ['#38bdf8', '#fbbf24', '#34d399', '#f472b6'],
            });
          } catch {}
        }
      }

      // If active task was completed, clear or pick next incomplete
      let nextActiveId = state.activeTaskId;
      if (state.activeTaskId === id && nowCompleted) {
        const nextIncomplete = updated.find(t => !t.completed);
        nextActiveId = nextIncomplete ? nextIncomplete.id : null;
      }

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          tasks: updated,
          activeTaskId: nextActiveId,
        }));
      } catch {}

      return {
        tasks: updated,
        activeTaskId: nextActiveId,
      };
    });
  },

  deleteTask: (id: string) => {
    set(state => {
      const updated = state.tasks.filter(t => t.id !== id);
      const nextActiveId = state.activeTaskId === id
        ? (updated.find(t => !t.completed)?.id || null)
        : state.activeTaskId;

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          tasks: updated,
          activeTaskId: nextActiveId,
        }));
      } catch {}

      return {
        tasks: updated,
        activeTaskId: nextActiveId,
      };
    });
  },

  clearCompleted: () => {
    set(state => {
      const updated = state.tasks.filter(t => !t.completed);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          tasks: updated,
          activeTaskId: state.activeTaskId,
        }));
      } catch {}
      return { tasks: updated };
    });
  },

  setActiveTaskId: (id: string | null) => {
    set({ activeTaskId: id });
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        tasks: get().tasks,
        activeTaskId: id,
      }));
    } catch {}
  },

  getActiveTask: () => {
    const { tasks, activeTaskId } = get();
    if (!activeTaskId) return undefined;
    return tasks.find(t => t.id === activeTaskId);
  },
}));
