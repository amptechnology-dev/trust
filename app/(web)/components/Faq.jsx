"use client";
import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const pad = (n) => String(n).padStart(2, "0");

const getQuestion = (f) =>
  f?.question || f?.title || f?.name || f?.heading || "";
const getAnswer = (f) =>
  f?.answer || f?.description || f?.reply || f?.content || "";

export default function Faq({ faqData = [] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [query, setQuery] = useState("");

  const list = useMemo(
    () =>
      (Array.isArray(faqData) ? faqData : []).filter(
        (f) => getQuestion(f) && getAnswer(f)
      ),
    [faqData]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (f) =>
        getQuestion(f).toLowerCase().includes(q) ||
        getAnswer(f).toLowerCase().includes(q)
    );
  }, [list, query]);

  const toggle = (index) =>
    setActiveIndex((prev) => (prev === index ? null : index));

  return (
    <section className="fq-page">
      {/* ================= HERO ================= */}
      <div className="fq-hero">
        <div className="fq-container">
          <span className="fq-badge">Help Centre</span>
          <h1 className="fq-title">How can we help you?</h1>
          <p className="fq-lead">
            Find quick answers to the most common questions. Can&apos;t find
            what you need? Contact the office directly.
          </p>

          <div className="fq-search">
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <circle
                cx="11"
                cy="11"
                r="7"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M20 20l-3.5-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <input
              type="search"
              placeholder="Search your question..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActiveIndex(0);
              }}
              aria-label="Search FAQs"
            />
          </div>

          {list.length > 0 && (
            <p className="fq-count">
              {query.trim()
                ? `${filtered.length} result${filtered.length === 1 ? "" : "s"} found`
                : `${list.length} question${list.length === 1 ? "" : "s"} answered`}
            </p>
          )}
        </div>
      </div>

      {/* ================= BODY ================= */}
      <div className="fq-container fq-body">
        <div className="fq-grid">
          {/* ---------- Image ---------- */}
          <aside className="fq-aside">
            <div className="fq-imageCard">
              <Image
                src="/faq.png"
                alt="Frequently asked questions"
                width={600}
                height={400}
                className="fq-image"
                priority
              />
            </div>
          </aside>

          {/* ---------- List ---------- */}
          <div className="fq-main">
            {filtered.length > 0 ? (
              <div className="fq-list">
                {filtered.map((faq, index) => {
                  const open = activeIndex === index;
                  return (
                    <div
                      key={faq?._id || faq?.id || index}
                      className={`fq-item${open ? " is-open" : ""}`}
                    >
                      <button
                        type="button"
                        className="fq-q"
                        onClick={() => toggle(index)}
                        aria-expanded={open}
                        aria-controls={`fq-panel-${index}`}
                        id={`fq-head-${index}`}
                      >
                        <span className="fq-num">{pad(index + 1)}</span>
                        <span className="fq-qtext">{getQuestion(faq)}</span>
                        <span className="fq-icon" aria-hidden="true" />
                      </button>

                      <div
                        id={`fq-panel-${index}`}
                        role="region"
                        aria-labelledby={`fq-head-${index}`}
                        className="fq-a"
                      >
                        <div className="fq-aInner">
                          <p>{getAnswer(faq)}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="fq-empty">
                <div className="fq-emptyIcon" aria-hidden="true">
                  ?
                </div>
                <h3>
                  {list.length === 0
                    ? "No FAQs available right now"
                    : "No matching questions found"}
                </h3>
                <p>
                  {list.length === 0
                    ? "Please check back later or contact the office for help."
                    : "Try a different keyword or clear the search."}
                </p>
                {query && (
                  <button
                    type="button"
                    className="fq-clear"
                    onClick={() => setQuery("")}
                  >
                    Clear search
                  </button>
                )}
              </div>
            )}

            {/* ---------- CTA ---------- */}
            <div className="fq-cta">
              <div>
                <h3>Still have questions?</h3>
                <p>Our team usually responds within two working days.</p>
              </div>
              <Link href="/contact" className="fq-ctaBtn">
                Contact Office
                <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
                  <path
                    d="M2 8h11M9 3.5 13.5 8 9 12.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .fq-page {
          --fq-navy: #192f59;
          --fq-blue: #2f6fed;
          --fq-soft: #f4f7fc;
          --fq-line: #e3e9f3;
          --fq-text: #3d4a63;
          background: var(--fq-soft);
          color: var(--fq-text);
        }

        .fq-container {
          width: min(1180px, calc(100% - 32px));
          margin: 0 auto;
        }

        /* ---------- Hero ---------- */
        .fq-hero {
          position: relative;
          padding: 72px 0 96px;
          text-align: center;
          color: #fff;
          background:
            radial-gradient(circle at 15% 20%, rgba(255,255,255,0.12), transparent 40%),
            radial-gradient(circle at 85% 80%, rgba(47,111,237,0.35), transparent 45%),
            linear-gradient(135deg, #192f59 0%, #1f4a8f 100%);
        }

        .fq-badge {
          display: inline-block;
          padding: 7px 14px;
          border-radius: 999px;
          background: rgba(255,255,255,0.14);
          font-size: 0.74rem;
          font-weight: 800;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .fq-title {
          margin: 18px 0 12px;
          font-size: clamp(2rem, 5vw, 3.4rem);
          font-weight: 900;
          letter-spacing: -0.03em;
          line-height: 1.05;
          color: #fff;
        }

        .fq-lead {
          max-width: 56ch;
          margin: 0 auto 28px;
          color: rgba(255,255,255,0.82);
          font-size: 1.02rem;
          line-height: 1.7;
        }

        .fq-search {
          position: relative;
          max-width: 560px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0 20px;
          height: 58px;
          border-radius: 999px;
          background: #fff;
          color: #6b7a99;
          box-shadow: 0 18px 40px rgba(8, 22, 54, 0.28);
        }

        .fq-search input {
          flex: 1;
          height: 100%;
          border: 0;
          outline: 0;
          background: transparent;
          color: var(--fq-navy);
          font-size: 1rem;
        }

        .fq-count {
          margin: 16px 0 0;
          font-size: 0.86rem;
          color: rgba(255,255,255,0.75);
        }

        /* ---------- Body ---------- */
        .fq-body {
          margin-top: -44px;
          padding-bottom: 72px;
          position: relative;
        }

        .fq-grid {
          display: grid;
          grid-template-columns: 0.8fr 1.4fr;
          gap: 32px;
          align-items: start;
        }

        .fq-aside {
          position: sticky;
          top: 24px;
        }

        .fq-imageCard {
          padding: 14px;
          border-radius: 26px;
          background: #fff;
          border: 1px solid var(--fq-line);
          box-shadow: 0 20px 48px rgba(25, 47, 89, 0.1);
        }

        .fq-image {
          width: 100%;
          height: auto;
          border-radius: 18px;
          display: block;
        }

        /* ---------- Accordion ---------- */
        .fq-list {
          display: grid;
          gap: 14px;
        }

        .fq-item {
          border-radius: 20px;
          background: #fff;
          border: 1px solid var(--fq-line);
          box-shadow: 0 8px 22px rgba(25, 47, 89, 0.06);
          transition: border-color 0.25s ease, box-shadow 0.25s ease, transform 0.25s ease;
        }

        .fq-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 14px 30px rgba(25, 47, 89, 0.1);
        }

        .fq-item.is-open {
          border-color: var(--fq-blue);
          box-shadow: 0 16px 36px rgba(47, 111, 237, 0.16);
        }

        .fq-q {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px 22px;
          border: 0;
          background: transparent;
          text-align: left;
          cursor: pointer;
          border-radius: 20px;
        }

        .fq-q:focus-visible {
          outline: 3px solid rgba(47, 111, 237, 0.45);
          outline-offset: 2px;
        }

        .fq-num {
          flex: none;
          width: 42px;
          height: 42px;
          display: grid;
          place-items: center;
          border-radius: 12px;
          background: #eaf0ff;
          color: var(--fq-blue);
          font-size: 0.86rem;
          font-weight: 800;
          transition: background 0.25s ease, color 0.25s ease;
        }

        .fq-item.is-open .fq-num {
          background: var(--fq-blue);
          color: #fff;
        }

        .fq-qtext {
          flex: 1;
          color: var(--fq-navy);
          font-size: 1.04rem;
          font-weight: 700;
          line-height: 1.45;
        }

        .fq-icon {
          position: relative;
          flex: none;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #eef2fa;
          transition: background 0.25s ease, transform 0.3s ease;
        }

        .fq-icon::before,
        .fq-icon::after {
          content: "";
          position: absolute;
          top: 50%;
          left: 50%;
          width: 12px;
          height: 2px;
          border-radius: 2px;
          background: var(--fq-navy);
          transform: translate(-50%, -50%);
          transition: transform 0.3s ease, background 0.25s ease;
        }

        .fq-icon::after {
          transform: translate(-50%, -50%) rotate(90deg);
        }

        .fq-item.is-open .fq-icon {
          background: var(--fq-blue);
        }

        .fq-item.is-open .fq-icon::before,
        .fq-item.is-open .fq-icon::after {
          background: #fff;
        }

        .fq-item.is-open .fq-icon::after {
          transform: translate(-50%, -50%) rotate(0deg);
        }

        /* smooth open/close without JS height calc */
        .fq-a {
          display: grid;
          grid-template-rows: 0fr;
          transition: grid-template-rows 0.35s ease;
        }

        .fq-item.is-open .fq-a {
          grid-template-rows: 1fr;
        }

        .fq-aInner {
          overflow: hidden;
        }

        .fq-aInner p {
          margin: 0;
          padding: 0 22px 22px 80px;
          color: var(--fq-text);
          font-size: 0.98rem;
          line-height: 1.8;
          white-space: pre-line;
        }

        /* ---------- Empty ---------- */
        .fq-empty {
          padding: 56px 24px;
          text-align: center;
          border-radius: 24px;
          background: #fff;
          border: 1px dashed var(--fq-line);
        }

        .fq-emptyIcon {
          width: 64px;
          height: 64px;
          margin: 0 auto 16px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          background: #eaf0ff;
          color: var(--fq-blue);
          font-size: 1.8rem;
          font-weight: 800;
        }

        .fq-empty h3 {
          margin: 0 0 8px;
          color: var(--fq-navy);
          font-size: 1.2rem;
          font-weight: 800;
        }

        .fq-empty p {
          margin: 0;
          color: var(--fq-text);
        }

        .fq-clear {
          margin-top: 18px;
          padding: 10px 22px;
          border: 0;
          border-radius: 999px;
          background: var(--fq-navy);
          color: #fff;
          font-weight: 700;
          cursor: pointer;
        }

        /* ---------- CTA ---------- */
        .fq-cta {
          margin-top: 28px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          padding: 26px 30px;
          border-radius: 24px;
          color: #fff;
          background: linear-gradient(135deg, #192f59 0%, #2f6fed 100%);
          box-shadow: 0 20px 44px rgba(25, 47, 89, 0.22);
        }

        .fq-cta h3 {
          margin: 0 0 4px;
          color: #fff;
          font-size: 1.25rem;
          font-weight: 800;
        }

        .fq-cta p {
          margin: 0;
          color: rgba(255,255,255,0.82);
          font-size: 0.94rem;
        }

        .fq-ctaBtn {
          flex: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 13px 24px;
          border-radius: 999px;
          background: #fff;
          color: var(--fq-navy);
          font-weight: 800;
          font-size: 0.9rem;
          text-decoration: none;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .fq-ctaBtn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 22px rgba(0, 0, 0, 0.2);
          color: var(--fq-navy);
        }

        /* ---------- Responsive ---------- */
        @media (max-width: 991px) {
          .fq-hero {
            padding: 56px 0 84px;
          }

          .fq-grid {
            grid-template-columns: 1fr;
          }

          .fq-aside {
            position: static;
            max-width: 520px;
            margin: 0 auto;
          }
        }

        @media (max-width: 640px) {
          .fq-q {
            padding: 16px;
            gap: 12px;
          }

          .fq-num {
            width: 36px;
            height: 36px;
          }

          .fq-qtext {
            font-size: 0.98rem;
          }

          .fq-aInner p {
            padding: 0 16px 18px 16px;
          }

          .fq-cta {
            flex-direction: column;
            align-items: flex-start;
            padding: 22px;
          }

          .fq-ctaBtn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </section>
  );
}