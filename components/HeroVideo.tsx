"use client";

import { useLayoutEffect, useRef, useState } from "react";
import GlobalNav from "./GlobalNav";

type NetworkInformation = { saveData?: boolean };

/**
 * §6.1 mobile delivery.
 *
 * The `autoplay` attribute is rendered server-side whenever the Save-Data
 * request header is absent — Chromium shows a persistent "started via
 * script" play-button overlay for any script-initiated `.play()` that
 * wasn't paired with the native `autoplay` attribute, regardless of actual
 * playback state, so this can't be done as JS-only without a visible
 * regression. When the header IS present, the server already knows before
 * ever sending HTML, so `autoplay` is simply omitted — no fetch, no
 * download, poster only, matching "hold at the poster" exactly.
 *
 * `navigator.connection.saveData` (client-only signal, e.g. when the header
 * isn't forwarded by some proxy/CDN) is checked in an effect as a fallback;
 * since SSR couldn't have known it, the best available behavior there is an
 * immediate pause once detected, not prevention from byte zero.
 *
 * The play affordance's visibility is handled imperatively via the `hidden`
 * attribute through a ref rather than React state — this mount-time,
 * one-shot decision doesn't need a re-render to reflect it.
 */
export default function HeroVideo({ saveDataHeader }: { saveDataHeader: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playAffordanceRef = useRef<HTMLButtonElement>(null);
  const [muted, setMuted] = useState(true);

  useLayoutEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    video.preload = isMobile ? "metadata" : "auto";

    if (saveDataHeader) {
      // autoplay was never rendered — nothing has loaded, show the affordance.
      if (playAffordanceRef.current) playAffordanceRef.current.hidden = false;
      return;
    }

    const nav = navigator as Navigator & { connection?: NetworkInformation };
    if (nav.connection?.saveData === true) {
      // autoplay already started this before we could know — stop it now.
      video.pause();
      if (playAffordanceRef.current) playAffordanceRef.current.hidden = false;
    }
  }, [saveDataHeader]);

  const handlePlayAffordanceClick = () => {
    if (playAffordanceRef.current) playAffordanceRef.current.hidden = true;
    videoRef.current?.play().catch(() => {});
  };

  const handleRestart = () => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    video.play().catch(() => {});
  };

  const handlePause = () => {
    videoRef.current?.pause();
  };

  const handleMuteToggle = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    if (!video.muted) video.play().catch(() => {});
    setMuted(video.muted);
  };

  return (
    <section className="hero-video">
      <link rel="preload" as="image" href="/assets/hero-poster.webp" fetchPriority="high" type="image/webp" />
      <video
        ref={videoRef}
        id="heroVideo"
        autoPlay={!saveDataHeader}
        muted
        playsInline
        poster="/assets/hero-poster.webp"
      >
        <source media="(max-width: 767px)" src="/assets/hero-video-mobile.mp4" type="video/mp4" />
        <source src="/assets/hero-video.mp4" type="video/mp4" />
      </video>

      <button
        ref={playAffordanceRef}
        type="button"
        className="hero-play-affordance"
        aria-label="Play video"
        onClick={handlePlayAffordanceClick}
        hidden
      >
        ▶
      </button>

      <GlobalNav activePath="/" overlay />

      <div className="hero-controls">
        <button className="hero-ctrl-btn" id="heroRestartBtn" aria-label="Restart video" onClick={handleRestart}>
          ↻
        </button>
        <button className="hero-ctrl-btn" id="heroPauseBtn" aria-label="Pause video" onClick={handlePause}>
          ⏸
        </button>
        <button
          className="hero-ctrl-btn"
          id="heroMuteToggle"
          aria-label={muted ? "Unmute video" : "Mute video"}
          aria-pressed={!muted}
          onClick={handleMuteToggle}
        >
          <span className="icon-muted">🔇</span>
          <span className="icon-unmuted">🔊</span>
        </button>
      </div>

      <div className="hero-scroll">
        <span>SCROLL</span>
        <span className="bar"></span>
      </div>
    </section>
  );
}
