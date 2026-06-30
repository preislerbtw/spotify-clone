import { useEffect, useRef } from "react";
import { usePlayerContext } from "../../context/PlayerContext";
import { searchYouTubeVideo } from "../../api/youtube";
import { getCachedYoutubeId, setCachedYoutubeId } from "../../utils/helpers";

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export default function YouTubeBridge() {
  const { currentTrack, isPlaying, volume, next, setProgress, setIsPlaying } = usePlayerContext();
  const playerRef = useRef<any>(null);
  const intervalRef = useRef<any>(null);
  const readyRef = useRef(false);

  // Carrega a API do YouTube uma vez
  useEffect(() => {
    if (document.getElementById("yt-api-script")) return;
    const tag = document.createElement("script");
    tag.id = "yt-api-script";
    tag.src = "https://www.youtube.com/iframe_api";
    document.body.appendChild(tag);

    window.onYouTubeIframeAPIReady = () => {
      readyRef.current = true;
    };
  }, []);

  // Quando a faixa muda, busca o videoId e carrega no player
  useEffect(() => {
    if (!currentTrack) return;

    async function loadVideo() {
      const track = currentTrack!;
      let videoId = track.youtubeId || getCachedYoutubeId(track.id);

      if (!videoId) {
        videoId = await searchYouTubeVideo(track.name, track.artist);
        if (videoId) setCachedYoutubeId(track.id, videoId);
      }

      if (!videoId) {
        console.warn("Vídeo não encontrado para:", track.name);
        next();
        return;
      }

      const initPlayer = () => {
        if (playerRef.current) {
          playerRef.current.loadVideoById(videoId);
        } else {
          playerRef.current = new window.YT.Player("yt-bridge", {
            videoId,
            playerVars: { autoplay: 1, controls: 0 },
            events: {
              onStateChange: (e: any) => {
                // 0 = ended
                if (e.data === 0) next();
                // 1 = playing, 2 = paused
                if (e.data === 1) setIsPlaying(true);
                if (e.data === 2) setIsPlaying(false);
              },
            },
          });
        }
      };

      if (window.YT && window.YT.Player) {
        initPlayer();
      } else {
        const original = window.onYouTubeIframeAPIReady;
        window.onYouTubeIframeAPIReady = () => {
          original?.();
          initPlayer();
        };
      }
    }

    loadVideo();
  }, [currentTrack?.id]);

  // Sincroniza play/pause
  useEffect(() => {
    if (!playerRef.current) return;
    if (isPlaying) playerRef.current.playVideo?.();
    else playerRef.current.pauseVideo?.();
  }, [isPlaying]);

  // Sincroniza volume
  useEffect(() => {
    playerRef.current?.setVolume?.(volume);
  }, [volume]);

  // Atualiza progresso a cada segundo
  useEffect(() => {
    clearInterval(intervalRef.current);
    if (!isPlaying) return;
    intervalRef.current = setInterval(() => {
      if (!playerRef.current) return;
      const current = playerRef.current.getCurrentTime?.() || 0;
      const total = playerRef.current.getDuration?.() || 1;
      setProgress((current / total) * 100);
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [isPlaying]);

  return (
    <div style={{ position: "fixed", bottom: -9999, left: -9999, width: 1, height: 1, overflow: "hidden" }}>
      <div id="yt-bridge" />
    </div>
  );
}