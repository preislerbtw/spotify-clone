const YT_API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY!;

export async function searchYouTubeVideo(
  trackName: string,
  artist: string
): Promise<string | null> {
  const query = encodeURIComponent(`${trackName} ${artist} official audio`);

  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&maxResults=1&key=${YT_API_KEY}`
  );

  if (!res.ok) return null;

  const data = await res.json();
  return data.items?.[0]?.id?.videoId || null;
}