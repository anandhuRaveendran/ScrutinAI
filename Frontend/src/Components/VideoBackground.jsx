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

    const hlsUrlAbsolute = new URL(hlsUrl, window.location.href).href;

    // Safari (iOS/mac) supports HLS natively
    const canPlayHlsNatively = video.canPlayType("application/vnd.apple.mpegurl");

    // Helper: try to play muted (autoplay policy)
    const tryPlay = async () => {
      try {
        if (video.paused) {
          await video.play();
          // console.log("[VideoBackground] video.play() succeeded");
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          console.warn("[VideoBackground] autoplay blocked:", err);
        }
      }
    };

    // 1. Native HLS Support (Safari)
    if (canPlayHlsNatively) {
      // Avoid resetting src if it hasn't changed (prevents AbortError in Strict Mode)
      if (video.src !== hlsUrlAbsolute) {
        console.log("[VideoBackground] native HLS support detected (Safari). Setting src to HLS URL.");
        video.src = hlsUrl;
        video.load();
      }
      tryPlay();

      return () => {
        // No specific cleanup needed for native src, but we can pause to be safe
        // video.pause();
      };
    }

    // 2. HLS.js Support (Chrome, Firefox, Edge)
    let hls = null;
    if (Hls.isSupported()) {
      hls = new Hls({
        maxBufferLength: 30,
        debug: false,
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data && data.fatal) {
          console.warn("[VideoBackground] fatal error from hls.js — destroying and falling back to MP4");
          try {
            hls.destroy();
          } catch (e) { }
          setUsingFallback(true);
          video.src = TEST_MP4;
          tryPlay();
        }
      });

      hls.attachMedia(video);
      hls.on(Hls.Events.MEDIA_ATTACHED, () => {
        hls.loadSource(hlsUrl);
      });

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        tryPlay();
      });

      // Cleanup function specifically for HLS.js instance
      return () => {
        if (hls) {
          hls.destroy();
        }
      };
    }

    // 3. Last fallback (direct src)
    console.warn("[VideoBackground] hls.js not supported and not native HLS. Setting src directly to", hlsUrl);
    video.src = hlsUrl;
    tryPlay();

    return () => { }; // No-op cleanup
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
