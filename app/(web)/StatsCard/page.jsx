
import StatsCardGrid, { ImpactCards } from "../components/StatsCardGrid";
import FounderSection from "../components/FounderSection";


// Replace these with your real figures
const impactItems = [
  {
    label: "Families Supported",
    value: 1200,
    text: "Households reached through welfare schemes and village support programs.",
  },
  {
    label: "Projects Completed",
    value: 70,
    text: "Roads, water, sanitation and community works delivered for the village.",
  },
  {
    label: "Services Delivered",
    value: 3200,
    text: "Certificates, applications and citizen requests handled by the office.",
  },
];

/* ============ NGO VIDEO: paste your YouTube link here later ============ */
const ngoVideo = {
  youtubeUrl: "", // e.g. "https://www.youtube.com/watch?v=XXXXXXXXXXX" (leave empty to show the demo design)
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
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/))([\w-]{11})/
  );
  return m ? m[1] : "";
}

async function getCountData() {
  try {
    const officeResponse = await fetch(`${process.env.BACKLINK}/public/officeData`, {
      headers: {
        "x-api-key": process.env.API_KEY,
        "office-id": process.env.OFFICE,
      },
      next: {
        revalidate: 1000,
      },
    });
    if (!officeResponse.ok) {
      return [];
    }

    const officeData = await officeResponse.json();
    const isActive = officeData.data?.enabled_services?.includes("counter");

    if (!isActive) return [];

    const res = await fetch(`${process.env.BACKLINK}/public/counter`, {
      headers: {
        "x-api-key": process.env.API_KEY,
        "office-id": process.env.OFFICE,
      },
      next: {
        revalidate: 1000,
      },
    });

    if (!res.ok) {
      console.error(`Failed to fetch notice data: ${res.statusText}`);
      return [];
    }

    const payload = await res.json();
    return Array.isArray(payload?.data?.counter) ? payload.data.counter : [];
  } catch (error) {
    console.error("Error:", error.message);
    return [];
  }
}





/* ============ WHAT WE DO ============ */
const workDetails = [
  {
    title: "Welfare Schemes",
    text: "Helping families access government benefits, pensions and support programs.",
  },
  {
    title: "Water & Sanitation",
    text: "Clean drinking water, drainage and sanitation works for every ward.",
  },
  {
    title: "Roads & Infrastructure",
    text: "Building and maintaining village roads, lighting and public spaces.",
  },
  {
    title: "Education & Health",
    text: "Supporting schools, health camps and awareness drives in the community.",
  },
];

/* ============ ABOUT / MISSION / VISION ============ */
const ngoAbout = {
  image: "/about.png",
  kicker: "About Us",
  title: "Working together for a stronger village",
  paragraphs: [
    "We are a community-driven office dedicated to serving the people of our village with transparency and care.",
    "From certificates to infrastructure, our team works every day to make public services simple and accessible.",
  ],
  facts: [
    { value: "25+", label: "Years of service" },
    { value: "1200+", label: "Families supported" },
    { value: "70+", label: "Projects completed" },
  ],
  mission: {
    title: "Our Mission",
    text: "To deliver fast, fair and transparent services that improve everyday life for every resident.",
  },
  vision: {
    title: "Our Vision",
    text: "A self-reliant, clean and prosperous village where every family has opportunity.",
  },
  values: {
    title: "Our Values",
    items: ["Transparency", "Integrity", "Inclusion", "Service first"],
  },
};

const aboutCss = `
.vu-work {
  padding: 72px 20px;
  background: #fff;
}
.vu-work__inner { max-width: 1200px; margin: 0 auto; text-align: center; }
.vu-work__grid {
  margin-top: 32px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  text-align: left;
}
.vu-work__card {
  display: block;
  padding: 22px;
  color: #1a1a1a;
  text-decoration: none;
  background: #f7f5f9;
  border: 1px solid rgba(103, 77, 128, 0.22);
  border-radius: 16px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.vu-work__card:hover {
  transform: translateY(-4px);
  box-shadow: 0 18px 30px -20px rgba(103, 77, 128, 0.7);
}
.vu-work__num { font-size: 0.8rem; font-weight: 700; color: #674d80; }
.vu-work__title { margin: 8px 0; font-size: 1.05rem; font-weight: 700; }
.vu-work__text { margin: 0 0 12px; font-size: 0.88rem; line-height: 1.6; color: #3b3b3b; }
.vu-work__more { font-size: 0.82rem; font-weight: 600; color: #674d80; }

.vu-about {
  padding: 72px 20px;
  background: linear-gradient(180deg, #ede9f2 0%, #f7f5f9 100%);
}
.vu-about__inner { max-width: 1200px; margin: 0 auto; }
.vu-about__top {
  display: grid;
  grid-template-columns: 1fr 1.1fr;
  gap: 56px;
  align-items: center;
}
.vu-about__media { position: relative; }
.vu-about__media img {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  border-radius: 20px;
  background: #e6dfec;
  box-shadow: 0 22px 44px -28px rgba(103, 77, 128, 0.6);
}
.vu-about__placeholder {
  width: 100%;
  aspect-ratio: 4 / 3;
  display: grid;
  place-items: center;
  background: #e2e2e2;
  border-radius: 20px;
  box-shadow: 0 22px 44px -28px rgba(0, 0, 0, 0.35);
}
.vu-about__badge {
  position: absolute;
  left: 16px;
  bottom: 16px;
  padding: 6px 14px;
  font-size: 0.75rem;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.92);
  border-radius: 999px;
}
.vu-about__kicker {
  display: inline-block;
  padding: 4px 12px;
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  background: #ded6e6;
  border-radius: 999px;
}
.vu-about__title { margin: 14px 0 12px; font-size: 1.8rem; line-height: 1.2; font-weight: 700; color: #111; }
.vu-about__text p { margin: 0 0 12px; font-size: 0.92rem; line-height: 1.7; color: #3b3b3b; }
.vu-about__facts { display: flex; flex-wrap: wrap; gap: 12px; margin: 18px 0 22px; }
.vu-about__fact {
  padding: 12px 18px;
  background: #fff;
  border: 1px solid rgba(103, 77, 128, 0.22);
  border-radius: 12px;
}
.vu-about__fact strong { display: block; font-size: 1.3rem; color: #674d80; }
.vu-about__fact span { font-size: 0.78rem; color: #3b3b3b; }
.vu-about__btn {
  display: inline-flex;
  padding: 10px 20px;
  font-size: 0.85rem;
  font-weight: 600;
  color: #111;
  text-decoration: none;
  background: #d3c9de;
  border: 1px solid rgba(103, 77, 128, 0.35);
  border-radius: 10px;
  transition: transform 0.3s ease, background 0.3s;
}
.vu-about__btn:hover { transform: translateY(-2px); background: #cdbdde; }

.vu-about__cards {
  margin-top: 48px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
.vu-about__card {
  padding: 24px;
  background: #fff;
  border: 1px solid rgba(103, 77, 128, 0.22);
  border-radius: 16px;
}
.vu-about__card p { margin: 0; font-size: 0.9rem; line-height: 1.65; color: #3b3b3b; }
.vu-about__label { margin: 0 0 10px; font-size: 1.05rem; font-weight: 700; color: #674d80; }
.vu-about__values { margin: 0; padding-left: 18px; font-size: 0.9rem; line-height: 1.8; color: #3b3b3b; }

@media (max-width: 900px) {
  .vu-work__grid { grid-template-columns: repeat(2, 1fr); }
  .vu-about__top { grid-template-columns: 1fr; gap: 32px; }
  .vu-about__cards { grid-template-columns: 1fr; }
}
@media (max-width: 480px) {
  .vu-work__grid { grid-template-columns: 1fr; }
  .vu-about__title { font-size: 1.5rem; }
}
`;

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
.vu-video__content {
  max-width: 460px;
}

/* ---------- Frame ---------- */
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

/* ---------- Demo placeholder ---------- */
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

/* ---------- Text side ---------- */
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
.vu-video__title span { color: var(--v-accent); }
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

export default async function StatsCard({ beforeImpact = null }) {
  const data = await getCountData();

  const metrics = Array.isArray(data) ? data.slice(0, 9) : [];
  const videoId = getYouTubeId(ngoVideo.youtubeUrl);

  return (
    <>
    <FounderSection />
    {beforeImpact}

    <section className="vu-impact" aria-labelledby="impact-title">
      <h2 id="impact-title" className="vu-impact__title">
        Our <span>Impact</span> in Action
      </h2>
      <p className="vu-impact__sub">
        The TRUST WEBSITE works with villagers, volunteers and local leaders
        to deliver services, support families and build a stronger community.
      </p>
      <ImpactCards items={impactItems} />
    </section>

    <section className="vu-stories" aria-labelledby="stats-title">
      <div className="vu-stories__head">
        <h2 id="stats-title" className="vu-stories__title">
          Civic progress at a <span>glance</span>
        </h2>
        <p className="vu-stories__sub">
          Key public counters arranged in a cleaner dashboard format for quick
          review by residents and officials.
        </p>
      </div>

      <StatsCardGrid metrics={metrics} />

      <div className="vu-stories__actions">
        <a href="/service" className="vu-stories__btn vu-stories__btn--solid">
          Our Services
        </a>
        <a href="/contact" className="vu-stories__btn vu-stories__btn--outline">
          Contact Us
        </a>
      </div>
    </section>
        {/* ================= WORK DETAILS ================= */}
    <section className="vu-work" aria-labelledby="work-title">
      <style dangerouslySetInnerHTML={{ __html: aboutCss }} />
      <div className="vu-work__inner">
        <h2 id="work-title" className="vu-impact__title">
          What we <span>do</span>
        </h2>
        <p className="vu-impact__sub">
          A quick look at the main areas where our team works every day.
        </p>
        <div className="vu-work__grid">
          {workDetails.map((w, i) => (
            <a key={w.title} href="/project" className="vu-work__card">
              <span className="vu-work__num">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="vu-work__title">{w.title}</h3>
              <p className="vu-work__text">{w.text}</p>
              <span className="vu-work__more">Learn more</span>
            </a>
          ))}
        </div>
      </div>
    </section>

    {/* ================= ABOUT, MISSION & VISION ================= */}
    <section className="vu-about" aria-labelledby="about-title">
      <div className="vu-about__inner">
        <div className="vu-about__top">
          <div className="vu-about__media">
            {ngoAbout.image ? (
  <img src={ngoAbout.image} alt="Our work with the community" />
) : (
  <div className="vu-about__placeholder" role="img" aria-label="Image placeholder">
    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#9a9a9a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="M21 15l-5-5L5 21" />
    </svg>
  </div>
)}
            <span className="vu-about__badge">Serving the community</span>
          </div>

          <div className="vu-about__content">
            <span className="vu-about__kicker">{ngoAbout.kicker}</span>
            <h2 id="about-title" className="vu-about__title">
              {ngoAbout.title}
            </h2>
            <div className="vu-about__text">
              {ngoAbout.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <div className="vu-about__facts">
              {ngoAbout.facts.map((f) => (
                <div key={f.label} className="vu-about__fact">
                  <strong>{f.value}</strong>
                  <span>{f.label}</span>
                </div>
              ))}
            </div>
            <a href="/About" className="vu-about__btn">
              Read our full story
            </a>
          </div>
        </div>

        <div className="vu-about__cards">
          <article className="vu-about__card vu-about__card--mission">
            <h3 className="vu-about__label">{ngoAbout.mission.title}</h3>
            <p>{ngoAbout.mission.text}</p>
          </article>
          <article className="vu-about__card vu-about__card--vision">
            <h3 className="vu-about__label">{ngoAbout.vision.title}</h3>
            <p>{ngoAbout.vision.text}</p>
          </article>
          <article className="vu-about__card vu-about__card--values">
            <h3 className="vu-about__label">{ngoAbout.values.title}</h3>
            <ul className="vu-about__values">
              {ngoAbout.values.items.map((v) => (
                <li key={v}>{v}</li>
              ))}
            </ul>
          </article>
        </div>
      </div>
    </section>

    {/* ================= NGO VIDEO ================= */}
    <section className="vu-video" aria-labelledby="video-title">
      <style dangerouslySetInnerHTML={{ __html: videoCss }} />
      <div className="vu-video__inner">
        <div className="vu-video__frame">
          <div className="vu-video__ratio">
            {videoId ? (
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`}
                title={ngoVideo.title}
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            ) : (
              <div className="vu-video__demo" role="img" aria-label="Video placeholder">
                <span className="vu-video__chip vu-video__chip--tl">Our Story</span>
                <span className="vu-video__play" />
                <span className="vu-video__chip vu-video__chip--br">03:24</span>
                <span className="vu-video__demo-note">Demo preview. Your YouTube video will appear here.</span>
              </div>
            )}
          </div>
        </div>

        <div className="vu-video__content">
          <span className="vu-video__kicker">{ngoVideo.kicker}</span>
          <h2 id="video-title" className="vu-video__title">
            {ngoVideo.title}
          </h2>
          <p className="vu-video__text">{ngoVideo.text}</p>
          <ul className="vu-video__points">
            {ngoVideo.points.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
          <div className="vu-video__actions">
            <a href="/videos" className="vu-video__btn vu-video__btn--solid">
              Watch More Videos
            </a>
            <a href="/contact" className="vu-video__btn vu-video__btn--outline">
              Get In Touch
            </a>
          </div>
        </div>
      </div>
    </section>


    </>
  );
}
