import Link from "next/link";

/* ---------- STATIC DEMO DATA (shown only when the API returns nothing) ---------- */
const DEMO_NOTICES = [
  {
    id: "degree-certificates-distribution",
    title:
      "DISTRIBUTION OF DEGREE CERTIFICATES FOR 2023, 2024, 2025 PASS OUT BATCH",
    date: "2026-10-15",
    category: "General",
  },
  {
    id: "direct-admission-2026",
    title: "Notice for Direct Admission 2026",
    date: "2026-10-14",
    category: "General",
  },
  {
    id: "freshers-welcome-2026",
    title: "Class Suspended for Freshers Welcome 2026",
    date: "2026-10-11",
    category: "General",
  },
  {
    id: "pg-scholarship-2026-27",
    title: "PG Scholarship 2026–27",
    date: "2026-10-05",
    category: "General",
  },
  {
    id: "btech-lateral-entry-2026-27",
    title: "Commencement of Classes for B.Tech. Lateral Entry Batch 2026–27",
    date: "2026-09-28",
    category: "General",
  },

  {
    id: "end-sem-timetable",
    title: "End Semester Examination Time Table, November 2026",
    date: "2026-10-16",
    category: "Examination",
  },
  {
    id: "exam-form-fillup",
    title: "Examination Form Fill-up for Odd Semester 2026–27",
    date: "2026-10-13",
    category: "Examination",
  },
  {
    id: "admit-card-download",
    title: "Admit Card Download Notice for Mid Semester Exams",
    date: "2026-10-09",
    category: "Examination",
  },
  {
    id: "revaluation-notice",
    title: "Re-evaluation and Scrutiny Application Notice",
    date: "2026-10-03",
    category: "Examination",
  },
  {
    id: "backlog-exam-schedule",
    title: "Backlog Examination Schedule for 2023 Batch",
    date: "2026-09-26",
    category: "Examination",
  },
];

/* ---------- API ---------- */
// Backend e kon path ta ache jani na, tai ek ek kore try korbe.
// Jeta kaj korbe oita console e dekhabe. Tarpor shudhu oita rekhe baki gulo muche dio.
const NOTICE_PATHS = [
  "/public/notification",
  "/public/notifications",
  "/public/notice",
  "/public/notices",
];

const headers = () => ({
  "x-api-key": process.env.API_KEY,
  "office-id": process.env.OFFICE,
});

// Different API response shape handle kore: data[], data.data[], data.notification[] etc.
function extractList(json) {
  const d = json?.data ?? json;
  if (Array.isArray(d)) return d;
  for (const key of [
    "data",
    "notification",
    "notifications",
    "notice",
    "notices",
    "items",
    "rows",
  ]) {
    if (Array.isArray(d?.[key])) return d[key];
  }
  return [];
}

async function fetchNotices() {
  for (const path of NOTICE_PATHS) {
    try {
      const res = await fetch(process.env.BACKLINK + path, {
        headers: headers(),
        next: { revalidate: 60 },
      });
      if (!res.ok) {
        console.log(`[notices] ${path} -> ${res.status}`);
        continue;
      }
      const json = await res.json();
      const list = extractList(json);
      console.log(`[notices] ${path} -> OK, items: ${list.length}`);
      return list;
    } catch (err) {
      console.log(`[notices] ${path} -> error: ${err.message}`);
    }
  }
  return [];
}

/* ---------- HELPERS ---------- */
const pad = (n) => String(n).padStart(2, "0");

function getDateParts(item) {
  const raw =
    item?.date ||
    item?.publishDate ||
    item?.publish_date ||
    item?.createdAt ||
    item?.created_at;
  const d = new Date(raw);
  if (isNaN(d)) return { day: "--", month: "", year: "" };
  return {
    day: pad(d.getDate()),
    month: d.toLocaleString("en-US", { month: "short" }),
    year: d.getFullYear(),
  };
}

const getTitle = (item) =>
  item?.title || item?.name || item?.heading || item?.subject || "Untitled";
const getId = (item, i) => item?.slug || item?._id || item?.id || i;
const isExam = (item) =>
  /exam/i.test(item?.category || item?.type || item?.tag || "");

// Latest notice age
const byNewest = (a, b) =>
  new Date(b?.date || b?.createdAt || b?.created_at || 0) -
  new Date(a?.date || a?.createdAt || a?.created_at || 0);

/* ---------- STYLES (same look as the stats / about sections) ---------- */
const noticeCss = `
.vu-notice {
  --n-accent: #674d80;
  --n-soft: #ded6e6;
  --n-line: rgba(103, 77, 128, 0.22);
  --n-ease: cubic-bezier(0.22, 0.61, 0.36, 1);
  padding: 72px 20px;
  color: #1a1a1a;
  background: linear-gradient(180deg, #f7f5f9 0%, #ede9f2 100%);
}
.vu-notice__inner { max-width: 1200px; margin: 0 auto; }

/* ---------- Heading ---------- */
.vu-notice__head { text-align: center; margin-bottom: 28px; }
.vu-notice__kicker {
  display: inline-block;
  padding: 4px 12px;
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  background: var(--n-soft);
  border-radius: 999px;
}
.vu-notice__title {
  margin: 14px 0 8px;
  font-size: 1.8rem;
  line-height: 1.2;
  font-weight: 700;
  color: #111;
}
.vu-notice__title span { color: var(--n-accent); }
.vu-notice__sub {
  max-width: 560px;
  margin: 0 auto;
  font-size: 0.92rem;
  line-height: 1.7;
  color: #3b3b3b;
}

/* ---------- Tabs (CSS only, no JS) ---------- */
.vu-notice__radio {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}
.vu-notice__tablist {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 26px;
}
.vu-notice__tab {
  padding: 9px 22px;
  font-size: 0.85rem;
  font-weight: 600;
  color: #111;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid var(--n-line);
  border-radius: 999px;
  transition: transform 0.3s var(--n-ease), background 0.3s, border-color 0.3s;
}
.vu-notice__tab:hover { transform: translateY(-2px); border-color: var(--n-accent); }

#notice-tab-general:checked ~ .vu-notice__tablist label[for="notice-tab-general"],
#notice-tab-exam:checked ~ .vu-notice__tablist label[for="notice-tab-exam"] {
  background: #d3c9de;
  border-color: rgba(103, 77, 128, 0.45);
  box-shadow: 0 10px 18px -12px rgba(103, 77, 128, 0.8);
}
.vu-notice__radio:focus-visible ~ .vu-notice__tablist .vu-notice__tab {
  outline-offset: 2px;
}
#notice-tab-general:focus-visible ~ .vu-notice__tablist label[for="notice-tab-general"],
#notice-tab-exam:focus-visible ~ .vu-notice__tablist label[for="notice-tab-exam"] {
  outline: 2px solid var(--n-accent);
}

/* ---------- Panels ---------- */
.vu-notice__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: none;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}
#notice-tab-general:checked ~ .vu-notice__panels .vu-notice__list--general,
#notice-tab-exam:checked ~ .vu-notice__panels .vu-notice__list--exam {
  display: grid;
}

/* ---------- Notice card ---------- */
.vu-notice__item {
  display: flex;
  align-items: center;
  gap: 16px;
  height: 100%;
  padding: 16px 18px;
  color: #1a1a1a;
  text-decoration: none;
  background: #fff;
  border: 1px solid var(--n-line);
  border-radius: 16px;
  transition: transform 0.3s var(--n-ease), box-shadow 0.3s var(--n-ease), border-color 0.3s;
}
.vu-notice__item:hover {
  transform: translateY(-3px);
  border-color: var(--n-accent);
  box-shadow: 0 18px 30px -20px rgba(103, 77, 128, 0.7);
}
.vu-notice__date {
  flex: none;
  width: 62px;
  padding: 8px 0;
  text-align: center;
  background: #ede9f2;
  border-radius: 12px;
}
.vu-notice__date b {
  display: block;
  font-size: 1.3rem;
  line-height: 1.1;
  font-weight: 700;
  color: var(--n-accent);
}
.vu-notice__date small {
  display: block;
  margin-top: 2px;
  font-size: 0.68rem;
  color: #3b3b3b;
}
.vu-notice__text {
  flex: 1;
  min-width: 0;
  font-size: 0.92rem;
  font-weight: 500;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.vu-notice__arrow {
  flex: none;
  color: var(--n-accent);
  transition: transform 0.3s var(--n-ease);
}
.vu-notice__item:hover .vu-notice__arrow { transform: translateX(4px); }

.vu-notice__empty {
  grid-column: 1 / -1;
  padding: 28px;
  text-align: center;
  font-size: 0.9rem;
  color: #3b3b3b;
  background: rgba(255, 255, 255, 0.7);
  border: 1px dashed var(--n-line);
  border-radius: 16px;
}

/* ---------- Button ---------- */
.vu-notice__actions { margin-top: 32px; text-align: center; }
.vu-notice__btn {
  display: inline-flex;
  align-items: center;
  padding: 10px 22px;
  font-size: 0.85rem;
  font-weight: 600;
  color: #111;
  text-decoration: none;
  background: #d3c9de;
  border: 1px solid rgba(103, 77, 128, 0.35);
  border-radius: 10px;
  transition: transform 0.3s var(--n-ease), background 0.3s, box-shadow 0.3s;
}
.vu-notice__btn:hover {
  transform: translateY(-2px);
  background: #cdbdde;
  box-shadow: 0 10px 18px -12px rgba(103, 77, 128, 0.8);
}

@media (max-width: 900px) {
  .vu-notice { padding: 52px 20px; }
  .vu-notice__list { grid-template-columns: 1fr; }
}
@media (max-width: 480px) {
  .vu-notice__title { font-size: 1.5rem; }
  .vu-notice__item { padding: 14px; gap: 12px; }
  .vu-notice__date { width: 54px; }
}
@media (prefers-reduced-motion: reduce) {
  .vu-notice * { transition: none !important; }
}
`;

function ArrowIcon() {
  return (
    <svg
      className="vu-notice__arrow"
      viewBox="0 0 16 16"
      width="16"
      height="16"
      aria-hidden="true"
    >
      <path
        d="M2 8h11M9 3.5 13.5 8 9 12.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ---------- COMPONENT ---------- */
export default async function NoticesSection() {
  // API te data na thakle demo data dekhabe
  const noticeData = await fetchNotices();

  // API te data na thakle demo data dekhabe
  const noticeSource = (noticeData.length ? noticeData : DEMO_NOTICES)
    .slice()
    .sort(byNewest);

  const generalNotices = noticeSource.filter((n) => !isExam(n)).slice(0, 6);
  const examNotices = noticeSource.filter(isExam).slice(0, 6);

  const renderNotices = (list, emptyText) =>
    list.length ? (
      list.map((item, i) => {
        const { day, month, year } = getDateParts(item);
        return (
          <li key={getId(item, i)}>
            <Link
              href={`/notices/${getId(item, i)}`}
              className="vu-notice__item"
            >
              <span className="vu-notice__date">
                <b>{day}</b>
                <small>
                  {month}, {year}
                </small>
              </span>
              <span className="vu-notice__text">{getTitle(item)}</span>
              <ArrowIcon />
            </Link>
          </li>
        );
      })
    ) : (
      <li className="vu-notice__empty">{emptyText}</li>
    );

  return (
    <section className="vu-notice" aria-labelledby="notice-title">
      <style dangerouslySetInnerHTML={{ __html: noticeCss }} />
      <div className="vu-notice__inner">
        <div className="vu-notice__head">
          <span className="vu-notice__kicker">Latest</span>
          <h2 id="notice-title" className="vu-notice__title">
            Important <span>Notices</span>
          </h2>
          <p className="vu-notice__sub">
            Stay updated with the latest general and examination announcements
            from the office.
          </p>
        </div>

        <div className="vu-notice__tabs">
          <input
            type="radio"
            name="notice-tab"
            id="notice-tab-general"
            className="vu-notice__radio"
            defaultChecked
          />
          <input
            type="radio"
            name="notice-tab"
            id="notice-tab-exam"
            className="vu-notice__radio"
          />

          <div className="vu-notice__tablist">
            <label htmlFor="notice-tab-general" className="vu-notice__tab">
              General
            </label>
            <label htmlFor="notice-tab-exam" className="vu-notice__tab">
              Examination
            </label>
          </div>

          <div className="vu-notice__panels">
            <ul className="vu-notice__list vu-notice__list--general">
              {renderNotices(generalNotices, "No general notices right now.")}
            </ul>
            <ul className="vu-notice__list vu-notice__list--exam">
              {renderNotices(examNotices, "No examination notices right now.")}
            </ul>
          </div>
        </div>

        <div className="vu-notice__actions">
          <Link href="/notices" className="vu-notice__btn">
            View All Notices
          </Link>
        </div>
      </div>
    </section>
  );
}
