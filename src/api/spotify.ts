import { Track, Playlist } from "../types";

const CLIENT_ID = process.env.REACT_APP_SPOTIFY_CLIENT_ID!;
const CLIENT_SECRET = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET!;

let accessToken: string | null = null;

async function getAccessToken(): Promise<string> {
  if (accessToken) return accessToken;

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: "Basic " + btoa(`${CLIENT_ID}:${CLIENT_SECRET}`),
    },
    body: "grant_type=client_credentials",
  });

  const data = await response.json();
  accessToken = data.access_token;

  // Limpa o token depois que expirar
  setTimeout(() => { accessToken = null; }, data.expires_in * 1000);

  return accessToken!;
}

export async function fetchPlaylist(playlistId: string): Promise<Playlist> {
  const token = await getAccessToken();

  const res = await fetch(
    `https://api.spotify.com/v1/playlists/${playlistId}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  if (!res.ok) throw new Error("Playlist não encontrada ou privada.");

  const data = await res.json();

  const tracks: Track[] = data.tracks.items
    .filter((item: any) => item.track)
    .map((item: any) => ({
      id: item.track.id,
      name: item.track.name,
      artist: item.track.artists.map((a: any) => a.name).join(", "),
      album: item.track.album.name,
      coverUrl: item.track.album.images[0]?.url || "",
      durationMs: item.track.duration_ms,
    }));

  return {
    id: data.id,
    name: data.name,
    coverUrl: data.images[0]?.url || "",
    tracks,
  };
}