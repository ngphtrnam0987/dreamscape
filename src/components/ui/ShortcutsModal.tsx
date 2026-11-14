import React from 'react';
import { useUIStore } from '../../stores/useUIStore';
import { Modal } from './Modal';
import { getTranslation } from '../../locales';
import { Keyboard, Volume2, Eye, Compass, Timer, Wind, FileText, Radio, Sliders } from 'lucide-react';

export const ShortcutsModal: React.FC = () => {
  const { activeModal, closeModal, language } = useUIStore();

  const shortcutGroups = [
    {
      title: getTranslation(language, 'playbackShortcuts'),
      icon: <Volume2 className="w-4 h-4 text-sky-400" />,
      items: [
        { key: 'Space', desc: getTranslation(language, 'spaceShortcut') },
        { key: 'M', desc: getTranslation(language, 'mShortcut') },
      ],
    },
    {
      title: getTranslation(language, 'viewShortcuts'),
      icon: <Eye className="w-4 h-4 text-emerald-400" />,
      items: [
        { key: 'H', desc: getTranslation(language, 'hShortcut') },
        { key: 'F', desc: getTranslation(language, 'fShortcut') },
        { key: 'C', desc: getTranslation(language, 'cShortcut') },
        { key: 'V', desc: getTranslation(language, 'vShortcut') },
        { key: 'G', desc: language === 'vi' ? 'Đổi cấu hình Đồ hoạ (Eco / Balanced / Ultra)' : 'Cycle Graphics Tier (Eco / Balanced / Ultra)' },
        { key: 'W', desc: language === 'vi' ? 'Đổi kiểu Thời tiết (Mưa, Tuyết, Nắng, Bão...)' : 'Cycle Dynamic Weather (Rain, Snow, Clear...)' },
        { key: '1 - 8', desc: getTranslation(language, 'oneToEightShortcut') },
        { key: '[ / ]', desc: getTranslation(language, 'prevNextSceneShortcut') },
      ],
    },
    {
      title: getTranslation(language, 'toolShortcuts'),
      icon: <Timer className="w-4 h-4 text-amber-400" />,
      items: [
        { key: 'T', desc: getTranslation(language, 'tShortcut') },
        { key: 'K', desc: getTranslation(language, 'kShortcut') },
        { key: 'L', desc: getTranslation(language, 'lShortcut') },
        { key: 'B', desc: getTranslation(language, 'bShortcut') },
        { key: 'N', desc: getTranslation(language, 'nShortcut') },
        { key: 'S', desc: getTranslation(language, 'sShortcut') },
        { key: 'Esc', desc: getTranslation(language, 'escShortcut') },
        { key: '?', desc: getTranslation(language, 'helpShortcut') },
      ],
    },
  ];

  return (
    <Modal
      isOpen={activeModal === 'shortcuts'}
      onClose={closeModal}
      title={getTranslation(language, 'shortcutsTitle')}
      subtitle="Speed up your workflow and ambient control with handy key shortcuts"
      maxWidthClass="max-w-xl"
    >
      <div className="space-y-4 py-2">
        {shortcutGroups.map((group, groupIdx) => (
          <div key={groupIdx} className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-300">
              {group.icon}
              <span>{group.title}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {group.items.map((item, itemIdx) => (
                <div
                  key={itemIdx}
                  className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-white/5"
                >
                  <span className="text-xs text-slate-300 truncate pr-2">{item.desc}</span>
                  <kbd className="px-2 py-0.5 rounded-lg bg-white/10 border border-white/20 font-mono text-[11px] font-bold text-sky-300 shrink-0 shadow-inner">
                    {item.key}
                  </kbd>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
};
