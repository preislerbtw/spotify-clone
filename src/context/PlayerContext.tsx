import React, { createContext, useContext, useState, useCallback } from "react";
import { Track, PlayerState } from "../types";

interface PlayerContextType extends PlayerState {
  playTrack: (track: Track, queue: Track[]) => void;
  togglePlay: () => void;
  next: () => void;
  prev: () => void;
  setProgress: (p: number) => void;
  setVolume: (v: number) => void;
  setIsPlaying: (v: boolean) => void;
}

const PlayerContext = createContext<PlayerContextType | null>(null);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<PlayerState>({
    currentTrack: null,
    isPlaying: false,
    progress: 0,
    volume: 80,
    queue: [],
    currentIndex: 0,
  });

  const playTrack = useCallback((track: Track, queue: Track[]) => {
    const index = queue.findIndex((t) => t.id === track.id);
    setState((s) => ({ ...s, currentTrack: track, queue, currentIndex: index, isPlaying: true, progress: 0 }));
  }, []);

  const togglePlay = useCallback(() => {
    setState((s) => ({ ...s, isPlaying: !s.isPlaying }));
  }, []);

  const next = useCallback(() => {
    setState((s) => {
      const nextIndex = (s.currentIndex + 1) % s.queue.length;
      return { ...s, currentIndex: nextIndex, currentTrack: s.queue[nextIndex], progress: 0, isPlaying: true };
    });
  }, []);

  const prev = useCallback(() => {
    setState((s) => {
      const prevIndex = (s.currentIndex - 1 + s.queue.length) % s.queue.length;
      return { ...s, currentIndex: prevIndex, currentTrack: s.queue[prevIndex], progress: 0, isPlaying: true };
    });
  }, []);

  const setProgress = useCallback((p: number) => {
    setState((s) => ({ ...s, progress: p }));
  }, []);

  const setVolume = useCallback((v: number) => {
    setState((s) => ({ ...s, volume: v }));
  }, []);

  const setIsPlaying = useCallback((v: boolean) => {
    setState((s) => ({ ...s, isPlaying: v }));
  }, []);

  return (
    <PlayerContext.Provider value={{ ...state, playTrack, togglePlay, next, prev, setProgress, setVolume, setIsPlaying }}>
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayerContext() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayerContext deve ser usado dentro de PlayerProvider");
  return ctx;
}