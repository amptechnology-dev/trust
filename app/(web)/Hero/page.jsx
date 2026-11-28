import HeroSection from "../components/Hero";

const heroImage = "/BANNER1.avif"; // API te kono banner na thakle fallback

const heroCss = `
.gp-hero {
  position: relative;
  width: 100%;
  min-height: 78vh;
  display: grid;
  place-items: center;
  padding: 72px 20px;
  text-align: center;
  background-color: #e2e2e2;
  background-size: cover;
  background-position: center;
  overflow: hidden;
}
.gp-hero::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0.55));
}
.gp-hero__inner { position: relative; z-index: 1; }
.gp-hero__title {
  margin: 0 0 28px;
  display: flex;
  flex-direction: column;
  color: #fff;
  font-family: "Anton", "Impact", sans-serif;
  font-weight: 400;
  font-size: clamp(3rem, 10vw, 8rem);
  line-height: 1;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  text-shadow: 0 6px 30px rgba(0, 0, 0, 0.35);
}
.gp-hero__actions { display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; }
.gp-hero__btn {
  padding: 14px 30px;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  text-decoration: none;
  transition: transform 0.2s ease, background 0.2s ease, color 0.2s ease;
}
.gp-hero__btn:hover { transform: translateY(-2px); }
.gp-hero__btn--solid { background: #cdbdde; border: 1.5px solid #8262a1; color: #1d1d1b; }
.gp-hero__btn--outline { background: transparent; border: 1.5px solid #fff; color: #fff; }
.gp-hero__btn--outline:hover { background: #fff; color: #1d1d1b; }

/* Dynamic panel er image er upor text porar jonno dark overlay */
.vu-panel--dynamic {
  position: relative;
  background-size: cover !important;
  background-position: center !important;
  background-repeat: no-repeat !important;
}
.vu-panel--dynamic .vu-panel__text {
  position: relative;
  z-index: 1;
}
.vu-panel--dynamic .vu-panel__line {
  color: #fff;
  text-shadow: 0 4px 24px rgba(0, 0, 0, 0.45);
}
`;

const getProjectData = async () => {
  try {
    const res = await fetch(`${process.env.BACKLINK}/public/officeData`, {
      headers: {
        "x-api-key": process.env.API_KEY,
        "office-id": process.env.OFFICE,
      },
      next: {
        revalidate: 1000,
      },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error("Error fetching project data:", error);
    return null;
  }
};

// Full URL hole direct, na hole BACKPUBLIC jure
const resolveSrc = (value) => {
  if (typeof value !== "string" || !value.trim()) return "";
  const v = value.trim();
  if (/^https?:\/\//i.test(v)) return v;
  const back = process.env.NEXT_PUBLIC_BACKPUBLIC || "";
  return `${back}/${v.replace(/^public\//, "").replace(/^\/+/, "")}`;
};

// "Line 1 | Line 2" ba new line diye ek banner e ekadhik line
const splitLines = (text) =>
  typeof text === "string"
    ? text
        .split(/\n|\|/)
        .map((t) => t.trim())
        .filter(Boolean)
    : [];

export default async function videosPage() {
  const videos = await getProjectData();
  const data = videos?.data;
  const bannerUrl = data?.video_banner;

  // banner[i] + banner_text[i] ek sathe jure slide
  const images = Array.isArray(data?.banner) ? data.banner : [];
  const texts = Array.isArray(data?.banner_text) ? data.banner_text : [];

  const slides = images
    .map((img, i) => ({
      image: resolveSrc(img),
      lines: splitLines(texts[i]),
    }))
    .filter((s) => s.image);

  // Video thakle shob slide panel, na hole prothom slide hero ar baki panel
  const heroSlide = bannerUrl ? null : slides[0] || null;
  const panelSlides = bannerUrl ? slides : slides.slice(1);

  // Hero title: banner text thakle seta, na hole office name (word wise)
  const officeName = (data?.name || "").trim();
  const heroLines =
    heroSlide?.lines?.length
      ? heroSlide.lines
      : officeName
      ? officeName.split(/\s+/)
      : ["Welcome"];

  const heroBg = heroSlide?.image || heroImage;

  return (
    <main className="hero-page hero-page--video">
      <div className="vu-stack">
        <section
          className={`hero-frame hero-frame--video vu-stack__hero${
            bannerUrl ? "" : " hero-frame--vu"
          }`}
        >
          {bannerUrl ? (
            <HeroSection data={bannerUrl} />
          ) : (
            <div
              className="gp-hero"
              style={{ backgroundImage: `url(${heroBg})` }}
            >
              <style dangerouslySetInnerHTML={{ __html: heroCss }} />
              <div className="gp-hero__inner">
                <h1 className="gp-hero__title">
                  {heroLines.map((line, i) => (
                    <span key={i}>{line}</span>
                  ))}
                </h1>

                {/* Header er Services / Contact section er sathe same id */}
                <div className="gp-hero__actions">
                  <a
                    href="/#services"
                    className="gp-hero__btn gp-hero__btn--solid"
                  >
                    Our Services
                  </a>
                  <a
                    href="/#contact"
                    className="gp-hero__btn gp-hero__btn--outline"
                  >
                    Contact Us
                  </a>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Video banner thakle ba 2nd+ banner thakle, ek ek kore dynamic panel */}
        {panelSlides.map((slide, i) => (
          <section
            key={i}
            className={`vu-panel vu-panel--dynamic ${
              i % 2 === 0 ? "vu-panel--one" : "vu-panel--two"
            }`}
            style={{
              backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.3), rgba(0,0,0,0.5)), url(${slide.image})`,
            }}
          >
            {/* video hero thakle style tag ta hero te nei, tai ekhane o dilam */}
            {i === 0 && <style dangerouslySetInnerHTML={{ __html: heroCss }} />}
            <div className="vu-panel__text">
              {slide.lines.map((line, j) => (
                <span key={j} className="vu-panel__line">
                  {line}
                </span>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}