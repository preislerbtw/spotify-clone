import React, { useState } from "react";
import { parseSpotifyPlaylistId } from "../../utils/helpers";
import "./PlaylistInput.css";

interface Props {
  onLoad: (playlistId: string) => void;
  loading: boolean;
  error: string | null;
}

export default function PlaylistInput({ onLoad, loading, error }: Props) {
  const [url, setUrl] = useState("");

  function handleSubmit() {
    const id = parseSpotifyPlaylistId(url.trim());
    if (!id) {
      alert("Link inválido. Cole um link de playlist do Spotify.");
      return;
    }
    onLoad(id);
  }

  return (
    <div className="playlist-input">
      <h2>Abrir Playlist</h2>
      <p>Cole o link de uma playlist pública do Spotify</p>
      <div className="playlist-input__row">
        <input
          type="text"
          placeholder="https://open.spotify.com/playlist/..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          disabled={loading}
        />
        <button onClick={handleSubmit} disabled={loading || !url}>
          {loading ? "Carregando..." : "Carregar"}
        </button>
      </div>
      {error && <p className="playlist-input__error">{error}</p>}
    </div>
  );
}