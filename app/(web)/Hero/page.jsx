import HeroSection from "../components/Hero";

const heroImage = "/BANNER1.avif";

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
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching project data:", error);
    return null;
  }
};

export default async function videosPage() {
  const videos = await getProjectData();
  const bannerUrl = videos?.data?.video_banner;

  return (
    <main className="hero-page hero-page--video">
      <div className="vu-stack">
      <section
        className={`hero-frame hero-frame--video vu-stack__hero${bannerUrl ? "" : " hero-frame--vu"}`}
      >
        {bannerUrl ? (
          <HeroSection data={bannerUrl} />
        ) : (
          <div
            className="gp-hero"
            style={heroImage ? { backgroundImage: `url(${heroImage})` } : undefined}
          >
            <style dangerouslySetInnerHTML={{ __html: heroCss }} />
            <div className="gp-hero__inner">
              <h1 className="gp-hero__title">
                <span>TRUST</span>
                <span>WEBSITE</span>
              </h1>

              <div className="gp-hero__actions">
                <a href="/service" className="gp-hero__btn gp-hero__btn--solid">
                  Our Services
                </a>
                <a href="/grievance" className="gp-hero__btn gp-hero__btn--outline">
                  Contact Us
                </a>
              </div>
            </div>
          </div>
        )}
      </section>

      <section className="vu-panel vu-panel--one">
        <div className="vu-panel__text">
          <span className="vu-panel__line">Village Development</span>
          <span className="vu-panel__line">Public Services</span>
          <span className="vu-panel__line">Citizen First</span>
        </div>
      </section>

      <section className="vu-panel vu-panel--two">
        <div className="vu-panel__text">
          <span className="vu-panel__line">Transparent Governance</span>
          <span className="vu-panel__line">Community Voices</span>
          <span className="vu-panel__line">Growing Together</span>
        </div>
      </section>
      </div>
    </main>
  );
}
