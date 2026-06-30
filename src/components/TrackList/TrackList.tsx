import React from "react";
import { Track } from "../../types";
import { formatDuration } from "../../utils/helpers";
import { usePlayerContext } from "../../context/PlayerContext";
import "./TrackList.css";

interface Props {
  tracks: Track[];
  playlistName: string;
  coverUrl: string;
}

export default function TrackList({ tracks, playlistName, coverUrl }: Props) {
  const { playTrack, currentTrack, isPlaying } = usePlayerContext();

  return (
    <div className="tracklist">
      <div className="tracklist__header">
        <img src={coverUrl} alt={playlistName} className="tracklist__cover" />
        <div className="tracklist__meta">
          <span className="tracklist__label">PLAYLIST</span>
          <h1>{playlistName}</h1>
          <p>{tracks.length} músicas</p>
        </div>
      </div>

      <div className="tracklist__list">
        <div className="tracklist__columns">
          <span>#</span>
          <span>Título</span>
          <span>Álbum</span>
          <span>Duração</span>
        </div>

        {tracks.map((track, i) => {
          const isActive = currentTrack?.id === track.id;
          return (
            <div
              key={track.id}
              className={`tracklist__row ${isActive ? "tracklist__row--active" : ""}`}
              onDoubleClick={() => playTrack(track, tracks)}
            >
              <span className="tracklist__num">
                {isActive && isPlaying ? (
                  <span className="tracklist__bars">▶</span>
                ) : (
                  i + 1
                )}
              </span>
              <div className="tracklist__info">
                <img src={track.coverUrl} alt={track.name} />
                <div>
                  <p className="tracklist__name">{track.name}</p>
                  <p className="tracklist__artist">{track.artist}</p>
                </div>
              </div>
              <span className="tracklist__album">{track.album}</span>
              <span className="tracklist__duration">{formatDuration(track.durationMs)}</span>
              <button
                className="tracklist__play-btn"
                onClick={() => playTrack(track, tracks)}
                aria-label={`Tocar ${track.name}`}
              >
                ▶
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}