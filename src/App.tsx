import React, { useState } from "react";
import { PlayerProvider } from "./context/PlayerContext";
import PlaylistInput from "./components/PlaylistInput/PlaylistInput";
import TrackList from "./components/TrackList/TrackList";
import Player from "./components/Player/Player";
import YouTubeBridge from "./components/Player/YouTubeBridge";
import { fetchPlaylist } from "./api/spotify";
import { Playlist } from "./types";
import "./App.css";

export default function App() {
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLoad(playlistId: string) {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchPlaylist(playlistId);
      setPlaylist(data);
    } catch (e: any) {
      setError(e.message || "Erro ao carregar playlist.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <PlayerProvider>
      <div className="app">
        <main className="app__main">
          {!playlist ? (
            <div className="app__welcome">
              <div className="app__logo">♫</div>
              <h1>Spotifree</h1>
              <p>Toque qualquer playlist do Spotify, de graça, sem anúncios.</p>
              <PlaylistInput onLoad={handleLoad} loading={loading} error={error} />
            </div>
          ) : (
            <>
              <button
                className="app__back"
                onClick={() => setPlaylist(null)}
              >
                ← Voltar
              </button>
              <TrackList
                tracks={playlist.tracks}
                playlistName={playlist.name}
                coverUrl={playlist.coverUrl}
              />
            </>
          )}
        </main>

        <Player />
        <YouTubeBridge />
      </div>
    </PlayerProvider>
  );
}