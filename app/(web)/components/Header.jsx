"use client";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import GoogleTranslate from "./GoogleTranslate";

/* Home page-er section id-gulo (page.js-er wrapper id-r sathe mil thakte hobe) */
const navLinks = [
  { label: "Home", id: "home" },
  { label: "Founder", id: "founder" },
  { label: "Notices", id: "notices" },
  { label: "Impact", id: "impact" },
  { label: "What We Do", id: "what-we-do" },
  { label: "Services", id: "services" },
];
const CONTACT_ID = "contact";
const SECTION_IDS = [...navLinks.map((l) => l.id), CONTACT_ID];

/* Fallback: office data te value na thakle */
const DEMO = {
  address: "Village Name, Post Office, District, West Bengal - 700000",
  phones: ["+91 98765 43210"],
  emails: ["info@example.com"],
};
const fallbackSocials = {
  facebook: "https://www.facebook.com/yourpage",
  youtube: "https://www.youtube.com/@yourchannel",
  instagram: "https://www.instagram.com/yourpage",
};

const toList = (...vals) => [
  ...new Set(
    vals
      .flatMap((v) =>
        Array.isArray(v) ? v : typeof v === "string" ? v.split(/[,;]/) : [],
      )
      .map((s) => String(s).trim())
      .filter(Boolean),
  ),
];

const Header = ({ data = {}, links = {}, bg = "" }) => {
  const pathname = usePathname() || "/";
  const isHome = pathname === "/";
  const [activeId, setActiveId] = useState("home");

  /* ---------- Dynamic contact (footer-er moto) ---------- */
  const name = data?.name || "TRUST WEBSITE";
  const address = data?.address || DEMO.address;

  const phones = toList(
    data?.phone,
    data?.mobile,
    data?.contact,
    data?.phone2,
  ).slice(0, 2);
  const phoneList = phones.length ? phones : DEMO.phones;

  const mails = toList(
    data?.emails,
    data?.email,
    data?.email1,
    data?.email2,
    data?.email3,
    data?.alternate_email,
  ).slice(0, 3);
  const mailList = mails.length ? mails : DEMO.emails;

  let waDigits = String(
    data?.whatsapp || data?.whatsapp_number || phoneList[0] || "",
  ).replace(/\D/g, "");
  if (waDigits.length === 10) waDigits = "91" + waDigits;
  const waLink = waDigits
    ? `https://wa.me/${waDigits}?text=${encodeURIComponent(`Hello ${name}, I would like some information.`)}`
    : "";

  const resolveAssetSrc = (value) => {
    if (typeof value !== "string") return "";
    const cleaned = value.trim();
    if (!cleaned) return "";
    if (/^https?:\/\//i.test(cleaned)) return cleaned;
    return `${process.env.NEXT_PUBLIC_BACKPUBLIC}/${cleaned.replace(/^public\//, "").replace(/^\/+/, "")}`;
  };

  /* ---------- Scroll spy: kon section screen-e ache ---------- */
  useEffect(() => {
    if (!isHome) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveId(e.target.id);
        });
      },
      { rootMargin: "-35% 0px -60% 0px", threshold: 0 },
    );

    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [isHome]);

  const isActive = (id) => isHome && activeId === id;

  return (
    <header className="header-root">
      <div className="header-root__backdrop" aria-hidden="true" />
      <div className="header-inner">
        {/* ---------- TOP BAR ---------- */}
        <div className="header-inner__top">
          <div className="header-top-left">
            <span className="header-kicker">{name}</span>
            <span className="ht-item ht-address" title={address}>
              <i className="fas fa-map-marker-alt"></i>
              {address}
            </span>
            <a href={`mailto:${mailList[0]}`} className="ht-item">
              <i className="far fa-envelope"></i>
              {mailList[0]}
            </a>
            <span className="ht-phones">
              {phoneList.map((p) => (
                <a
                  key={p}
                  href={`tel:${p.replace(/[^\d+]/g, "")}`}
                  className="ht-item"
                >
                  <i className="fa fa-phone"></i>
                  {p}
                </a>
              ))}
            </span>
          </div>
        </div>

        {/* ---------- MAIN ROW ---------- */}
        <div className="header-brand-strip">
          <div className="header-brand">
            <div className="header-brand__mark">
              {bg ? (
                <img src={resolveAssetSrc(bg)} alt="" aria-hidden="true" />
              ) : (
                <span>GP</span>
              )}
            </div>
            <div className="header-brand__copy">
              <span>Official Information Center</span>
              <h1>{name}</h1>
            </div>
          </div>

          <nav className="header-nav" aria-label="Main navigation">
            {navLinks.map(({ label, id }) => (
              <Link
                key={id}
                href={`/#${id}`}
                className={`header-nav__link${isActive(id) ? " is-active" : ""}`}
              >
                {label}
              </Link>
            ))}

            {/* Contact: click korle contact section-e scroll, hover korle dynamic dropdown */}
            <div className="header-nav__gallery">
              <Link
                href={`/#${CONTACT_ID}`}
                className={`header-nav__link${isActive(CONTACT_ID) ? " is-active" : ""}`}
              >
                Contact <i className="fa fa-angle-down"></i>
              </Link>
              <div className="header-nav__menu header-nav__menu--wide">
                <div className="header-nav__card">
                  {mailList.map((email) => (
                    <a
                      key={email}
                      href={`mailto:${email}`}
                      className="header-nav__item"
                    >
                      <i
                        className="far fa-envelope"
                        style={{ color: "#8262a1", marginRight: 8 }}
                      ></i>
                      {email}
                    </a>
                  ))}
                  {phoneList.map((p) => (
                    <a
                      key={p}
                      href={`tel:${p.replace(/[^\d+]/g, "")}`}
                      className="header-nav__item"
                    >
                      <i
                        className="fa fa-phone"
                        style={{ color: "#8262a1", marginRight: 8 }}
                      ></i>
                      {p}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </nav>

          <div className="header-right">
            <div className="header-translate">
              <GoogleTranslate />
            </div>
            {waLink && (
              <a
                href={waLink}
                className="ht-wa"
                target="_blank"
                rel="noreferrer noopener"
              >
                <i className="fab fa-whatsapp"></i>
                WhatsApp Enquiry
              </a>
            )}
            <div className="ht-socials">
              <a
                href={links?.facebook || fallbackSocials.facebook}
                target="_blank"
                rel="noreferrer noopener"
                aria-label="Facebook"
              >
                <i className="fab fa-facebook-f"></i>
              </a>
              <a
                href={links?.youtube || fallbackSocials.youtube}
                target="_blank"
                rel="noreferrer noopener"
                aria-label="YouTube"
              >
                <i className="fab fa-youtube"></i>
              </a>
              <a
                href={links?.instagram || fallbackSocials.instagram}
                target="_blank"
                rel="noreferrer noopener"
                aria-label="Instagram"
              >
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>

          <div className="header-metrics">
            <div className="header-metric">
              <span>Support</span>
              <strong>{phoneList[0]}</strong>
            </div>
            <div className="header-metric">
              <span>Access</span>
              <strong>Services, notices, media</strong>
            </div>
          </div>
        </div>
      </div>

      {waLink && (
        <a
          href={waLink}
          className="whatsapp-float"
          target="_blank"
          rel="noreferrer noopener"
          aria-label="Chat on WhatsApp"
        >
          <i className="fab fa-whatsapp"></i>
          <span>Chat on WhatsApp</span>
        </a>
      )}

      <style jsx>{`
        .header-root {
          --vu-cream: #efecf1;
          --vu-purple: #cdbdde;
          --vu-purple-soft: #eee9f2;
          --vu-ink: #1d1d1b;
          --vu-muted: #6f6f67;

          position: sticky;
          top: 0;
          z-index: 40;
          overflow: visible;
          background: var(--vu-cream);
          font-family: "Inter", sans-serif;
        }

        .header-root__backdrop {
          position: absolute;
          inset: 0;
          background: radial-gradient(
            circle at 100% 0%,
            rgba(130, 98, 161, 0.16),
            transparent 38%
          );
          pointer-events: none;
        }

        .header-inner {
          position: relative;
          z-index: 1;
          width: min(1240px, calc(100% - 32px));
          margin: 0 auto;
          padding: 6px 0 8px;
        }

        .header-inner__top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          flex-wrap: wrap;
          padding-bottom: 6px;
          border-bottom: 1px solid rgba(29, 29, 27, 0.12);
        }

        .header-top-left {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .header-kicker {
          display: inline-flex;
          align-items: center;
          padding: 4px 12px;
          border-radius: 999px;
          background: #7043a6;
          color: #fff;
          font-size: 0.58rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        /* top row contact */
        .ht-item {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: var(--vu-ink);
          font-size: 0.72rem;
          font-weight: 600;
          text-decoration: none;
          white-space: nowrap;
          transition: color 0.2s ease;
        }
        .ht-item i {
          color: #62477b;
        }
        a.ht-item:hover {
          color: #62477b;
        }
        .ht-address {
          max-width: 260px;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .ht-phones {
          display: inline-flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 4px 14px;
        }

        /* ---------- Main row ---------- */
        .header-brand-strip {
          display: grid;
          grid-template-columns: auto minmax(0, 1fr) auto;
          align-items: center;
          gap: 14px;
          padding-top: 8px;
        }

        .header-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 0;
        }

        .header-brand__mark {
          flex: 0 0 auto;
          width: 40px;
          height: 40px;
          border-radius: 14px;
          overflow: hidden;
          background: #7043a6;
          display: grid;
          place-items: center;
        }
        .header-brand__mark img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .header-brand__mark span {
          color: #fff;
          font-family: "Anton", sans-serif;
          font-size: 0.85rem;
          letter-spacing: 0.06em;
        }

        .header-brand__copy span {
          display: block;
          color: #62477b;
          font-size: 0.52rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          line-height: 1.2;
          text-transform: uppercase;
        }
        .header-brand__copy h1 {
          margin: 0;
          color: var(--vu-ink);
          font-family: "Anton", "Impact", sans-serif;
          font-size: 1.3rem;
          line-height: 1.05;
          font-weight: 400;
          letter-spacing: 0.01em;
          text-transform: uppercase;
          white-space: nowrap;
        }

        /* ---------- Nav ---------- */
        .header-nav {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: nowrap;
          gap: 0;
        }

        .header-root :global(.header-nav__link) {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 12px;
          border: none;
          border-radius: 999px;
          background: transparent;
          color: var(--vu-ink);
          font-family: "Inter", sans-serif;
          font-size: 0.68rem;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          text-decoration: none;
          white-space: nowrap;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .header-root :global(.header-nav__link:hover) {
          background: var(--vu-purple-soft);
          color: #62477b;
        }
        .header-root :global(.header-nav__link.is-active) {
          background: #7043a6;
          color: #fff;
        }

        .header-nav__gallery {
          position: relative;
        }

        .header-nav__menu {
          position: absolute;
          top: 100%;
          left: 0;
          padding-top: 8px;
          min-width: 190px;
          opacity: 0;
          visibility: hidden;
          transform: translateY(6px);
          transition: all 0.2s ease;
          z-index: 60;
        }
        .header-nav__menu--wide {
          min-width: 290px;
        }
        .header-nav__gallery:hover .header-nav__menu,
        .header-nav__gallery:focus-within .header-nav__menu {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }

        .header-nav__card {
          background: #fff;
          border-radius: 24px;
          padding: 8px;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.12);
        }

        .header-root :global(.header-nav__item) {
          display: block;
          padding: 10px 16px;
          border-radius: 16px;
          color: var(--vu-ink);
          font-size: 0.82rem;
          font-weight: 600;
          text-decoration: none;
          white-space: nowrap;
          transition: all 0.2s ease;
        }
        .header-root :global(.header-nav__item:hover) {
          background: var(--vu-cream);
          color: #62477b;
        }

        /* ---------- Right side ---------- */
        .header-right {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: nowrap;
        }

        .header-translate {
          padding: 0 8px;
          border-radius: 999px;
          background: #fff;
          border: 1.5px solid transparent;
          transition: border-color 0.2s ease;
        }
        .header-translate:hover {
          border-color: var(--vu-ink);
        }

        .ht-wa {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 14px;
          border-radius: 999px;
          background: #25d366;
          color: #fff;
          font-size: 0.64rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          text-decoration: none;
          white-space: nowrap;
          transition: transform 0.2s ease;
        }
        .ht-wa i {
          font-size: 0.9rem;
        }
        .ht-wa:hover {
          transform: translateY(-2px);
        }

        .ht-socials {
          display: flex;
          gap: 6px;
        }
        .ht-socials a {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 26px;
          height: 26px;
          border-radius: 50%;
          border: 1.5px solid var(--vu-ink);
          color: var(--vu-ink);
          font-size: 0.7rem;
          text-decoration: none;
          transition: all 0.2s ease;
        }
        .ht-socials a:hover {
          background: var(--vu-purple);
          border-color: var(--vu-purple);
        }

        /* ---------- Metrics (only very wide screens) ---------- */
        .header-metrics {
          display: none;
        }
        .header-metric {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 6px 14px;
          border-radius: 999px;
          background: #fff;
        }
        .header-metric span {
          color: var(--vu-muted);
          font-size: 0.58rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          white-space: nowrap;
        }
        .header-metric strong {
          color: var(--vu-ink);
          font-family: "Anton", sans-serif;
          font-size: 0.9rem;
          font-weight: 400;
          white-space: nowrap;
        }
        .header-metric:first-child strong {
          color: #62477b;
        }

        @media (min-width: 1650px) {
          .header-brand-strip {
            grid-template-columns: auto minmax(0, 1fr) auto auto;
          }
          .header-metrics {
            display: flex;
            gap: 6px;
          }
        }

        /* ---------- Tablet / mobile ---------- */
        @media (max-width: 1080px) {
          .header-brand-strip {
            grid-template-columns: 1fr auto;
            row-gap: 8px;
          }
          .header-nav {
            grid-column: 1 / -1;
            order: 3;
            justify-content: flex-start;
            flex-wrap: wrap;
          }
          .header-right {
            order: 2;
          }
        }

        @media (max-width: 640px) {
          .header-brand-strip {
            grid-template-columns: 1fr;
          }
          .header-right {
            flex-wrap: wrap;
          }
          .header-brand__mark {
            width: 36px;
            height: 36px;
            border-radius: 12px;
          }
          .header-brand__copy h1 {
            font-size: 1.15rem;
          }
        }

        /* ---------- Floating WhatsApp ---------- */
        .whatsapp-float {
          position: fixed;
          right: 20px;
          bottom: 20px;
          z-index: 70;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 12px 20px;
          border-radius: 999px;
          background: #25d366;
          color: #fff;
          font-size: 0.8rem;
          font-weight: 700;
          text-decoration: none;
          box-shadow: 0 10px 24px rgba(37, 211, 102, 0.45);
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease;
        }
        .whatsapp-float i {
          font-size: 1.5rem;
        }
        .whatsapp-float:hover {
          transform: translateY(-3px);
          box-shadow: 0 14px 28px rgba(37, 211, 102, 0.55);
        }
        @media (max-width: 640px) {
          .whatsapp-float {
            padding: 14px;
          }
          .whatsapp-float span {
            display: none;
          }
        }
      `}</style>
    </header>
  );
};

export default Header;
