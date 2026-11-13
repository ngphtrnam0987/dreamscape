import React from 'react';
import { useLofiStore } from '../../stores/useLofiStore';

export const YouTubeAudioPlayer: React.FC = () => {
  const { isPlaying, getCurrentStation } = useLofiStore();
  const station = getCurrentStation();

  if (!isPlaying) return null;

  return (
    <div className="fixed bottom-0 right-0 w-1 h-1 opacity-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      <iframe
        key={station.youtubeId}
        src={`https://www.youtube-nocookie.com/embed/${station.youtubeId}?autoplay=1&enablejsapi=1&playsinline=1`}
        title="Lofi Girl Radio Stream"
        allow="autoplay; encrypted-media"
        className="w-full h-full"
      />
    </div>
  );
};
