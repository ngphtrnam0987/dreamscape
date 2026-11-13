import React, { useState } from 'react';
import { useUIStore } from '../../stores/useUIStore';
import { useStatsStore } from '../../stores/useStatsStore';
import { Modal } from '../ui/Modal';
import { getTranslation } from '../../locales';
import {
  Clock,
  CheckCircle,
  Calendar,
  Flame,
  Trash2,
  BarChart,
} from 'lucide-react';

export const StatsModal: React.FC = () => {
  const { activeModal, closeModal, language, showToast } = useUIStore();
  const {
    totalMinutes,
    totalSessions,
    getTodayStats,
    getLast7DaysStats,
    clearAllStats,
  } = useStatsStore();

  const [confirmClear, setConfirmClear] = useState(false);

  const today = getTodayStats();
  const history = getLast7DaysStats();

  const totalHours = Math.floor(totalMinutes / 60);
  const remMinutes = totalMinutes % 60;

  const maxMinutesInHistory = Math.max(...history.map(h => h.minutes), 60);

  const handleClear = () => {
    clearAllStats();
    setConfirmClear(false);
    showToast('Focus statistics reset.');
  };

  return (
    <Modal
      isOpen={activeModal === 'stats'}
      onClose={closeModal}
      title={getTranslation(language, 'statsTitle')}
      subtitle="Track your daily milestones and mindfulness journey"
      maxWidthClass="max-w-xl"
    >
      <div className="space-y-5">
        {/* Metric Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {/* Total Focus Time */}
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-2">
              <Clock className="w-3.5 h-3.5 text-sky-400" />
              <span>{getTranslation(language, 'totalFocusTime')}</span>
            </div>
            <div>
              <span className="text-2xl font-bold font-mono text-white">
                {totalHours}
              </span>
              <span className="text-xs text-slate-400 ml-1">{getTranslation(language, 'hours')}</span>
              <span className="text-xl font-bold font-mono text-white ml-2">
                {remMinutes}
              </span>
              <span className="text-xs text-slate-400 ml-1">{getTranslation(language, 'minutes')}</span>
            </div>
          </div>

          {/* Total Sessions */}
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-2">
              <CheckCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>{getTranslation(language, 'totalSessionsCompleted')}</span>
            </div>
            <div>
              <span className="text-2xl font-bold font-mono text-white">
                {totalSessions}
              </span>
              <span className="text-xs text-slate-400 ml-1.5">sessions</span>
            </div>
          </div>

          {/* Today's Sessions */}
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between col-span-2 sm:col-span-1">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-2">
              <Flame className="w-3.5 h-3.5 text-orange-400" />
              <span>{getTranslation(language, 'sessionsCompletedToday')}</span>
            </div>
            <div>
              <span className="text-2xl font-bold font-mono text-amber-300">
                {today.sessions}
              </span>
              <span className="text-xs text-slate-400 ml-1.5">
                ({today.minutes}m focus)
              </span>
            </div>
          </div>
        </div>

        {/* 7-Day Activity Bar Chart */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-white">
            <span className="flex items-center gap-1.5">
              <BarChart className="w-3.5 h-3.5 text-sky-400" />
              {getTranslation(language, 'last7Days')}
            </span>
            <span className="text-slate-400 font-mono text-[11px]">
              Peak: {maxMinutesInHistory}m
            </span>
          </div>

          <div className="flex items-end justify-between gap-2 h-36 pt-4 pb-1 px-2 border-b border-white/10">
            {history.map((h, i) => {
              const heightPct = Math.min(100, Math.max(8, (h.minutes / maxMinutesInHistory) * 100));
              const isToday = i === history.length - 1;

              return (
                <div key={h.date} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                  {/* Tooltip value */}
                  <span className="text-[10px] font-mono text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity">
                    {h.minutes}m
                  </span>

                  {/* Bar */}
                  <div
                    style={{ height: `${heightPct}%` }}
                    className={`w-full max-w-[32px] rounded-t-lg transition-all ${
                      isToday
                        ? 'bg-gradient-to-t from-amber-500 to-amber-400 shadow-md shadow-amber-500/30'
                        : h.minutes > 0
                        ? 'bg-gradient-to-t from-sky-600 to-sky-400'
                        : 'bg-white/10'
                    }`}
                  />

                  {/* Day Label */}
                  <span
                    className={`text-[11px] font-medium tracking-tight ${
                      isToday ? 'text-amber-300 font-bold' : 'text-slate-400'
                    }`}
                  >
                    {h.dayLabel}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Clear Data Section */}
        <div className="pt-2 flex items-center justify-between">
          <div className="flex items-center gap-1 text-slate-400 text-xs">
            <Calendar className="w-3.5 h-3.5" />
            <span>Timezone: {Intl.DateTimeFormat().resolvedOptions().timeZone}</span>
          </div>

          {confirmClear ? (
            <div className="flex items-center gap-2 bg-red-950/80 px-3 py-1.5 rounded-xl border border-red-500/40 text-xs">
              <span className="text-red-200">Reset stats?</span>
              <button
                onClick={handleClear}
                className="text-red-400 font-bold hover:underline"
              >
                Yes, Clear
              </button>
              <button
                onClick={() => setConfirmClear(false)}
                className="text-slate-400 hover:underline"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmClear(true)}
              className="text-xs text-red-400/80 hover:text-red-400 flex items-center gap-1 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{getTranslation(language, 'clearData')}</span>
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};
