import React from "react";
import { usePlayerContext } from "../../context/PlayerContext";
import { formatDuration } from "../../utils/helpers";
import "./Player.css";

export default function Player() {
  const {
    currentTrack,
    isPlaying,
    progress,
    volume,
    togglePlay,
    next,
    prev,
    setVolume,
  } = usePlayerContext();

  if (!currentTrack) return null;

  const elapsed = currentTrack
    ? Math.floor((progress / 100) * currentTrack.durationMs)
    : 0;

  return (
    <div className="player">
      {/* Info da faixa */}
      <div className="player__track">
        <img src={currentTrack.coverUrl} alt={currentTrack.name} />
        <div>
          <p className="player__track-name">{currentTrack.name}</p>
          <p className="player__track-artist">{currentTrack.artist}</p>
        </div>
      </div>

      {/* Controles centrais */}
      <div className="player__center">
        <div className="player__controls">
          <button onClick={prev} aria-label="Anterior">⏮</button>
          <button onClick={togglePlay} className="player__play" aria-label={isPlaying ? "Pausar" : "Tocar"}>
            {isPlaying ? "⏸" : "▶"}
          </button>
          <button onClick={next} aria-label="Próxima">⏭</button>
        </div>
        <div className="player__progress">
          <span>{formatDuration(elapsed)}</span>
          <div className="player__bar">
            <div className="player__bar-fill" style={{ width: `${progress}%` }} />
          </div>
          <span>{formatDuration(currentTrack.durationMs)}</span>
        </div>
      </div>

      {/* Volume */}
      <div className="player__volume">
        <span>🔊</span>
        <input
          type="range"
          min={0}
          max={100}
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          aria-label="Volume"
        />
      </div>
    </div>
  );
}