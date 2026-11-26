import Link from "next/link";

const MAX_ITEMS = 4;

/* ---------- API te data na thakle eta dekhabe ---------- */
const FALLBACK_ITEMS = [
  { title: "Welfare Schemes", text: "Helping families access government benefits, pensions and support programs." },
  { title: "Water & Sanitation", text: "Clean drinking water, drainage and sanitation works for every ward." },
  { title: "Roads & Infrastructure", text: "Building and maintaining village roads, lighting and public spaces." },
  { title: "Education & Health", text: "Supporting schools, health camps and awareness drives in the community." },
];

const DEFAULT_TEXT = "View project progress and activity highlights.";

/* ---------- API ---------- */
async function getActivities() {
  const headers = {
    "x-api-key": process.env.API_KEY,
    "office-id": process.env.OFFICE,
  };

  try {
    const res = await fetch(`${process.env.BACKLINK}/public/activity`, {
      headers,
      next: { revalidate: 60 },
    });
    if (!res.ok) {
      console.error(`[what-we-do] activity API failed: ${res.status}`);
      return [];
    }
    const json = await res.json();
    const d = json?.data;
    return Array.isArray(d) ? d : Array.isArray(d?.data) ? d.data : [];
  } catch (error) {
    console.error("[what-we-do] error:", error.message);
    return [];
  }
}

// API item -> card item (image ignore kora hoyeche)
const mapItem = (item) => ({
  title: item?.title || item?.name || item?.heading || "Untitled",
  text: item?.description || item?.desc || item?.details || item?.text || DEFAULT_TEXT,
});

/* ---------- STYLES ---------- */
const workCss = `
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
.vu-work__title {
  margin: 8px 0;
  font-size: 1.05rem;
  font-weight: 700;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.vu-work__text {
  margin: 0 0 12px;
  font-size: 0.88rem;
  line-height: 1.6;
  color: #3b3b3b;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.vu-work__more { font-size: 0.82rem; font-weight: 600; color: #674d80; }

@media (max-width: 900px) {
  .vu-work__grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 480px) {
  .vu-work__grid { grid-template-columns: 1fr; }
}
`;

/* ---------- COMPONENT ---------- */
export default async function WhatWeDoSection() {
  const data = await getActivities();

  const items = data.length
    ? data.slice(0, MAX_ITEMS).map(mapItem)
    : FALLBACK_ITEMS;

  return (
    <section className="vu-work" aria-labelledby="work-title">
      <style dangerouslySetInnerHTML={{ __html: workCss }} />
      <div className="vu-work__inner">
        <h2 id="work-title" className="vu-impact__title">
          What we <span>do</span>
        </h2>
        <p className="vu-impact__sub">
          A quick look at the main areas where our team works every day.
        </p>
        <div className="vu-work__grid">
          {items.map((w, i) => (
            <Link key={`${w.title}-${i}`} href="/project" className="vu-work__card">
              <span className="vu-work__num">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="vu-work__title">{w.title}</h3>
              <p className="vu-work__text">{w.text}</p>
              <span className="vu-work__more">Learn more</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}