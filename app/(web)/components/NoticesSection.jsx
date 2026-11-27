import Link from "next/link";
import styles from "../styles/desk.module.css";

/* ---------- CONFIG ---------- */
// Left column er data kothay theke ashbe (backend e /public/news nei, tai activity)
const NEWS_PATH = "/public/activity";
const NEWS_ROUTE = "/activity";
const NOTICE_ROUTE = "/notices";

const apiHeaders = () => ({
  "x-api-key": process.env.API_KEY,
  "office-id": process.env.OFFICE,
});

async function fetchList(path) {
  try {
    const res = await fetch(process.env.BACKLINK + path, {
      headers: apiHeaders(),
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    const d = json?.data;
    return Array.isArray(d) ? d : Array.isArray(d?.data) ? d.data : [];
  } catch {
    return [];
  }
}

/* ---------- HELPERS ---------- */
const pad = (n) => String(n).padStart(2, "0");

const getRawDate = (item) =>
  item?.start_date ||
  item?.date ||
  item?.publishDate ||
  item?.publish_date ||
  item?.createdAt ||
  item?.created_at;

function getDateParts(item) {
  const d = new Date(getRawDate(item));
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

// Notice model er type field er nam jai hok, ekhane try korbe
const getKind = (item) =>
  String(
    item?.type || item?.category || item?.notice_type || item?.kind || item?.tag || ""
  ).toLowerCase();

const isTender = (n) => /tender/.test(getKind(n));
const isNotification = (n) => /notif/.test(getKind(n));

/* ---------- SMALL PIECES ---------- */
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

// 3 tab er show/hide + active look (desk.module.css e kichu bodlate hobe na)
const tabCss = `
.nt-radio { position: absolute; opacity: 0; pointer-events: none; }
.nt-panel { display: none; }
#nt-notice:checked ~ .nt-panels .nt-panel--notice,
#nt-notification:checked ~ .nt-panels .nt-panel--notification,
#nt-tender:checked ~ .nt-panels .nt-panel--tender { display: block; }

.nt-tablist { display: flex; flex-wrap: wrap; gap: 8px; }
.nt-tablist label { cursor: pointer; }
#nt-notice:checked ~ .nt-tablist label[for="nt-notice"],
#nt-notification:checked ~ .nt-tablist label[for="nt-notification"],
#nt-tender:checked ~ .nt-tablist label[for="nt-tender"] {
  background: #cdbdde;
  border-color: rgba(103, 77, 128, 0.45);
  box-shadow: 0 10px 18px -12px rgba(103, 77, 128, 0.8);
}
#nt-notice:focus-visible ~ .nt-tablist label[for="nt-notice"],
#nt-notification:focus-visible ~ .nt-tablist label[for="nt-notification"],
#nt-tender:focus-visible ~ .nt-tablist label[for="nt-tender"] {
  outline: 2px solid #674d80;
  outline-offset: 2px;
}
`;

/* ---------- COMPONENT ---------- */
export default async function NewsAndNotices() {
  const [newsData, noticeData] = await Promise.all([
    fetchList(NEWS_PATH),
    fetchList("/public/notice"),
  ]);

  const news = newsData.slice(0, 4);

  // Ek API (/public/notice) theke 3 type e bhag
  const tabs = [
    {
      key: "notice",
      label: "Notice",
      list: noticeData.filter((n) => !isTender(n) && !isNotification(n)).slice(0, 5),
      empty: "No notices right now.",
    },
    {
      key: "notification",
      label: "Notification",
      list: noticeData.filter(isNotification).slice(0, 5),
      empty: "No notifications right now.",
    },
    {
      key: "tender",
      label: "Tender",
      list: noticeData.filter(isTender).slice(0, 5),
      empty: "No tenders right now.",
    },
  ];

  // Je tab e age data ache seta default open
  const defaultTab = tabs.find((t) => t.list.length)?.key || "notice";

  const renderNotice = (item, i) => {
    const { day, month, year } = getDateParts(item);
    const inner = (
      <>
        <span className={styles.noticeDate}>
          <b>{day}</b>
          <small>
            {month}, {year}
          </small>
        </span>
        <span className={styles.noticeTitle}>{getTitle(item)}</span>
      </>
    );

    // PDF link thakle notun tab e khulbe, na thakle notices page e
    return (
      <li key={getId(item, i)}>
        {item?.link ? (
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.noticeItem}
          >
            {inner}
          </a>
        ) : (
          <Link href={NOTICE_ROUTE} className={styles.noticeItem}>
            {inner}
          </Link>
        )}
      </li>
    );
  };

  return (
    <section className={styles.wrapper}>
      <style dangerouslySetInnerHTML={{ __html: tabCss }} />
      <div className={styles.grid}>
        {/* ---------- NEWS & EVENTS ---------- */}
        <div className={styles.column}>
          <div className={styles.head}>
            <div className={styles.headTitle}>
              <span className={styles.kicker}>Latest</span>
              <h2>News And Event</h2>
            </div>
            <span className={styles.headLine} />
            <Link href={NEWS_ROUTE} className={styles.allLink}>
              <Arrow /> All News
            </Link>
          </div>

          <div className={styles.newsList}>
            {news.length ? (
              news.map((item, i) => {
                const { day, month, year } = getDateParts(item);
                return (
                  <Link
                    key={getId(item, i)}
                    href={NEWS_ROUTE}
                    className={styles.newsCard}
                  >
                    <div className={styles.newsDate}>
                      <b>{day}</b>
                      <small>
                        {month.toUpperCase()}, {year}
                      </small>
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

        {/* ---------- NOTICES (Notice / Notification / Tender) ---------- */}
        <div className={styles.column}>
          <div className={styles.head}>
            <div className={styles.headTitle}>
              <span className={styles.kicker}>Latest</span>
              <h2>Notices</h2>
            </div>
            <span className={styles.headLine} />
            <Link href={NOTICE_ROUTE} className={styles.allLink}>
              <Arrow /> All Notices
            </Link>
          </div>

          <div className={styles.tabs}>
            {tabs.map((tab) => (
              <input
                key={tab.key}
                type="radio"
                name="notice-tab"
                id={`nt-${tab.key}`}
                className="nt-radio"
                defaultChecked={tab.key === defaultTab}
              />
            ))}

            <div className={`${styles.tabList} nt-tablist`}>
              {tabs.map((tab) => (
                <label
                  key={tab.key}
                  htmlFor={`nt-${tab.key}`}
                  className={styles.tab}
                >
                  {tab.label}
                </label>
              ))}
            </div>

            <div className={`${styles.panels} nt-panels`}>
              {tabs.map((tab) => (
                <ul
                  key={tab.key}
                  className={`${styles.noticeList} nt-panel nt-panel--${tab.key}`}
                >
                  {tab.list.length ? (
                    tab.list.map(renderNotice)
                  ) : (
                    <li className={styles.emptyState}>{tab.empty}</li>
                  )}
                </ul>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}