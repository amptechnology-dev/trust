import StatsCardGrid from "../components/StatsCardGrid";

/* ---------- API helpers ---------- */
const getHeaders = () => ({
  "x-api-key": process.env.API_KEY,
  "office-id": process.env.OFFICE,
});

// Office data ekbar fetch, counter ar gallery duto-te use hobe
async function getOfficeData() {
  try {
    const res = await fetch(`${process.env.BACKLINK}/public/officeData`, {
      headers: getHeaders(),
      next: { revalidate: 1000 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data ?? null;
  } catch (error) {
    console.error("[officeData] error:", error.message);
    return null;
  }
}

async function getCountData(office) {
  try {
    const isActive = office?.enabled_services?.includes("counter");
    if (!isActive) return [];

    const res = await fetch(`${process.env.BACKLINK}/public/counter`, {
      headers: getHeaders(),
      next: { revalidate: 60 },
    });
    if (!res.ok) {
      console.error(`Failed to fetch counter data: ${res.statusText}`);
      return [];
    }

    const payload = await res.json();
    return Array.isArray(payload?.data?.counter) ? payload.data.counter : [];
  } catch (error) {
    console.error("Error:", error.message);
    return [];
  }
}

// Gallery: "gallery" service enabled thakle /public/gallery fetch
async function getGalleryData(office) {
  try {
    const isActive = office?.enabled_services?.includes("gallery");
    if (!isActive) return [];

    const res = await fetch(`${process.env.BACKLINK}/public/gallery`, {
      headers: getHeaders(),
      next: { revalidate: 60 },
    });
    if (!res.ok) {
      console.error(`Failed to fetch gallery data: ${res.statusText}`);
      return [];
    }

    const json = await res.json();
    const d = json?.data;
    return Array.isArray(d) ? d : Array.isArray(d?.data) ? d.data : [];
  } catch (error) {
    console.error("Gallery Error:", error.message);
    return [];
  }
}

// About Us: { description, image, video }
async function getAboutData() {
  try {
    const res = await fetch(`${process.env.BACKLINK}/public/about`, {
      headers: getHeaders(),
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    const d = json?.data;
    return d && !Array.isArray(d) ? d : Array.isArray(d) ? d[0] || null : null;
  } catch (error) {
    console.error("[about] error:", error.message);
    return null;
  }
}

// Founder: { accordions: [{ title, text }] } (Mission / Vision cards ekhan theke)
async function getFounderData() {
  try {
    const res = await fetch(`${process.env.BACKLINK}/public/founder`, {
      headers: getHeaders(),
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data || null;
  } catch (error) {
    console.error("[founder] error:", error.message);
    return null;
  }
}

/* ---------- Helpers ---------- */
// Full URL hole direct, na hole BACKPUBLIC jure
const resolveSrc = (value) => {
  if (typeof value !== "string" || !value.trim()) return "";
  const v = value.trim();
  if (/^https?:\/\//i.test(v)) return v;
  const back = process.env.NEXT_PUBLIC_BACKPUBLIC || "";
  return `${back}/${v.replace(/^public\//, "").replace(/^\/+/, "")}`;
};

const getGalleryImage = (item) =>
  resolveSrc(item?.image || item?.photo || item?.img || item?.url || "");

/* ============ ABOUT: fallback (API te data na thakle) ============ */
const aboutDefaults = {
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
  cards: [
    {
      title: "Our Mission",
      text: "To deliver fast, fair and transparent services that improve everyday life for every resident.",
    },
    {
      title: "Our Vision",
      text: "A self-reliant, clean and prosperous village where every family has opportunity.",
    },
    {
      title: "Our Values",
      text: "Transparency, integrity, inclusion and service first.",
    },
  ],
};

// description ke paragraph e bhag kore (new line diye)
const splitParagraphs = (text) =>
  String(text || "")
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

const formatFact = (item) => ({
  value: `${Number(item?.value ?? 0).toLocaleString("en-IN")}+`,
  label: item?.text || item?.label || "",
});

const aboutCss = `
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

@media (max-width: 900px) {
  .vu-about__top { grid-template-columns: 1fr; gap: 32px; }
  .vu-about__cards { grid-template-columns: 1fr; }
}
@media (max-width: 480px) {
  .vu-about__title { font-size: 1.5rem; }
}
`;

export default async function StatsCard({ afterStats = null }) {
  // Office data ekbar, tarpor baki shob parallel e
  const office = await getOfficeData();

  const [data, aboutApi, founderApi, galleryData] = await Promise.all([
    getCountData(office),
    getAboutData(),
    getFounderData(),
    getGalleryData(office),
  ]);

  const baseMetrics = Array.isArray(data) ? data.slice(0, 9) : [];

  /* ---------- Gallery chhobi (API theke) ---------- */
  const galleryImages = (Array.isArray(galleryData) ? galleryData : [])
    .map(getGalleryImage)
    .filter(Boolean);

  /* ---------- Protita stats card e gallery chhobi jure dewa ---------- */
  // Chhobi kom hole prothom theke abar repeat hobe
  const metrics = baseMetrics.map((m, i) => {
    if (!galleryImages.length) return m;
    const img = galleryImages[i % galleryImages.length];
    return { ...m, image: img, src: img, img };
  });

  /* ---------- About data (API + fallback) ---------- */
  const apiParagraphs = splitParagraphs(aboutApi?.description);

  const about = {
    image: aboutApi?.image || aboutDefaults.image,
    kicker: aboutDefaults.kicker,
    title: aboutDefaults.title,
    paragraphs: apiParagraphs.length ? apiParagraphs : aboutDefaults.paragraphs,
    // Counter API theke prothom 3 ta
    facts: baseMetrics.length
      ? baseMetrics.slice(0, 3).map(formatFact)
      : aboutDefaults.facts,
    // Founder API er accordion theke prothom 3 ta
    cards: founderApi?.accordions?.length
      ? founderApi.accordions
          .slice(0, 3)
          .map((a) => ({ title: a.title, text: a.text }))
      : aboutDefaults.cards,
  };

  return (
    <>
      {/* ================= STATS (chhobi gallery API theke) ================= */}
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

        <StatsCardGrid metrics={metrics} images={galleryImages} />

        <div className="vu-stories__actions">
          <a href="/service" className="vu-stories__btn vu-stories__btn--solid">
            Our Services
          </a>
          <a
            href="/contact"
            className="vu-stories__btn vu-stories__btn--outline"
          >
            Contact Us
          </a>
        </div>
      </section>

      {/* What we do (Home theke prop hishebe ashe) */}
      {afterStats}

      {/* ================= ABOUT, MISSION & VISION ================= */}
      <section className="vu-about" aria-labelledby="about-title">
        <style dangerouslySetInnerHTML={{ __html: aboutCss }} />
        <div className="vu-about__inner">
          <div className="vu-about__top">
            <div className="vu-about__media">
              {about.image ? (
                <img src={about.image} alt="Our work with the community" />
              ) : (
                <div
                  className="vu-about__placeholder"
                  role="img"
                  aria-label="Image placeholder"
                >
                  <svg
                    width="56"
                    height="56"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#9a9a9a"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <path d="M21 15l-5-5L5 21" />
                  </svg>
                </div>
              )}
              <span className="vu-about__badge">Serving the community</span>
            </div>

            <div className="vu-about__content">
              <span className="vu-about__kicker">{about.kicker}</span>
              <h2 id="about-title" className="vu-about__title">
                {about.title}
              </h2>
              <div className="vu-about__text">
                {about.paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
              <div className="vu-about__facts">
                {about.facts.map((f, i) => (
                  <div key={`${f.label}-${i}`} className="vu-about__fact">
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
            {about.cards.map((c, i) => (
              <article key={`${c.title}-${i}`} className="vu-about__card">
                <h3 className="vu-about__label">{c.title}</h3>
                <p>{c.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}