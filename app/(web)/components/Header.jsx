"use client";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import GoogleTranslate from "./GoogleTranslate";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/About" },
  { label: "Services", href: "/service" },
  { label: "Team", href: "/Team" },

];

// ===== EDIT THESE =====
const whatsappNumber = "919876543210"; // country code + number, no "+", spaces or dashes
const whatsappMessage = "Hello, I would like some information.";
const contactEmails = [
  "info@example.com",
  "support@example.com",
  "office@example.com",
];
const contactPhone = "+91 98765 43210";

// ===== INFO BAR: EDIT THESE =====
const officeAddress = "Village Name, Post Office, District, West Bengal - 700000";
const officeEmail = "info@example.com";
const officePhones = ["+91 98765 43210", "+91 98765 43211", "+91 98765 43212"];
const socialLinks = {
  facebook: "https://www.facebook.com/yourpage",
  youtube: "https://www.youtube.com/@yourchannel",
  instagram: "https://www.instagram.com/yourpage",
};

// TODO: replace with the real items from your old NavBar's Gallery dropdown
const galleryLinks = [
  { label: "Photo Gallery", href: "/gallery" },
  { label: "Video Gallery", href: "/video-gallery" },
];

const Header = ({ data, links = {}, bg = "" }) => {
  const pathname = usePathname() || "/";
  const [galleryOpen, setGalleryOpen] = useState(false);

  const isActive = (href) =>
    href === "/"
      ? pathname === "/"
      : pathname.toLowerCase().startsWith(href.toLowerCase());
  const resolveAssetSrc = (value) => {
    if (typeof value !== "string") return "";
    const cleaned = value.trim();
    if (!cleaned) return "";
    if (/^https?:\/\//i.test(cleaned)) return cleaned;
    return `${process.env.NEXT_PUBLIC_BACKPUBLIC}/${cleaned.replace(/^public\//, "").replace(/^\/+/, "")}`;
  };

  return (
    <header className="header-root">
      <div className="header-root__backdrop" aria-hidden="true" />
      <div className="header-inner">
        <div className="header-inner__top">
          <div className="header-top-left">
            <span className="header-kicker">TRUST WEBSITE TRUST WEBSITE</span>
            <span className="ht-item ht-address" title={officeAddress}>
              <i className="fas fa-map-marker-alt"></i>
              {officeAddress}
            </span>
            <a href={`mailto:${officeEmail}`} className="ht-item">
              <i className="far fa-envelope"></i>
              {officeEmail}
            </a>
            <span className="ht-phones">
              {officePhones.map((p) => (
                <a key={p} href={`tel:${p.replace(/\s/g, "")}`} className="ht-item">
                  <i className="fa fa-phone"></i>
                  {p}
                </a>
              ))}
            </span>
          </div>

          
        </div>

        <div className="header-brand-strip">
          <div className="header-brand">
            <div className="header-brand__mark">
              {bg ? <img src={resolveAssetSrc(bg)} alt="" aria-hidden="true" /> : <span>GP</span>}
            </div>
            <div className="header-brand__copy">
              <span>Official Information Center</span>
              <h1>{data?.name || "TRUST WEBSITE"}</h1>
              <p>
                A clean, modern interface for village notices, services, public communication, and citizen support.
              </p>
            </div>
          </div>

          <nav className="header-nav" aria-label="Main navigation">
            {navLinks.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className={`header-nav__link${isActive(href) ? " is-active" : ""}`}
              >
                {label}
              </Link>
            ))}

            <div className="header-nav__gallery">
              <Link
                href="/contact"
                className={`header-nav__link${isActive("/contact") ? " is-active" : ""}`}
              >
                Contact <i className="fa fa-angle-down"></i>
              </Link>
              <div className="header-nav__menu header-nav__menu--wide">
                <div className="header-nav__card">
                  {contactEmails.map((email) => (
                    <a key={email} href={`mailto:${email}`} className="header-nav__item">
                      <i className="far fa-envelope" style={{ color: "#8262a1", marginRight: 8 }}></i>
                      {email}
                    </a>
                  ))}
                  <a href={`tel:${contactPhone.replace(/\s/g, "")}`} className="header-nav__item">
                    <i className="fa fa-phone" style={{ color: "#8262a1", marginRight: 8 }}></i>
                    {contactPhone}
                  </a>
                </div>
              </div>
            </div>

            <div className="header-nav__gallery">
              <button
                type="button"
                className="header-nav__link header-nav__gallery-btn"
                aria-expanded={galleryOpen}
                onClick={() => setGalleryOpen((o) => !o)}
              >
                Gallery <i className="fa fa-angle-down"></i>
              </button>
              <div className={`header-nav__menu${galleryOpen ? " is-open" : ""}`}>
                <div className="header-nav__card">
                  {galleryLinks.map(({ label, href }) => (
                    <Link
                      key={href}
                      href={href}
                      className="header-nav__item"
                      onClick={() => setGalleryOpen(false)}
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </nav>




          <div className="header-right">
            <div className="header-translate">
              <GoogleTranslate />
            </div>
            <a
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`}
              className="ht-wa"
              target="_blank"
              rel="noreferrer"
            >
              <i className="fab fa-whatsapp"></i>
              WhatsApp Enquiry
            </a>
            <div className="ht-socials">
              <a href={links?.facebook || socialLinks.facebook} target="_blank" rel="noreferrer" aria-label="Facebook">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href={links?.youtube || socialLinks.youtube} target="_blank" rel="noreferrer" aria-label="YouTube">
                <i className="fab fa-youtube"></i>
              </a>
              <a href={links?.instagram || socialLinks.instagram} target="_blank" rel="noreferrer" aria-label="Instagram">
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>

          <div className="header-metrics">
            <div className="header-metric">
              <span>Support</span>
              <strong>{data?.mobile ? `+91 ${data.mobile}` : "Available on record"}</strong>
            </div>
            <div className="header-metric">
              <span>Access</span>
              <strong>Services, notices, media</strong>
            </div>
          </div>
        </div>
      </div>


           <a
        href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`}
        className="whatsapp-float"
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
      >
        <i className="fab fa-whatsapp"></i>
        <span>Chat on WhatsApp</span>
      </a>

      <style jsx>{`
        .header-root {
          --vu-cream: #efecf1;
          --vu-purple: #cdbdde;
          --vu-purple-soft: #eee9f2;
          --vu-ink: #1d1d1b;
          --vu-muted: #6f6f67;

          position: relative;
          z-index: 40;
          overflow: visible;
          background: var(--vu-cream);
          font-family: "Inter", sans-serif;
          border-bottom: none;
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
          padding: 14px 0 20px;
        }

        .header-inner__top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
          padding-bottom: 14px;
          border-bottom: 1px solid rgba(29, 29, 27, 0.12);
        }

        .header-top-left,
        .header-top-right {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        /* coral pill tag */
        .header-kicker {
          display: inline-flex;
          align-items: center;
          padding: 8px 16px;
          border-radius: 999px;
          background: #7043a6;
          color: #fff;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .header-contact {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: var(--vu-ink);
          text-decoration: none;
          font-size: 0.85rem;
          font-weight: 600;
          transition: color 0.2s ease;
        }

        .header-contact i {
          color: #62477b;
        }

        .header-contact:hover {
          color: #62477b;
        }

        /* white pill around translate widget */
        .header-translate {
          padding: 6px 14px;
          border-radius: 999px;
          background: #fff;
          border: 1.5px solid transparent;
          box-shadow: none;
          transition: border-color 0.2s ease;
        }

        .header-translate:hover {
          border-color: var(--vu-ink);
        }

        /* outlined round social buttons */
        .header-socials {
          display: flex;
          gap: 8px;
        }

        .header-socials a {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: transparent;
          border: 1.5px solid var(--vu-ink);
          color: var(--vu-ink);
          text-decoration: none;
          font-size: 0.85rem;
          transition: all 0.2s ease;
        }

        .header-socials a:hover {
          transform: translateY(-2px);
          background: var(--vu-purple);
          border-color: var(--vu-purple);
          color: #1d1d1b;
        }

        .header-brand-strip {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          flex-wrap: wrap;
          padding-top: 22px;
        }

        .header-brand {
          display: flex;
          align-items: center;
          gap: 20px;
          min-width: min(640px, 100%);
        }

        .header-brand__mark {
          flex: 0 0 auto;
          width: 84px;
          height: 84px;
          border-radius: 28px;
          overflow: hidden;
          background: #7043a6;
          display: grid;
          place-items: center;
          box-shadow: none;
        }

        .header-brand__mark img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .header-brand__mark span {
          color: #fff;
          font-family: "Anton", sans-serif;
          font-size: 1.5rem;
          font-weight: 400;
          letter-spacing: 0.06em;
        }

        .header-brand__copy span {
          display: block;
          color: #62477b;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        /* big condensed uppercase heading */
        .header-brand__copy h1 {
          margin: 4px 0 8px;
          color: var(--vu-ink);
          font-family: "Anton", "Impact", sans-serif;
          font-size: clamp(2rem, 3.6vw, 3.4rem);
          line-height: 1.02;
          font-weight: 400;
          letter-spacing: 0.01em;
          text-transform: uppercase;
        }

        .header-brand__copy p {
          margin: 0;
          max-width: 62ch;
          color: var(--vu-muted);
          line-height: 1.65;
          font-size: 0.95rem;
        }

        .header-metrics {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          justify-content: flex-end;
        }

        /* big rounded white stat cards */
        .header-metric {
          min-width: 200px;
          padding: 18px 22px;
          border-radius: 28px;
          background: #fff;
          border: none;
          box-shadow: none;
          transition: transform 0.25s ease, background 0.25s ease;
        }

        .header-metric:hover {
          transform: translateY(-3px);
        }

        .header-metric span {
          display: block;
          color: var(--vu-muted);
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .header-metric strong {
          display: block;
          margin-top: 10px;
          color: var(--vu-ink);
          font-family: "Anton", sans-serif;
          font-size: 1.15rem;
          font-weight: 400;
          letter-spacing: 0.02em;
          line-height: 1.3;
        }

        .header-metric:first-child strong {
          color: #62477b;
        }

        @media (max-width: 920px) {
          .header-inner {
            width: min(100%, calc(100% - 20px));
          }

          .header-brand {
            min-width: 100%;
          }

          .header-metrics {
            width: 100%;
            justify-content: flex-start;
          }

          .header-metric {
            flex: 1 1 220px;
          }
        }

        @media (max-width: 640px) {
          .header-brand-strip {
            padding-top: 16px;
          }

          .header-brand {
            align-items: flex-start;
          }

          .header-brand__mark {
            width: 64px;
            height: 64px;
            border-radius: 22px;
          }

          .header-brand__copy p {
            font-size: 0.9rem;
          }

          .header-contact span {
            font-size: 0.82rem;
          }
        }

        /* ===== Compact overrides ===== */
        .header-inner {
          padding: 8px 0 10px;
        }

        .header-inner__top {
          padding-bottom: 8px;
          gap: 10px;
        }

        .header-top-left,
        .header-top-right {
          gap: 10px;
        }

        .header-kicker {
          padding: 5px 12px;
          font-size: 0.62rem;
        }

        .header-contact {
          font-size: 0.78rem;
        }

        .header-translate {
          padding: 2px 10px;
        }

        .header-socials a {
          width: 28px;
          height: 28px;
          font-size: 0.72rem;
        }

        .header-brand-strip {
          padding-top: 10px;
          gap: 12px;
          flex-wrap: nowrap;
        }

        .header-brand {
          gap: 12px;
          min-width: 0;
        }

        .header-brand__mark {
          width: 48px;
          height: 48px;
          border-radius: 16px;
        }

        .header-brand__mark span {
          font-size: 1rem;
        }

        .header-brand__copy span {
          font-size: 0.6rem;
        }

        .header-brand__copy h1 {
          margin: 0;
          font-size: clamp(1.3rem, 2vw, 1.8rem);
          line-height: 1.05;
        }

        .header-brand__copy p {
          display: none;
        }

        .header-metrics {
          gap: 8px;
          flex-wrap: nowrap;
        }

        .header-metric {
          flex: 0 1 auto;
          min-width: 0;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 18px;
          border-radius: 999px;
        }

        .header-metric:hover {
          transform: none;
        }

        .header-metric span {
          font-size: 0.58rem;
          white-space: nowrap;
        }

        .header-metric strong {
          margin-top: 0;
          font-size: 0.9rem;
          white-space: nowrap;
        }

        @media (max-width: 920px) {
          .header-brand-strip {
            flex-wrap: wrap;
          }

          .header-brand {
            min-width: 100%;
          }

          .header-metrics {
            flex-wrap: wrap;
          }
        }

        @media (max-width: 640px) {
          .header-brand__mark {
            width: 42px;
            height: 42px;
            border-radius: 14px;
          }

          .header-metrics {
            display: none;
          }

          .header-brand__copy h1 {
            font-size: 1.25rem;
          }
        }

        /* ===== Nav inside portal row ===== */
        .header-root {
          overflow: visible;
        }

        .header-brand-strip {
          gap: 16px;
        }

        .header-brand {
          flex: 0 1 auto;
        }

        .header-brand__copy h1 {
          white-space: nowrap;
          max-width: 300px;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .header-nav {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 2px;
          flex: 1 1 auto;
        }

        .header-root :global(.header-nav__link) {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border: none;
          border-radius: 999px;
          background: transparent;
          color: var(--vu-ink);
          font-family: "Inter", sans-serif;
          font-size: 0.74rem;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          text-decoration: none;
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

        .header-nav__gallery:hover .header-nav__menu,
        .header-nav__gallery:focus-within .header-nav__menu,
        .header-nav__menu.is-open {
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
          transition: all 0.2s ease;
        }

        .header-root :global(.header-nav__item:hover) {
          background: var(--vu-cream);
          color: #62477b;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 8px;
          flex: 0 0 auto;
        }

        .header-root :global(.header-btn) {
          display: inline-flex;
          align-items: center;
          padding: 9px 20px;
          border-radius: 999px;
          font-family: "Inter", sans-serif;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          text-decoration: none;
          white-space: nowrap;
          transition: all 0.2s ease;
        }

        .header-root :global(.header-btn--outline) {
          border: 1.5px solid var(--vu-ink);
          color: var(--vu-ink);
          background: transparent;
        }

        .header-root :global(.header-btn--outline:hover) {
          background: var(--vu-ink);
          color: #fff;
        }

        .header-root :global(.header-btn--solid) {
          border: 1.5px solid var(--vu-purple);
          background: var(--vu-purple);
          color: #1d1d1b;
        }

        .header-root :global(.header-btn--solid:hover) {
          background: transparent;
          color: #62477b;
        }

        /* Metrics only when there is room */
        @media (max-width: 1399px) {
          .header-metrics {
            display: none;
          }
        }

        @media (max-width: 992px) {
          .header-brand {
            min-width: 0;
            flex: 1 1 auto;
          }

          .header-actions {
            order: 2;
          }

          .header-nav {
            order: 3;
            flex-basis: 100%;
            flex-wrap: wrap;
            justify-content: flex-start;
          }
        }

        @media (max-width: 640px) {
          .header-actions {
            flex-basis: 100%;
          }

          .header-root :global(.header-btn) {
            flex: 1;
            justify-content: center;
          }
        }

        /* ===== Clean compact layout (keep this block LAST) ===== */
        .header-inner {
          padding: 6px 0 8px;
        }

        .header-inner__top {
          padding-bottom: 6px;
        }

        .header-kicker {
          padding: 4px 12px;
          font-size: 0.58rem;
        }

        .header-contact {
          font-size: 0.74rem;
        }

        .header-translate {
          padding: 0 8px;
        }

        .header-socials a {
          width: 26px;
          height: 26px;
          font-size: 0.68rem;
        }

        /* One tidy row: brand | nav | buttons (| metrics on very wide screens) */
        .header-brand-strip {
          display: grid;
          grid-template-columns: auto minmax(0, 1fr) auto;
          align-items: center;
          gap: 14px;
          flex-wrap: nowrap;
          padding-top: 8px;
        }

        .header-brand {
          flex: none;
          min-width: 0;
          gap: 10px;
        }

        .header-brand__mark {
          width: 40px;
          height: 40px;
          border-radius: 14px;
        }

        .header-brand__mark span {
          font-size: 0.85rem;
        }

        .header-brand__copy span {
          font-size: 0.52rem;
          letter-spacing: 0.12em;
          line-height: 1.2;
        }

        .header-brand__copy h1 {
          max-width: none;
          overflow: visible;
          text-overflow: clip;
          white-space: nowrap;
          font-size: 1.3rem;
          line-height: 1.05;
        }

        .header-nav {
          justify-content: center;
          flex-wrap: nowrap;
          gap: 0;
        }

        .header-root :global(.header-nav__link) {
          padding: 7px 12px;
          font-size: 0.68rem;
          white-space: nowrap;
        }

        .header-actions {
          gap: 6px;
        }

        .header-root :global(.header-btn) {
          padding: 8px 16px;
          font-size: 0.66rem;
        }

        .header-metrics {
          display: none;
        }

        @media (min-width: 1650px) {
          .header-brand-strip {
            grid-template-columns: auto minmax(0, 1fr) auto auto;
          }

          .header-metrics {
            display: flex;
            flex-wrap: nowrap;
            gap: 6px;
          }

          .header-metric {
            padding: 6px 14px;
          }
        }

        /* Tablet and mobile: stack neatly */
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

          .header-actions {
            order: 2;
          }
        }

        @media (max-width: 640px) {
          .header-brand-strip {
            grid-template-columns: 1fr;
          }

          .header-actions {
            order: 2;
            width: 100%;
          }

          .header-root :global(.header-btn) {
            flex: 1;
            justify-content: center;
          }

          .header-brand__copy h1 {
            font-size: 1.15rem;
          }
        }

        /* old social icons are replaced by the info bar */
        .header-socials {
          display: none;
        }

        /* info bar */
        .header-info {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px 16px;
          flex-wrap: wrap;
          margin-bottom: 8px;
          padding: 7px 16px;
          border-radius: 999px;
          background: var(--vu-ink);
        }

        .header-info__items,
        .header-info__right {
          display: flex;
          align-items: center;
          gap: 6px 18px;
          flex-wrap: wrap;
        }

        .header-info__item {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          color: #fff;
          font-size: 0.72rem;
          font-weight: 500;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .header-info__item i {
          color: #62477b;
        }

        a.header-info__item:hover {
          color: #62477b;
        }

        .header-info__wa {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 5px 14px;
          border-radius: 999px;
          background: #25d366;
          color: #fff;
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          text-decoration: none;
          transition: transform 0.2s ease;
        }

        .header-info__wa i {
          font-size: 0.95rem;
        }

        .header-info__wa:hover {
          transform: translateY(-2px);
        }

        .header-info__socials {
          display: flex;
          gap: 6px;
        }

        .header-info__socials a {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 26px;
          height: 26px;
          border-radius: 50%;
          border: 1.5px solid #fff;
          color: #fff;
          font-size: 0.7rem;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .header-info__socials a:hover {
          background: var(--vu-purple);
          border-color: var(--vu-purple);
          transform: translateY(-2px);
        }

        @media (max-width: 1080px) {
          .header-info {
            border-radius: 18px;
          }
        }

        /* contact block (replaces the two buttons) */
        .hc {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .hc__lines {
          display: flex;
          flex-direction: column;
          gap: 2px;
          max-width: 270px;
        }

        .hc__phones {
          display: flex;
          flex-wrap: wrap;
          gap: 2px 10px;
        }

        .hc__line {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: var(--vu-ink);
          font-size: 0.66rem;
          font-weight: 600;
          line-height: 1.35;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .hc__line i {
          color: #62477b;
          font-size: 0.65rem;
        }

        a.hc__line:hover {
          color: #62477b;
        }

        .hc__side {
          display: flex;
          flex-direction: column;
          align-items: stretch;
          gap: 6px;
        }

        .hc__wa {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 6px 14px;
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

        .hc__wa:hover {
          transform: translateY(-2px);
        }

        .hc__socials {
          display: flex;
          justify-content: center;
          gap: 6px;
        }

        .hc__socials a {
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

        .hc__socials a:hover {
          background: var(--vu-purple);
          border-color: var(--vu-purple);
          color: #1d1d1b;
        }

        @media (max-width: 640px) {
          .hc {
            flex-wrap: wrap;
          }
        }

        /* top row contact content */
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
          color: #1d1d1b;
        }

        /* right side of the main row */
        .header-right {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: nowrap;
        }

        @media (max-width: 1080px) {
          .header-right {
            order: 2;
          }
        }

        @media (max-width: 640px) {
          .header-right {
            flex-wrap: wrap;
          }
        }

        /* wider dropdown for emails */
        .header-nav__menu--wide {
          min-width: 290px;
        }

        .header-root :global(.header-nav__item) {
          white-space: nowrap;
        }

        /* floating WhatsApp button */
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
          font-family: "Inter", sans-serif;
          font-size: 0.8rem;
          font-weight: 700;
          text-decoration: none;
          box-shadow: 0 10px 24px rgba(37, 211, 102, 0.45);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
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

        /* keep header visible; panels stop under it */
        .header-root {
          position: sticky;
          top: 0;
        }
      `}</style>
    </header>
  );
};

export default Header;
