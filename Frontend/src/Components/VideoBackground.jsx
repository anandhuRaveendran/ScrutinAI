// src/components/VideoBackground.jsx
import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";

const DEFAULT_HLS =
  "https://stream.mux.com/mvM00pUd4l1cmigEg00MKnt8sYt49RfLRtJXwbDEfIi1Y.m3u8";

const TEST_MP4 =
  "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"; // quick test file

const VideoBackground = ({
  hlsUrl = DEFAULT_HLS,
  poster = "https://image.mux.com/mvM00pUd4l1cmigEg00MKnt8sYt49RfLRtJXwbDEfIi1Y/thumbnail.webp",
  className = "fixed inset-0 w-full h-full object-cover -z-20",
}) => {
  const videoRef = useRef(null);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // If user prefers reduced motion or data saver, skip autoplay
    const prefersReducedMotion =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const saveData =
      navigator.connection && navigator.connection.saveData === true;

    if (prefersReducedMotion || saveData) {
      console.log("[VideoBackground] reduced motion / save-data enabled — skipping video");
      return;
    }

    // Safari (iOS/mac) supports HLS natively
    const canPlayHlsNatively = video.canPlayType("application/vnd.apple.mpegurl");

    // Helper: try to play muted (autoplay policy)
    const tryPlay = async () => {
      try {
        await video.play();
        console.log("[VideoBackground] video.play() succeeded");
      } catch (err) {
        console.warn("[VideoBackground] autoplay blocked:", err);
      }
    };

    if (canPlayHlsNatively) {
      console.log("[VideoBackground] native HLS support detected (Safari). Setting src to HLS URL.");
      video.src = hlsUrl;
      tryPlay();
      return;
    }

    // Use hls.js for other browsers
    if (Hls.isSupported()) {
      const hls = new Hls({
        // optional tuning
        maxBufferLength: 30,
        debug: false,
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error("[VideoBackground] hls.js error", event, data);
        // on fatal error, fallback to test MP4/preset poster
        if (data && data.fatal) {
          console.warn("[VideoBackground] fatal error from hls.js — destroying and falling back to MP4");
          try {
            hls.destroy();
          } catch (e) {}
          setUsingFallback(true);
          video.src = TEST_MP4;
          tryPlay();
        }
      });

      hls.attachMedia(video);
      hls.on(Hls.Events.MEDIA_ATTACHED, () => {
        console.log("[VideoBackground] MEDIA_ATTACHED -> loading source:", hlsUrl);
        hls.loadSource(hlsUrl);
      });

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        console.log("[VideoBackground] MANIFEST_PARSED -> starting playback (muted)");
        tryPlay();
      });

      // Clean up
      return () => {
        try {
          hls.destroy();
        } catch (e) {}
      };
    }

    // Last fallback: set the video src directly to the HLS URL (likely won't play)
    console.warn("[VideoBackground] hls.js not supported and not native HLS. Setting src directly to", hlsUrl);
    video.src = hlsUrl;
    tryPlay();
  }, [hlsUrl]);

  // Add event listeners for debugging
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const onError = (e) => console.error("[VideoBackground] video error event:", e);
    const onLoadedMeta = () => console.log("[VideoBackground] loadedmetadata");
    const onPlaying = () => console.log("[VideoBackground] playing");

    v.addEventListener("error", onError);
    v.addEventListener("loadedmetadata", onLoadedMeta);
    v.addEventListener("playing", onPlaying);

    return () => {
      v.removeEventListener("error", onError);
      v.removeEventListener("loadedmetadata", onLoadedMeta);
      v.removeEventListener("playing", onPlaying);
    };
  }, []);

  return (
    <>
      <video
        ref={videoRef}
        className={className}
        poster={poster}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
      />
      {/* small visible hint if fallback used */}
      {usingFallback && (
        <div className="pointer-events-none fixed inset-0 z-[3] flex items-start justify-end p-4 text-xs text-white/70">
          Video fallback active (MP4 test)
        </div>
      )}
    </>
  );
};

export default VideoBackground;
