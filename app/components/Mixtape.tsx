"use client";

import { useEffect, useRef, useState } from "react";
import { MOODS, PLAYLIST_URL, type Song } from "../songs";

/* ---------- YouTube player API (https://developers.google.com/youtube/iframe_api_reference) ---------- */
type YTPlayer = {
  loadVideoById: (o: { videoId: string; startSeconds?: number }) => void;
  cueVideoById: (o: { videoId: string; startSeconds?: number }) => void;
  playVideo: () => void;
  pauseVideo: () => void;
  stopVideo: () => void;
  getPlayerState: () => number;
};
type YTNamespace = {
  Player: new (el: HTMLElement, opts: {
    videoId: string; width?: string; height?: string;
    playerVars?: Record<string, number | string>;
    events?: {
      onReady?: () => void;
      onStateChange?: (e: { data: number }) => void;
      onError?: (e: { data: number }) => void;
    };
  }) => YTPlayer;
};
declare global {
  interface Window { YT?: YTNamespace; onYouTubeIframeAPIReady?: () => void }
}
// YouTube player states
const ENDED = 0, PLAYING = 1, BUFFERING = 3;

/* ---------- doodles ---------- */
const FLOWERS = [
  `<g fill="#e11d2a">${[0, 60, 120].map(r => `<rect x="-11" y="-46" width="22" height="92" rx="11" transform="rotate(${r})"/>`).join("")}</g>
   <g fill="#ff7bb0">${[[0, -30], [0, 30], [26, -15], [-26, 15], [26, 15], [-26, -15], [0, 0], [8, -40], [-8, 40], [10, 8]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3.6"/>`).join("")}</g>`,
  `<g fill="#e5161f">${[...Array(9)].map((_, i) => `<ellipse cx="0" cy="-27" rx="15" ry="20" transform="rotate(${i * 40})"/>`).join("")}<circle r="22"/></g>
   <ellipse rx="11" ry="8" fill="#fff"/><circle r="5" fill="#d0158a"/><circle r="2.2" fill="#2a0a1a"/>`,
  `<polygon fill="#e3141c" points="${[...Array(24)].map((_, i) => { const a = i * Math.PI / 12, r = i % 2 ? 18 : (i % 4 ? 40 : 48); return (Math.sin(a) * r).toFixed(1) + "," + (-Math.cos(a) * r).toFixed(1); }).join(" ")}"/>`,
  `<g fill="#e61fb4">${[...Array(8)].map((_, i) => `<path d="M0 -6 C 9 -20, 6 -38, 0 -46 C -6 -38, -9 -20, 0 -6Z" transform="rotate(${i * 45})"/>`).join("")}<circle r="11"/></g>
   <circle r="7" fill="none" stroke="#ffd0f0" stroke-width="2"/>`,
  `<polygon fill="#c9a6e8" stroke="#f6eefc" stroke-width="3" stroke-linejoin="round" points="${[...Array(20)].map((_, i) => { const a = i * Math.PI / 10, r = i % 2 ? 20 : (i % 4 ? 36 : 46); return (Math.sin(a) * r).toFixed(1) + "," + (-Math.cos(a) * r).toFixed(1); }).join(" ")}"/>
   <path d="M-4 -10 L2 -12 L-2 8 M-6 8 L6 8" stroke="#f6eefc" stroke-width="3" fill="none" stroke-linecap="round"/>`,
];
const ROSE = `<svg viewBox="-50 -50 100 100"><g fill="#f0558a">${[...Array(6)].map((_, i) => `<circle cx="0" cy="-24" r="20" transform="rotate(${i * 60})"/>`).join("")}</g><circle r="20" fill="#c7224f"/><path d="M-9 0 a9 9 0 1 1 9 9" fill="none" stroke="#ffb4cb" stroke-width="5"/><g fill="#3f7a3a"><ellipse cx="34" cy="30" rx="10" ry="5" transform="rotate(40 34 30)"/></g></svg>`;
const STICKERS: [number, number][] = [[50, 22], [76, 38], [74, 68], [46, 80], [24, 62], [26, 34], [60, 52], [40, 50]];

type Pos = [number, number]; // [mood, song]
type Shuffle = "off" | "mood" | "all";
const ORDERS: [Shuffle, string][] = [["off", "In order"], ["mood", "Shuffle this mood"], ["all", "Shuffle everything"]];
const playable = (m: number, s: number) => !!MOODS[m].songs[s].youtube;
function allPlayable(onlyMood?: number): Pos[] {
  const out: Pos[] = [];
  MOODS.forEach((md, m) => md.songs.forEach((_, s) => {
    if ((onlyMood === undefined || onlyMood === m) && playable(m, s)) out.push([m, s]);
  }));
  return out;
}
function shuffled<T>(list: T[]): T[] {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

function SpotifyIcon() {
  return (
    <svg className="sp-icon" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="11" fill="#1ed760" />
      <path d="M6.5 9.2c3.8-1.1 8-.8 11.2 1M7 12.4c3.2-.9 6.6-.6 9.3.9M7.6 15.4c2.6-.7 5.2-.5 7.4.7" fill="none" stroke="#111" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function pairs(song: Song): [string, string][] {
  if (song.words.length) return song.words;
  const parts = song.title.split(" ");
  if (parts.length === 1) { // one word: split it around the flower, e.g. "ambar" / "sariya"
    const w = parts[0], cut = Math.ceil(w.length / 2);
    return [[w.slice(0, cut), w.slice(cut)]];
  }
  const cut = Math.ceil(parts.length / 2);
  return [[parts.slice(0, cut).join(" "), parts.slice(cut).join(" ")]];
}

export default function Mixtape() {
  const [moodIdx, setMoodIdx] = useState(0);
  const [songIdx, setSongIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [pairIdx, setPairIdx] = useState(0);
  const [ready, setReady] = useState(false);

  const [failed, setFailed] = useState(false);
  // Safari and iPhones won't let our buttons start a YouTube video until the
  // listener taps the video itself once. When that happens we show the video
  // in the screen with a "tap to start" hint.
  const [needsTap, setNeedsTap] = useState(false);
  const tapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const checkStarted = () => {
    if (tapTimer.current) clearTimeout(tapTimer.current);
    tapTimer.current = setTimeout(() => {
      const st = playerRef.current?.getPlayerState();
      if (st !== PLAYING && st !== BUFFERING) setNeedsTap(true);
    }, 2500);
  };

  const mood = MOODS[moodIdx];
  const song = mood.songs[songIdx];
  const videoId = song.youtube;
  const startAt = song.start ?? 0;

  const hostRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const loadedId = useRef<string | null>(null);
  const wantPlay = useRef(false);
  const nextRef = useRef<() => void>(() => {});

  /* --- play order: in order, shuffle this mood, or shuffle everything --- */
  const [shuffle, setShuffle] = useState<Shuffle>("off");
  const shuffleRef = useRef<Shuffle>("off");
  shuffleRef.current = shuffle;
  const posRef = useRef<Pos>([0, 0]);
  posRef.current = [moodIdx, songIdx];
  const historyRef = useRef<Pos[]>([]); // songs played before, for the back arrow in shuffle
  const queueRef = useRef<Pos[]>([]);   // shuffled songs still to come (no repeats until all have played)

  function nextPos(): Pos | null {
    const [m, s] = posRef.current;
    const mode = shuffleRef.current;
    if (mode === "off") {
      const n = MOODS[m].songs.length;
      for (let k = 1; k <= n; k++) { const t = (s + k) % n; if (playable(m, t)) return [m, t]; }
      return null;
    }
    const notCurrent = ([a, b]: Pos) => !(a === m && b === s);
    let q = queueRef.current.filter(([qm]) => mode === "all" || qm === m).filter(notCurrent);
    if (!q.length) q = shuffled(mode === "all" ? allPlayable() : allPlayable(m)).filter(notCurrent);
    const nx = q.shift() ?? null;
    queueRef.current = q;
    return nx;
  }
  function prevPos(): Pos | null {
    const [m, s] = posRef.current;
    if (shuffleRef.current !== "off" && historyRef.current.length) return historyRef.current.pop()!;
    const n = MOODS[m].songs.length;
    for (let k = 1; k <= n; k++) { const t = (s - k + n) % n; if (playable(m, t)) return [m, t]; }
    return null;
  }
  function moveTo(pos: Pos | null, keepPlaying: boolean) {
    if (!pos) return;
    wantPlay.current = keepPlaying;
    setMoodIdx(pos[0]);
    setSongIdx(pos[1]);
  }
  function next(auto = false) {
    const pos = nextPos();
    if (!pos) return;
    historyRef.current.push(posRef.current);
    moveTo(pos, auto || playing || wantPlay.current);
  }
  function prev() { moveTo(prevPos(), playing || wantPlay.current); }
  function changeShuffle(mode: Shuffle) { setShuffle(mode); queueRef.current = []; }

  // the player calls these from outside React, so keep them fresh in refs
  nextRef.current = () => next(true);
  const keysRef = useRef({ next: () => {}, prev: () => {} });
  keysRef.current = { next: () => next(), prev };

  /* --- load YouTube's player API once --- */
  useEffect(() => {
    const create = () => {
      if (playerRef.current || !hostRef.current || !window.YT) return;
      const el = document.createElement("div");
      hostRef.current.appendChild(el);
      const firstSong = MOODS[0].songs.find(s => s.youtube);
      const first = firstSong?.youtube ?? "";
      loadedId.current = first;
      playerRef.current = new window.YT.Player(el, {
        videoId: first, width: "100%", height: "100%",
        playerVars: { playsinline: 1, rel: 0, modestbranding: 1, start: firstSong?.start ?? 0 },
        events: {
          onReady: () => setReady(true),
          onStateChange: (e) => {
            if (e.data === PLAYING) { setPlaying(true); setFailed(false); setNeedsTap(false); if (tapTimer.current) clearTimeout(tapTimer.current); }
            else if (e.data === ENDED) { setPlaying(false); nextRef.current(); }
            else if (e.data === 2) setPlaying(false); // paused
          },
          onError: () => { setPlaying(false); setFailed(true); },
        },
      });
    };
    if (window.YT?.Player) { create(); return; }
    window.onYouTubeIframeAPIReady = create;
    if (!document.getElementById("youtube-iframe-api")) {
      const s = document.createElement("script");
      s.id = "youtube-iframe-api";
      s.src = "https://www.youtube.com/iframe_api";
      s.async = true;
      document.body.appendChild(s);
    }
  }, []);

  /* --- whenever the song changes, put it in the player --- */
  useEffect(() => {
    setPairIdx(0);
    setFailed(false);
    const pl = playerRef.current;
    if (!pl || !ready) return;
    if (!videoId) { pl.stopVideo(); setPlaying(false); wantPlay.current = false; return; }
    if (loadedId.current === videoId) {
      if (wantPlay.current) { wantPlay.current = false; pl.playVideo(); checkStarted(); }
      return;
    }
    loadedId.current = videoId;
    if (wantPlay.current) { wantPlay.current = false; pl.loadVideoById({ videoId, startSeconds: startAt }); checkStarted(); }
    else pl.cueVideoById({ videoId, startSeconds: startAt });
  }, [videoId, ready]);

  /* --- cycle the words on the screen while music plays --- */
  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => setPairIdx(i => i + 1), 1700);
    return () => clearInterval(t);
  }, [playing]);

  /* --- phones: a photo screen first, then the player (no scroll tricks) --- */
  // "intro" = just the photo; "player" = iPod + songs, normal scrolling.
  const [view, setView] = useState<"intro" | "player">("intro");
  const [isPhone, setIsPhone] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 760px)");
    const update = () => setIsPhone(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  const showPlayer = () => { window.scrollTo(0, 0); setView("player"); };
  const showPhoto = () => { window.scrollTo(0, 0); setView("intro"); };

  // On the photo screen the page doesn't scroll: a swipe up, wheel or arrow key opens the player.
  useEffect(() => {
    if (!isPhone || view !== "intro") return;
    const root = document.documentElement;
    root.style.overflow = "hidden";
    let startY: number | null = null;
    const onTouchStart = (e: TouchEvent) => { startY = e.touches[0].clientY; };
    const onTouchMove = (e: TouchEvent) => {
      if (startY !== null && startY - e.touches[0].clientY > 24) { startY = null; showPlayer(); }
    };
    const onWheel = (e: WheelEvent) => { if (e.deltaY > 4) showPlayer(); };
    const onKey = (e: KeyboardEvent) => { if (["ArrowDown", "PageDown", " "].includes(e.key)) showPlayer(); };
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => {
      root.style.overflow = "";
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
    };
  }, [isPhone, view]);

  // laptops: the iPod and song block slide in once when they come into view
  useEffect(() => {
    const io = new IntersectionObserver(entries => entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add("in");
    }), { threshold: 0.12 });
    document.querySelectorAll(".reveal").forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  /* --- the ☰ mood menu: close on outside click or Escape --- */
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!menuOpen) return;
    const onDown = (e: PointerEvent) => { if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setMenuOpen(false); };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("pointerdown", onDown); document.removeEventListener("keydown", onKey); };
  }, [menuOpen]);

  /* --- mood colour, deep links and keyboard --- */
  useEffect(() => { document.documentElement.style.setProperty("--mood", mood.bg); }, [mood.bg]);
  useEffect(() => {
    const i = MOODS.findIndex(m => "#" + m.id === location.hash);
    if (i >= 0) setMoodIdx(i);
  }, []);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") keysRef.current.next();
      if (e.key === "ArrowLeft") keysRef.current.prev();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  function togglePlay() {
    const pl = playerRef.current;
    if (!videoId || !pl) return;
    if (loadedId.current !== videoId) { loadedId.current = videoId; pl.loadVideoById({ videoId, startSeconds: startAt }); checkStarted(); return; }
    if (pl.getPlayerState() === PLAYING) pl.pauseVideo(); else { pl.playVideo(); checkStarted(); }
  }
  function pickMood(i: number) {
    playerRef.current?.pauseVideo();
    wantPlay.current = false;
    queueRef.current = [];
    setMoodIdx(i); setSongIdx(0);
    try { history.replaceState(null, "", "#" + MOODS[i].id); } catch { /* ignore */ }
  }
  function pickSong(i: number) {
    if (i === songIdx) { togglePlay(); return; }
    historyRef.current.push(posRef.current);
    wantPlay.current = true;
    setSongIdx(i);
  }

  const p = pairs(song), pr = p[pairIdx % p.length];
  const q = encodeURIComponent(song.title + (song.from ? " " + song.from.replace(/,.*$/, "") : ""));

  return (
    <div className={"wrap " + (view === "intro" ? "is-intro" : "is-player")}>
      <header>
        <button className="thumb" onClick={showPhoto} aria-label="See the photo" />
        <h1><button className="title-btn" onClick={() => (isPhone ? showPhoto() : window.scrollTo({ top: 0, behavior: "smooth" }))}>Mixtape for S</button></h1>
        <div className="menu" ref={menuRef}>
          <button className="menu-btn" aria-expanded={menuOpen} aria-controls="mood-menu" onClick={() => setMenuOpen(o => !o)}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
            <span>{mood.name}</span>
          </button>
          {menuOpen && (
            <nav id="mood-menu" className="menu-list" aria-label="Moods">
              {MOODS.map((m, i) => (
                <button key={m.id} aria-current={i === moodIdx ? "true" : undefined}
                  onClick={() => { pickMood(i); setMenuOpen(false); }}>
                  <i style={{ background: m.bg }} aria-hidden="true" />{m.name}
                </button>
              ))}
              <a className="menu-playlist" href={PLAYLIST_URL} target="_blank" rel="noopener" onClick={() => setMenuOpen(false)}>
                <SpotifyIcon />Whole mixtape on Spotify
              </a>
            </nav>
          )}
        </div>
      </header>

      <div className="photo" role="img" aria-label="The two of us on the balcony" />

      {/* phones: the first screen is just the photo, with a nudge to scroll */}
      <div className="intro">
        <button className="scroll-hint" onClick={showPlayer}>
          scroll down
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>
        </button>
      </div>

      <div className="layout">
        <div className="stage reveal">
          <svg className="cables" viewBox="0 0 400 720" aria-hidden="true">
            <g fill="none" stroke="#f4f2ee" strokeWidth="5" strokeLinecap="round">
              <path className="cable-top" d="M150 0 C 170 40, 250 40, 262 105 L262 130" />
              <path d="M40 215 C 20 300, 70 330, 30 420 C 10 470, 40 520, 0 580" />
              <path d="M360 345 C 375 420, 340 470, 360 540 C 375 590, 300 640, 230 690 C 190 715, 150 720, 120 720" />
            </g>
            <rect x="254" y="108" width="16" height="34" rx="3" fill="#f4f2ee" />
            <rect x="257" y="138" width="10" height="10" fill="#bdbdb8" />
            <g transform="translate(46 185) rotate(-8)">
              <ellipse cx="0" cy="0" rx="34" ry="27" fill="#f4f2ee" />
              <ellipse cx="16" cy="0" rx="9" ry="13" fill="#e0ddd6" />
              <ellipse cx="-6" cy="-2" rx="9" ry="4" fill="#2a2a2a" />
              <rect x="-8" y="18" width="13" height="42" rx="6" fill="#f4f2ee" />
              <rect x="-9" y="60" width="15" height="10" rx="2" fill="#e6e3dc" />
            </g>
            <g transform="translate(352 318) rotate(8)">
              <ellipse cx="0" cy="0" rx="34" ry="27" fill="#f4f2ee" />
              <ellipse cx="-16" cy="0" rx="9" ry="13" fill="#e0ddd6" />
              <ellipse cx="6" cy="-2" rx="9" ry="4" fill="#2a2a2a" />
              <rect x="-5" y="18" width="13" height="42" rx="6" fill="#f4f2ee" />
            </g>
          </svg>

          <div className={"ipod" + (playing ? " playing" : "") + (needsTap && !playing ? " needs-tap" : "")}>
            <div className="screen" aria-live="polite">
              <div className="title">{song.words.length ? song.title.toLowerCase() : ""}</div>
              <span className="w wl">{pr[0]}</span>
              <svg className="flower" viewBox="-50 -50 100 100" aria-hidden="true"
                style={{ transform: `rotate(${(pairIdx % 4) * 12 - 12}deg)` }}
                dangerouslySetInnerHTML={{ __html: FLOWERS[(songIdx + pairIdx) % FLOWERS.length] }} />
              <span className="w wr">{pr[1]}</span>
              <div className="meta"><span>{mood.name.toLowerCase()}</span><span>{shuffle !== "off" ? "shuffle · " : ""}{songIdx + 1} of {mood.songs.length}</span></div>
              {(!videoId || failed) && <div className="screen-msg">{failed ? "can’t play this one here" : "not on the tape yet"}</div>}
              {/* the YouTube video plays inside the little screen */}
              <div className="screen-video" ref={hostRef} />
              {needsTap && !playing && <div className="tap-hint">tap the screen to start</div>}
            </div>
            <div className="wheel">
              <div className="disc">
                <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "radial-gradient(circle,transparent 0 22%,rgba(120,160,200,.28) 30% 100%)" }} />
                {STICKERS.map(([x, y], i) => (
                  <div key={i} className="sticker"
                    style={{ left: x + "%", top: y + "%", transform: `rotate(${i * 47}deg) scale(${i > 5 ? 0.7 : 1})` }}
                    dangerouslySetInnerHTML={{ __html: ROSE }} />
                ))}
              </div>
              <button className="prev" aria-label="Previous song" onClick={prev}>
                <svg viewBox="0 0 24 24"><path d="M11 6 3 12l8 6V6zm10 0-8 6 8 6V6z" /></svg>
              </button>
              <button className="play" aria-label={playing ? "Pause" : "Play"} onClick={togglePlay} disabled={!videoId || !ready}>
                <svg viewBox="0 0 24 24">
                  {playing
                    ? <path fill="#eee" d="M6 5h4v14H6zM14 5h4v14h-4z" />
                    : <path fill="#eee" d="M7 4v16l13-8z" />}
                </svg>
              </button>
              <button className="next" aria-label="Next song" onClick={() => next()}>
                <svg viewBox="0 0 24 24"><path d="M13 6v12l8-6-8-6zM3 6v12l8-6-8-6z" /></svg>
              </button>
            </div>
            <a className="tape-spotify" href={song.spotify || "https://open.spotify.com/search/" + q} target="_blank" rel="noopener">
              Open in Spotify
            </a>
          </div>
        </div>

        <section className="panel reveal">
          <div className="order" role="group" aria-label="Play order">
            {ORDERS.map(([mode, label]) => (
              <button key={mode} aria-pressed={shuffle === mode} onClick={() => changeShuffle(mode)}>
                {mode !== "off" && <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16 3h5v5M4 20 21 3M21 16v5h-5M15 15l6 6M4 4l5 5" /></svg>}
                {label}
              </button>
            ))}
          </div>
          <ol className="tracks">
            {mood.songs.map((t, i) => (
              <li key={i + t.title}>
                <button aria-current={i === songIdx ? "true" : undefined} onClick={() => pickSong(i)}>
                  <span>
                    {i === songIdx && playing && <span className="eq" aria-hidden="true"><i /><i /><i /></span>}
                    {t.title}
                  </span>
                  <span>{t.from}</span>
                </button>
              </li>
            ))}
          </ol>
          <a className="playlist-link" href={PLAYLIST_URL} target="_blank" rel="noopener">
            <SpotifyIcon />Listen to the whole mixtape on Spotify
          </a>
        </section>
      </div>
    </div>
  );
}
