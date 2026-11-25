import Link from "next/link";
import styles from "../styles/desk.module.css";
import { ContactSection } from "../components/StatsCardGrid";

/* ---------- STATIC DEMO DATA (shown only when the API returns nothing) ---------- */
const DEMO_NEWS = [
  { id: "taaza-dandiya-event", title: "Taaza Dandiya Event", date: "2026-10-09" },
  { id: "mahishasura-mardini", title: "Mahishasura Mardini", date: "2026-10-09" },
  { id: "nss-walk-talk-dyslexia", title: "NSS Initiative: Walk & Talk for Dyslexia", date: "2026-10-08" },
  { id: "blood-donation-camp", title: "Blood Donation Camp", date: "2026-10-08" },
];

const DEMO_NOTICES = [
  { id: "degree-certificates-distribution", title: "DISTRIBUTION OF DEGREE CERTIFICATES FOR 2023, 2024, 2025 PASS OUT BATCH", date: "2026-10-15", category: "General" },
  { id: "direct-admission-2026", title: "Notice for Direct Admission 2026", date: "2026-10-14", category: "General" },
  { id: "freshers-welcome-2026", title: "Class Suspended for Freshers Welcome 2026", date: "2026-10-11", category: "General" },
  { id: "pg-scholarship-2026-27", title: "PG Scholarship 2026–27", date: "2026-10-05", category: "General" },
  { id: "btech-lateral-entry-2026-27", title: "Commencement of Classes for B.Tech. Lateral Entry Batch 2026–27", date: "2026-09-28", category: "General" },

  { id: "end-sem-timetable", title: "End Semester Examination Time Table, November 2026", date: "2026-10-16", category: "Examination" },
  { id: "exam-form-fillup", title: "Examination Form Fill-up for Odd Semester 2026–27", date: "2026-10-13", category: "Examination" },
  { id: "admit-card-download", title: "Admit Card Download Notice for Mid Semester Exams", date: "2026-10-09", category: "Examination" },
  { id: "revaluation-notice", title: "Re-evaluation and Scrutiny Application Notice", date: "2026-10-03", category: "Examination" },
  { id: "backlog-exam-schedule", title: "Backlog Examination Schedule for 2023 Batch", date: "2026-09-26", category: "Examination" },
];

const DEMO_FAQS = [
  { id: 1, question: "How can I apply for direct admission?", answer: "Check the latest Direct Admission notice in the Notices section above, fill in the application form and submit it with the required documents before the last date mentioned in the notice." },
  { id: 2, question: "When will degree certificates be distributed?", answer: "Distribution dates for each pass-out batch are published under General notices. Please carry your ID card and the acknowledgement slip when collecting your certificate." },
  { id: 3, question: "How do I apply for a scholarship?", answer: "Scholarship notices, eligibility criteria and application links are posted in the Notices section. You can also visit the office with your marksheet and income documents for guidance." },
  { id: 4, question: "Where can I find the examination time table and admit cards?", answer: "Open the Examination tab in the Notices section. Time tables, form fill-up dates and admit card notices are posted there as soon as they are released." },
  { id: 5, question: "How can I contact the office?", answer: "Use the Contact Office page to send a message or find phone numbers and the office address. We usually respond within two working days." },
];

async function fetchList(path) {
  try {
    const res = await fetch(process.env.BACKLINK + path, {
      headers: {
        "x-api-key": process.env.API_KEY,
        "office-id": process.env.OFFICE,
      },
      next: { revalidate: 1000 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    const d = json?.data;
    return Array.isArray(d) ? d : Array.isArray(d?.data) ? d.data : [];
  } catch {
    return [];
  }
}
async function getOfficeInfo() {
  try {
    const res = await fetch(`${process.env.BACKLINK}/public/officeData`, {
      headers: {
        "x-api-key": process.env.API_KEY,
        "office-id": process.env.OFFICE,
      },
      next: { revalidate: 1000 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data ?? null;
  } catch (error) {
    return null;
  }
}

// EDIT THESE. Email, phone and address are taken from your office data when
// it has them; anything missing falls back to the values here.
const contactDefaults = {
  address: "TRUST WEBSITE Office, Main Road, Block, District, West Bengal",
  email: "office@example.com",
  phone: "+91 00000 00000",
  hours: "Monday to Saturday, 10:00 AM to 5:00 PM",
  bank: {
    accountName: "Account holder name",
    accountNumber: "Account number",
    ifsc: "IFSC code",
    bankBranch: "Bank name, Branch",
    upi: "", // leave empty to hide
  },
  socials: {
    facebook: "",
    twitter: "",
    instagram: "",
    linkedin: "",
    youtube: "",
  },
};
const pad = (n) => String(n).padStart(2, "0");

function getDateParts(item) {
  const d = new Date(item?.date || item?.createdAt || item?.created_at);
  if (isNaN(d)) return { day: "--", month: "", year: "" };
  return {
    day: pad(d.getDate()),
    month: d.toLocaleString("en-US", { month: "short" }),
    year: d.getFullYear(),
  };
}

const getTitle = (item) => item?.title || item?.name || item?.heading || "Untitled";
const getId = (item, i) => item?.slug || item?._id || item?.id || i;
const isExam = (item) => /exam/i.test(item?.category || item?.type || item?.tag || "");

function Lotus({ className }) {
  return (
    <svg className={className} viewBox="0 0 120 100" aria-hidden="true" focusable="false">
      <g fill="currentColor">
        <path d="M60 8C46 28 46 56 60 78 74 56 74 28 60 8Z" />
        <path d="M34 22C26 42 32 64 52 80 56 58 50 36 34 22Z" />
        <path d="M86 22C94 42 88 64 68 80 64 58 70 36 86 22Z" />
        <path d="M12 46C14 64 30 78 50 84 44 68 32 54 12 46Z" />
        <path d="M108 46C106 64 90 78 70 84 76 68 88 54 108 46Z" />
      </g>
    </svg>
  );
}

function Arrow() {
  return (
    <svg className={styles.arrow} viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
      <path d="M2 8h11M9 3.5 13.5 8 9 12.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default async function NewsAndNotices({ section = "all" }) {
  const showNews = section !== "contact";
  const showContact = section !== "news";
  const [newsData, noticeData, faqData, office] = await Promise.all([
    showNews ? fetchList("/public/news") : [],
    showNews ? fetchList("/public/notices") : [],
    showContact ? fetchList("/public/faq") : [],
    showContact ? getOfficeInfo() : null,
  ]);

  const info = {
    ...contactDefaults,
    email: office?.email || contactDefaults.email,
    phone: office?.mobile ? `+91 ${office.mobile}` : contactDefaults.phone,
    address: office?.address || contactDefaults.address,
  };

  // Fallback to demo data when the API gives nothing.
  // To ALWAYS show demo data while designing, use the DEMO_* arrays directly.
  const newsSource = newsData.length ? newsData : DEMO_NEWS;
  const noticeSource = noticeData.length ? noticeData : DEMO_NOTICES;
  const faqSource = faqData.length ? faqData : DEMO_FAQS;

  const news = newsSource.slice(0, 4);
  const generalNotices = noticeSource.filter((n) => !isExam(n)).slice(0, 5);
  const examNotices = noticeSource.filter(isExam).slice(0, 5);
  const faqs = faqSource.slice(0, 6);

  const renderNotices = (list, emptyText) =>
    list.length ? (
      list.map((item, i) => {
        const { day, month, year } = getDateParts(item);
        return (
          <li key={getId(item, i)}>
            <Link href={`/notices/${getId(item, i)}`} className={styles.noticeItem}>
              <span className={styles.noticeDate}>
                <b>{day}</b>
                <small>{month}, {year}</small>
              </span>
              <span className={styles.noticeTitle}>{getTitle(item)}</span>
            </Link>
          </li>
        );
      })
    ) : (
      <li className={styles.emptyState}>{emptyText}</li>
    );

  return (
    <>
      {/* ================= NEWS & NOTICES ================= */}
      {showNews && <section className={styles.wrapper}>
        <div className={styles.grid}>
          {/* ---------- NEWS & EVENTS ---------- */}
          <div className={styles.column}>
            <div className={styles.head}>
              <div className={styles.headTitle}>
                <span className={styles.kicker}>Latest</span>
                <h2>News And Event</h2>
              </div>
              <span className={styles.headLine} />
              <Link href="/news" className={styles.allLink}>
                <Arrow /> All News
              </Link>
            </div>

            <div className={styles.newsList}>
              {news.length ? (
                news.map((item, i) => {
                  const { day, month, year } = getDateParts(item);
                  return (
                    <Link key={getId(item, i)} href={`/news/${getId(item, i)}`} className={styles.newsCard}>
                      <div className={styles.newsDate}>
                        <b>{day}</b>
                        <small>{month.toUpperCase()}, {year}</small>
                        <i className={styles.dateBar} />
                      </div>
                      <div className={styles.newsBody}>
                        <h3>{getTitle(item)}</h3>
                        <span className={styles.readMore}>
                          <Arrow /> Read More
                        </span>
                      </div>
                      <Lotus className={styles.lotus} />
                    </Link>
                  );
                })
              ) : (
                <div className={styles.emptyState}>No news available right now.</div>
              )}
            </div>
          </div>

          {/* ---------- NOTICES ---------- */}
          <div className={styles.column}>
            <div className={styles.head}>
              <div className={styles.headTitle}>
                <span className={styles.kicker}>Latest</span>
                <h2>Notices</h2>
              </div>
              <span className={styles.headLine} />
              <Link href="/notices" className={styles.allLink}>
                <Arrow /> All Notices
              </Link>
            </div>

            <div className={styles.tabs}>
              <input type="radio" name="notice-tab" id="notice-tab-general" className={styles.inputGeneral} defaultChecked />
              <input type="radio" name="notice-tab" id="notice-tab-exam" className={styles.inputExam} />

              <div className={styles.tabList}>
                <label htmlFor="notice-tab-general" className={`${styles.tab} ${styles.tabGeneral}`}>General</label>
                <label htmlFor="notice-tab-exam" className={`${styles.tab} ${styles.tabExam}`}>Examination</label>
              </div>

              <div className={styles.panels}>
                <ul className={`${styles.noticeList} ${styles.panelGeneral}`}>
                  {renderNotices(generalNotices, "No general notices right now.")}
                </ul>
                <ul className={`${styles.noticeList} ${styles.panelExam}`}>
                  {renderNotices(examNotices, "No examination notices right now.")}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      }
      {/* ================= CONTACT ================= */}
      {showContact && <ContactSection info={info} />}

      {/* ================= FAQ ================= */}
      {showContact && <section className={styles.faqSection}>
        <div className={styles.faqInner}>
          <div className={styles.faqIntro}>
            <span className={styles.faqKicker}>Help Centre</span>
            <h2 className={styles.faqHeading}>
              Frequently Asked <em>Questions</em>
            </h2>
            <p className={styles.faqText}>
              Quick answers to the things students and parents ask us most. Can&apos;t find what you need? Reach out to the office directly.
            </p>
            <div className={styles.faqActions}>
              <Link href="/contact" className={styles.faqBtnPrimary}>
                Contact Office <Arrow />
              </Link>
              <Link href="/faq" className={styles.faqBtnGhost}>
                View All FAQs
              </Link>
            </div>
          </div>

          <div className={styles.faqList}>
            {faqs.map((item, i) => (
              <details key={getId(item, i)} name="faq" className={styles.faqItem} open={i === 0}>
                <summary className={styles.faqQuestion}>
                  <span className={styles.faqNum}>{pad(i + 1)}</span>
                  <span className={styles.faqQText}>{item.question || item.title}</span>
                  <span className={styles.faqIcon} aria-hidden="true" />
                </summary>
                <div className={styles.faqAnswer}>
                  <p>{item.answer || item.description}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>}
    </>
  );
}
