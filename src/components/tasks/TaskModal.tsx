import React, { useState } from 'react';
import { useUIStore } from '../../stores/useUIStore';
import { useTaskStore } from '../../stores/useTaskStore';
import { useAudioStore } from '../../stores/useAudioStore';
import { Modal } from '../ui/Modal';
import { getTranslation } from '../../locales';
import {
  CheckSquare,
  Square,
  Trash2,
  Plus,
  Sparkles,
  Target,
  CheckCircle2,
  Layers,
} from 'lucide-react';

export const TaskModal: React.FC = () => {
  const { activeModal, closeModal, language } = useUIStore();
  const {
    tasks,
    addTask,
    toggleTask,
    deleteTask,
    clearCompleted,
    activeTaskId,
    setActiveTaskId,
  } = useTaskStore();
  const { playChime } = useAudioStore();

  const [inputTitle, setInputTitle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputTitle.trim()) return;
    addTask(inputTitle);
    setInputTitle('');
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const allDone = totalCount > 0 && completedCount === totalCount;

  return (
    <Modal
      isOpen={activeModal === 'tasks'}
      onClose={closeModal}
      title={getTranslation(language, 'tasksTitle')}
      subtitle={getTranslation(language, 'tasksSubtitle')}
      maxWidthClass="max-w-xl"
    >
      <div className="space-y-4 py-1">
        {/* Progress Card */}
        {totalCount > 0 && (
          <div className="p-3 sm:p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Target className="w-4 h-4 text-sky-400" />
                <span>
                  {getTranslation(language, 'completedTasksCount')
                    .replace('{completed}', completedCount.toString())
                    .replace('{total}', totalCount.toString())}
                </span>
              </span>
              <span className="font-mono text-sky-300 font-bold">{progressPercent}%</span>
            </div>

            <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden border border-white/10">
              <div
                className="h-full bg-gradient-to-r from-sky-500 via-teal-400 to-emerald-400 transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {allDone && (
              <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-400/30 flex items-center gap-2 text-emerald-300 text-xs animate-fade-in font-medium">
                <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{getTranslation(language, 'allTasksCompleted')}</span>
              </div>
            )}
          </div>
        )}

        {/* Add Task Input Form */}
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={inputTitle}
              onChange={e => setInputTitle(e.target.value)}
              placeholder={getTranslation(language, 'addTaskPlaceholder')}
              className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-white text-xs placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition-all"
            />
            {inputTitle && (
              <button
                type="button"
                onClick={() => setInputTitle('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs"
              >
                ✕
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={!inputTitle.trim()}
            className="px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-semibold text-xs flex items-center gap-1.5 transition-all shadow-md shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add</span>
          </button>
        </form>

        {/* Task Items List */}
        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
          {tasks.length === 0 ? (
            <div className="text-center py-8 text-slate-500 space-y-2">
              <Layers className="w-8 h-8 mx-auto opacity-40 text-slate-400" />
              <p className="text-xs">{getTranslation(language, 'noTasksYet')}</p>
            </div>
          ) : (
            tasks.map(task => {
              const isActive = activeTaskId === task.id;

              return (
                <div
                  key={task.id}
                  className={`flex items-center justify-between gap-3 p-2.5 rounded-xl border transition-all ${
                    task.completed
                      ? 'bg-white/5 border-white/5 opacity-60'
                      : isActive
                      ? 'bg-sky-500/15 border-sky-400/40 shadow-sm'
                      : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10'
                  }`}
                >
                  {/* Left: Checkbox & Title */}
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <button
                      onClick={() => {
                        toggleTask(task.id);
                        if (!task.completed) {
                          playChime(0.3);
                        }
                      }}
                      className="p-1 rounded-lg text-slate-400 hover:text-white shrink-0 transition-colors"
                      title={task.completed ? 'Mark incomplete' : 'Mark completed'}
                    >
                      {task.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-400 hover:text-sky-400" />
                      )}
                    </button>

                    <span
                      onClick={() => toggleTask(task.id)}
                      className={`text-xs cursor-pointer select-none truncate ${
                        task.completed
                          ? 'line-through text-slate-500'
                          : 'text-slate-200 hover:text-white'
                      }`}
                    >
                      {task.title}
                    </span>

                    {isActive && !task.completed && (
                      <span className="px-1.5 py-0.5 rounded-md bg-sky-500/20 text-sky-300 border border-sky-400/30 text-[9px] font-mono shrink-0">
                        {getTranslation(language, 'taskActiveBadge')}
                      </span>
                    )}
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    {!task.completed && (
                      <button
                        onClick={() => setActiveTaskId(isActive ? null : task.id)}
                        className={`p-1.5 rounded-lg text-xs transition-colors ${
                          isActive
                            ? 'text-sky-400 bg-sky-500/20'
                            : 'text-slate-500 hover:text-slate-300'
                        }`}
                        title={getTranslation(language, 'setActiveTask')}
                      >
                        <Target className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <button
                      onClick={() => deleteTask(task.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 transition-colors"
                      title="Delete task"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer controls */}
        {completedCount > 0 && (
          <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs text-slate-400">
            <span>
              {completedCount} completed
            </span>
            <button
              onClick={clearCompleted}
              className="text-xs text-rose-400 hover:text-rose-300 transition-colors hover:underline"
            >
              {getTranslation(language, 'clearCompletedTasks')}
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
};
