/* ---------- API data na thakle eta dekhabe (demo design) ---------- */
const defaults = {
  youtubeUrl: "",
  channelUrl: "",
  kicker: "Our Story",
  title: "See our work in action",
  text: "A short film about the people we serve, the programmes we run and the change we are building together with the community.",
  points: [
    "Real stories from the families we support",
    "A look at our ongoing community projects",
    "How volunteers and donors make a difference",
  ],
};

// Works with watch?v=, youtu.be/, /embed/, /shorts/ and /live/ links
function getYouTubeId(url = "") {
  const m = String(url).match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/))([\w-]{11})/,
  );
  return m ? m[1] : "";
}

/* ---------- API ---------- */
async function getStoryVideo() {
  const headers = {
    "x-api-key": process.env.API_KEY,
    "office-id": process.env.OFFICE,
  };

  try {
    const res = await fetch(`${process.env.BACKLINK}/public/story_video`, {
      headers,
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data || null;
  } catch (error) {
    console.error("[story-video] error:", error.message);
    return null;
  }
}

const videoCss = `
.vu-video {
  --v-accent: #674d80;
  --v-peach: #ded6e6;
  --v-line: rgba(103, 77, 128, 0.22);
  --v-ease: cubic-bezier(0.22, 0.61, 0.36, 1);
  padding: 72px 20px 96px;
  color: #1a1a1a;
  background: linear-gradient(180deg, #f7f5f9 0%, #ede9f2 100%);
}
.vu-video__inner {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 64px;
  align-items: center;
}
.vu-video__content { max-width: 460px; }

.vu-video__frame {
  position: relative;
  padding: 8px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid var(--v-line);
  box-shadow: 0 22px 44px -28px rgba(103, 77, 128, 0.6);
  transition: transform 0.4s var(--v-ease), box-shadow 0.4s var(--v-ease);
}
.vu-video__frame:hover {
  transform: translateY(-4px);
  box-shadow: 0 28px 50px -26px rgba(103, 77, 128, 0.7);
}
.vu-video__ratio {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: 14px;
  overflow: hidden;
  background: #e6dfec;
}
.vu-video__ratio iframe {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: 0;
}

.vu-video__demo {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  background:
    radial-gradient(circle at 20% 25%, rgba(255, 255, 255, 0.7), transparent 45%),
    radial-gradient(circle at 85% 80%, rgba(103, 77, 128, 0.25), transparent 50%),
    linear-gradient(135deg, #e8e2ee 0%, #d3c9de 100%);
}
.vu-video__demo::before,
.vu-video__demo::after {
  content: "";
  position: absolute;
  border-radius: 50%;
  border: 1px solid rgba(103, 77, 128, 0.25);
}
.vu-video__demo::before { width: 55%; aspect-ratio: 1; }
.vu-video__demo::after  { width: 80%; aspect-ratio: 1; opacity: 0.6; }

.vu-video__play {
  position: relative;
  z-index: 1;
  width: 72px;
  height: 72px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 0 0 10px rgba(255, 255, 255, 0.45), 0 14px 26px -10px rgba(103, 77, 128, 0.7);
  transition: transform 0.35s var(--v-ease), box-shadow 0.35s var(--v-ease);
}
.vu-video__play::before {
  content: "";
  margin-left: 5px;
  border-style: solid;
  border-width: 11px 0 11px 18px;
  border-color: transparent transparent transparent var(--v-accent);
}
.vu-video__frame:hover .vu-video__play {
  transform: scale(1.1);
  box-shadow: 0 0 0 16px rgba(255, 255, 255, 0.4), 0 18px 30px -10px rgba(103, 77, 128, 0.8);
}

.vu-video__chip {
  position: absolute;
  z-index: 1;
  padding: 5px 11px;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: #1a1a1a;
  background: rgba(255, 255, 255, 0.88);
  border-radius: 999px;
}
.vu-video__chip--tl { top: 12px; left: 12px; }
.vu-video__chip--br { bottom: 12px; right: 12px; }

.vu-video__demo-note {
  position: absolute;
  z-index: 1;
  bottom: 12px;
  left: 12px;
  font-size: 0.72rem;
  color: #352c3e;
}

.vu-video__kicker {
  display: inline-block;
  padding: 4px 12px;
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #1a1a1a;
  background: var(--v-peach);
  border-radius: 999px;
}
.vu-video__title {
  margin: 14px 0 10px;
  font-size: 1.7rem;
  line-height: 1.2;
  font-weight: 700;
  color: #111;
}
.vu-video__text {
  margin: 0 0 16px;
  font-size: 0.92rem;
  line-height: 1.7;
  color: #3b3b3b;
}
.vu-video__points {
  list-style: none;
  margin: 0 0 22px;
  padding: 0;
  display: grid;
  gap: 8px;
}
.vu-video__points li {
  position: relative;
  padding-left: 22px;
  font-size: 0.88rem;
  color: #2b2b2b;
  transition: transform 0.3s var(--v-ease);
}
.vu-video__points li::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0.45em;
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: var(--v-peach);
  border: 2px solid var(--v-accent);
}
.vu-video__points li:hover { transform: translateX(4px); }

.vu-video__actions { display: flex; flex-wrap: wrap; gap: 10px; }
.vu-video__btn {
  display: inline-flex;
  align-items: center;
  padding: 9px 18px;
  font-size: 0.82rem;
  font-weight: 600;
  color: #111;
  text-decoration: none;
  border-radius: 10px;
  transition: transform 0.3s var(--v-ease), box-shadow 0.3s var(--v-ease), background 0.3s;
}
.vu-video__btn--solid { background: #d3c9de; border: 1px solid rgba(103, 77, 128, 0.35); }
.vu-video__btn--solid:hover {
  transform: translateY(-2px);
  background: #cdbdde;
  box-shadow: 0 10px 18px -12px rgba(103, 77, 128, 0.8);
}
.vu-video__btn--outline { background: rgba(255, 255, 255, 0.6); border: 1px solid var(--v-line); }
.vu-video__btn--outline:hover {
  transform: translateY(-2px);
  background: #fff;
  border-color: var(--v-accent);
}

@media (max-width: 900px) {
  .vu-video { padding: 52px 20px 64px; }
  .vu-video__inner { grid-template-columns: 1fr; gap: 32px; }
  .vu-video__content { max-width: none; }
}
@media (max-width: 480px) {
  .vu-video__title { font-size: 1.4rem; }
  .vu-video__play { width: 58px; height: 58px; }
}
@media (prefers-reduced-motion: reduce) {
  .vu-video * { transition: none !important; }
}
`;

/* ---------- COMPONENT ---------- */
export default async function StoryVideoSection() {
  const api = await getStoryVideo();

  const story = {
    youtubeUrl: api?.youtube_url || defaults.youtubeUrl,
    channelUrl: api?.channel_url || defaults.channelUrl,
    kicker: api?.kicker || defaults.kicker,
    title: api?.title || defaults.title,
    text: api?.text || defaults.text,
    points: api?.points?.length ? api.points : api ? [] : defaults.points,
  };

  const videoId = getYouTubeId(story.youtubeUrl);

  // Channel URL thakle oikhane (new tab), na thakle site er /videos page e
  const hasChannel = Boolean(story.channelUrl);
  const moreHref = hasChannel ? story.channelUrl : "/videos";

  return (
    <section className="vu-video" aria-labelledby="video-title">
      <style dangerouslySetInnerHTML={{ __html: videoCss }} />
      <div className="vu-video__inner">
        <div className="vu-video__frame">
          <div className="vu-video__ratio">
            {videoId ? (
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`}
                title={story.title}
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            ) : (
              <div
                className="vu-video__demo"
                role="img"
                aria-label="Video placeholder"
              >
                <span className="vu-video__chip vu-video__chip--tl">
                  {story.kicker}
                </span>
                <span className="vu-video__play" />
                <span className="vu-video__chip vu-video__chip--br">03:24</span>
                <span className="vu-video__demo-note">
                  Demo preview. Your YouTube video will appear here.
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="vu-video__content">
          <span className="vu-video__kicker">{story.kicker}</span>
          <h2 id="video-title" className="vu-video__title">
            {story.title}
          </h2>
          {story.text && <p className="vu-video__text">{story.text}</p>}
          {story.points.length > 0 && (
            <ul className="vu-video__points">
              {story.points.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
          )}
          <div className="vu-video__actions">
            <a
              href={moreHref}
              className="vu-video__btn vu-video__btn--solid"
              {...(hasChannel
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
            >
              Watch More Videos
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
