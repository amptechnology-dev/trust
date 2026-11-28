"use client";

import Link from "next/link";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaLinkedin,
  FaWhatsapp,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaEnvelope,
} from "react-icons/fa";

/* Placeholder content, used only when the office data has no value for a field. */
const DEMO = {
  name: "Your NGO Name",
  motive:
    "Working together with communities to create lasting change through education, health, livelihood and social welfare programmes.",
  address: "Street Address, City, State - 000000, India",
  phones: ["+91 00000 00000"],
  emails: ["info@example.org", "support@example.org", "office@example.org"],
};

const MAIL_LABELS = ["General Enquiries", "Support", "Office"];

const NAV_LINKS = [
  { label: "About Us", href: "/About" },
  { label: "Chairman's Desk", href: "/Desk" },
  { label: "Our Team", href: "/Team" },
  { label: "Projects & Activities", href: "/project" },
  { label: "Services", href: "/service" },
  { label: "Gallery", href: "/gallery" },
  { label: "Videos", href: "/videos" },
  { label: "Tenders", href: "/Tender" },
  { label: "Notifications", href: "/Notificatons" },
  { label: "Contact Us", href: "/contact" },
];

const toList = (...vals) =>
  [
    ...new Set(
      vals
        .flatMap((v) => (Array.isArray(v) ? v : typeof v === "string" ? v.split(/[,;]/) : []))
        .map((s) => String(s).trim())
        .filter(Boolean)
    ),
  ];

export default function Footer({ data = {}, links = {}, bg = "" }) {
  const backgroundSrc =
    typeof bg === "string" && bg
      ? `${process.env.NEXT_PUBLIC_BACKPUBLIC}/${bg.replace(/^\/+/, "")}`
      : "";

  const name = data?.name || DEMO.name;
  const motive = data?.motive || data?.mission || data?.tagline || DEMO.motive;
  const address = data?.address || DEMO.address;

  const phones = toList(data?.phone, data?.mobile, data?.contact, data?.phone2).slice(0, 2);
  const phoneList = phones.length ? phones : DEMO.phones;

  const mails = toList(data?.emails, data?.email, data?.email1, data?.email2, data?.email3, data?.alternate_email).slice(0, 3);
  const mailList = mails.length ? mails : DEMO.emails;

  // WhatsApp number: dedicated field, else first phone. 10-digit numbers get the India code (91).
  let waDigits = String(data?.whatsapp || data?.whatsapp_number || phoneList[0] || "").replace(/\D/g, "");
  if (waDigits.length === 10) waDigits = "91" + waDigits;
  const waLink = waDigits
    ? `https://wa.me/${waDigits}?text=${encodeURIComponent(`Hello ${name}, I would like to make an enquiry.`)}`
    : "";

  const navLinks = [
    ...NAV_LINKS,
    ...(data?.enabled_services?.includes("faq") ? [{ label: "FAQ", href: "/faq" }] : []),
    ...(data?.enabled_services?.includes("grievance") ? [{ label: "Grievance", href: "/grievance" }] : []),
  ];

  const socials = [
    { key: "facebook", icon: <FaFacebook />, label: "Facebook" },
    { key: "instagram", icon: <FaInstagram />, label: "Instagram" },
    { key: "youtube", icon: <FaYoutube />, label: "YouTube" },
    { key: "twitter", icon: <FaTwitter />, label: "Twitter" },
    { key: "linkedin", icon: <FaLinkedin />, label: "LinkedIn" },
  ].filter((s) => links?.[s.key]);

  return (
    <footer
      id="footer"
      style={{
        backgroundImage: backgroundSrc
          ? `linear-gradient(180deg, rgba(231, 225, 237, 0.96) 0%, rgba(218, 209, 227, 0.98) 100%), url(${backgroundSrc})`
          : "linear-gradient(180deg, #e9e3ee 0%, #dcd3e4 100%)",
      }}
    >
      <div className="container position-relative">
        <div className="footer-grid">
          {/* ---------- 1. BRAND ---------- */}
          <div className="footer-col footer-brand">
            <h3 className="footer-logo">{name}</h3>
            <p>{motive}</p>

            {socials.length > 0 && (
              <div className="footer-social">
                {socials.map((s) => (
                  <a
                    key={s.key}
                    href={links[s.key]}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={s.label}
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* ---------- 2. NAVIGATION ---------- */}
          <nav className="footer-col" aria-label="Footer navigation">
            <h4>Explore</h4>
            <ul className="footer-links">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* ---------- 3. CONTACT ---------- */}
          <div className="footer-col">
            <h4>Contact</h4>
            <ul className="footer-contact">
              <li>
                <FaMapMarkerAlt aria-hidden="true" />
                <span>{address}</span>
              </li>
              {phoneList.map((p) => (
                <li key={p}>
                  <FaPhoneAlt aria-hidden="true" />
                  <a href={`tel:${p.replace(/[^\d+]/g, "")}`}>{p}</a>
                </li>
              ))}
            </ul>

            {waLink && (
              <a href={waLink} target="_blank" rel="noreferrer noopener" className="wa-btn">
                <FaWhatsapp /> WhatsApp Enquiry
              </a>
            )}
          </div>

          {/* ---------- 4. MAILS ---------- */}
          <div className="footer-col">
            <h4>Write To Us</h4>
            <div className="mail-list">
              {mailList.map((m, i) => (
                <a key={m} href={`mailto:${m}`} className="mail-item">
                  <span className="hex">
                    <FaEnvelope aria-hidden="true" />
                  </span>
                  <span className="mail-text">
                    <small>{MAIL_LABELS[i] || `Email ${i + 1}`}</small>
                    <strong>{m}</strong>
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="copyright">
            &copy; Copyright <strong>{name}</strong>. All Rights Reserved
          </div>
          <div className="credits">
            Designed and Developed by{" "}
            <a href="https://amptechnology.in" target="_blank" rel="noreferrer noopener">
              AmpTechnology
            </a>
          </div>
        </div>
      </div>

           <style jsx>{`
        #footer {
          position: relative;
          padding: 34px 0 14px;
          text-align: left;
          color: #111;
          background-repeat: no-repeat;
          background-position: center;
          background-size: cover;
          --accent: #674d80;
          --soft: rgba(255, 255, 255, 0.55);
          --line: rgba(17, 17, 17, 0.12);
          --ease: cubic-bezier(0.22, 0.61, 0.36, 1);
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 1.15fr 1.25fr 1.1fr 1.2fr;
          gap: 32px;
          align-items: start;
        }

        h4 {
          margin: 0 0 12px;
          font-size: 0.95rem;
          font-weight: 700;
          text-align: left;
          color: #111;
        }

        ul {
          list-style: none;
          margin: 0;
          padding: 0;
        }

        /* ---------- Brand ---------- */
        .footer-logo {
          margin: 0 0 8px;
          font-size: 1.4rem;
          font-weight: 800;
          letter-spacing: -0.01em;
          text-align: left;
          color: #111;
        }

        .footer-brand p {
          margin: 0 0 14px;
          max-width: 34ch;
          font-size: 0.8rem;
          line-height: 1.6;
          font-style: normal;
          text-align: left;
          color: #2b2b2b;
        }

        .footer-social {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .footer-social a {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 30px;
          height: 30px;
          font-size: 0.8rem;
          color: #111;
          background: var(--soft);
          border: 1px solid rgba(103, 77, 128, 0.4);
          border-radius: 50%;
          transition: transform 0.3s var(--ease), background 0.3s, color 0.3s, box-shadow 0.3s;
        }
        .footer-social a:hover {
          transform: translateY(-3px);
          background: #fff;
          color: var(--accent);
          box-shadow: 0 8px 14px -8px rgba(103, 77, 128, 0.8);
        }

        /* ---------- Links (two columns to keep the footer short) ---------- */
        .footer-links {
          columns: 2;
          column-gap: 24px;
        }
        .footer-links li {
          break-inside: avoid;
          margin-bottom: 9px;
          text-align: left;
        }
        .footer-links :global(a) {
          position: relative;
          display: inline-block;
          font-size: 0.8rem;
          line-height: 1.3;
          color: #1a1a1a;
          text-decoration: none;
          transition: transform 0.25s var(--ease), color 0.25s;
        }
        .footer-links :global(a)::after {
          content: "";
          position: absolute;
          left: 0;
          bottom: -3px;
          width: 100%;
          height: 1px;
          background: var(--primary);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.3s var(--ease);
        }
        .footer-links :global(a):hover {
          transform: translateX(4px);
          color: #000;
        }
        .footer-links :global(a):hover::after {
          transform: scaleX(1);
        }

        /* ---------- Contact ---------- */
        .footer-contact {
          display: grid;
          gap: 9px;
          margin-bottom: 14px;
        }
        .footer-contact li {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 0.8rem;
          line-height: 1.5;
          text-align: left;
          color: #1a1a1a;
        }
        .footer-contact :global(svg) {
          flex-shrink: 0;
          margin-top: 3px;
          font-size: 0.78rem;
          color: var(--accent);
        }
        .footer-contact a {
          color: #1a1a1a;
          text-decoration: none;
          transition: color 0.25s;
        }
        .footer-contact a:hover {
          color: var(--accent);
        }

        .wa-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 7px 14px;
          font-size: 0.76rem;
          font-weight: 600;
          color: #111;
          text-decoration: none;
          background: var(--soft);
          border: 1px solid rgba(103, 77, 128, 0.45);
          border-radius: 999px;
          transition: transform 0.3s var(--ease), background 0.3s, box-shadow 0.3s;
        }
        .wa-btn:hover {
          transform: translateY(-2px);
          background: #fff;
          box-shadow: 0 10px 18px -12px rgba(103, 77, 128, 0.9);
        }

        /* ---------- Mails (hexagon icons) ---------- */
        .mail-list {
          display: grid;
          gap: 10px;
        }

        .mail-item {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          transition: transform 0.3s var(--ease);
        }
        .mail-item:hover {
          transform: translateX(4px);
        }

        .hex {
          flex-shrink: 0;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          font-size: 0.8rem;
          color: #111;
          background: #fff;
          clip-path: polygon(25% 5%, 75% 5%, 100% 50%, 75% 95%, 25% 95%, 0% 50%);
          transition: transform 0.3s var(--ease), background 0.3s, color 0.3s;
        }
        .mail-item:hover .hex {
          transform: scale(1.1) rotate(-6deg);
          background: var(--primary);
          color: #1d1d1b;
        }

        .mail-text {
          display: grid;
          min-width: 0;
          line-height: 1.3;
          text-align: left;
        }
        .mail-text small {
          font-size: 0.64rem;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #534c32;
        }
        .mail-text strong {
          font-size: 0.8rem;
          font-weight: 600;
          color: #111;
          overflow-wrap: anywhere;
        }

        /* ---------- Bottom ---------- */
        .footer-bottom {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          align-items: center;
          gap: 8px;
          margin-top: 22px;
          padding-top: 12px;
          border-top: 1px solid var(--line);
          font-size: 0.76rem;
          color: #2b2b2b;
        }
        .credits a {
          color: #111;
          font-weight: 600;
          text-decoration: none;
          border-bottom: 1px solid var(--accent);
          transition: color 0.25s;
        }
        .credits a:hover {
          color: var(--accent);
        }

        /* ---------- Responsive ---------- */
        @media (max-width: 992px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr;
            gap: 28px 24px;
          }
        }
        @media (max-width: 560px) {
          #footer {
            padding: 30px 0 14px;
          }
          .footer-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          #footer :global(*) {
            transition: none !important;
          }
        }
      `}</style>
    </footer>
  );
}