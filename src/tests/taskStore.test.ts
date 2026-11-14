import { describe, it, expect, beforeEach } from 'vitest';
import { useTaskStore } from '../stores/useTaskStore';

describe('useTaskStore', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('adds and toggles tasks', () => {
    const store = useTaskStore.getState();
    const initialCount = store.tasks.length;

    store.addTask('Write unit test');
    expect(useTaskStore.getState().tasks.length).toBe(initialCount + 1);

    const created = useTaskStore.getState().tasks[0];
    expect(created.title).toBe('Write unit test');
    expect(created.completed).toBe(false);

    // Toggle
    store.toggleTask(created.id);
    expect(useTaskStore.getState().tasks[0].completed).toBe(true);
  });

  it('manages active task for focus mode', () => {
    const store = useTaskStore.getState();
    store.addTask('Deep focus target');
    const task = useTaskStore.getState().tasks[0];

    store.setActiveTaskId(task.id);
    expect(useTaskStore.getState().activeTaskId).toBe(task.id);
    expect(useTaskStore.getState().getActiveTask()?.title).toBe('Deep focus target');
  });

  it('deletes and clears completed tasks', () => {
    const store = useTaskStore.getState();
    store.addTask('Task to delete');
    const id = useTaskStore.getState().tasks[0].id;

    store.deleteTask(id);
    expect(useTaskStore.getState().tasks.some(t => t.id === id)).toBe(false);
  });
});
