"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useInView } from "react-intersection-observer";

const lightboxCss = `
.lb-backdrop {
  position: fixed; inset: 0; z-index: 9999;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  background: rgba(38, 30, 46, 0.35);
  -webkit-backdrop-filter: blur(12px); backdrop-filter: blur(12px);
  animation: lbFade 0.25s ease;
}
.lb-stage {
  width: 100%; height: calc(100% - 120px);
  display: flex; align-items: center; justify-content: center;
  overflow: hidden; touch-action: none;
}
.lb-img {
  max-width: 88vw; max-height: 100%;
  border-radius: 14px; user-select: none; -webkit-user-drag: none;
  box-shadow: 0 30px 70px -20px rgba(0, 0, 0, 0.55);
  transition: transform 0.18s ease-out;
  animation: lbPop 0.3s cubic-bezier(0.22, 0.61, 0.36, 1);
}
.lb-img.lb-dragging { transition: none; }
.lb-toolbar {
  position: absolute; top: 16px; right: 16px;
  display: flex; align-items: center; gap: 6px; padding: 6px;
  background: rgba(243, 241, 246, 0.92); border-radius: 999px;
}
.lb-btn {
  min-width: 34px; height: 34px; padding: 0 10px;
  border: 0; border-radius: 999px; cursor: pointer;
  font-size: 1rem; font-weight: 600; color: #111; background: transparent;
  transition: background 0.2s, transform 0.2s;
}
.lb-btn:hover { background: #ded6e6; transform: scale(1.06); }
.lb-zoom { min-width: 44px; text-align: center; font-size: 0.8rem; font-weight: 600; color: #111; }
.lb-caption {
  position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%);
  padding: 8px 16px; font-size: 0.85rem; color: #111;
  background: rgba(243, 241, 246, 0.92); border-radius: 999px; white-space: nowrap;
}
@keyframes lbFade { from { opacity: 0; } to { opacity: 1; } }
@keyframes lbPop { from { opacity: 0; transform: scale(0.94); } to { opacity: 1; } }
@media (prefers-reduced-motion: reduce) { .lb-backdrop, .lb-img { animation: none; transition: none; } }
`;

const ImageLightbox = ({ image, onClose }) => {
  const [scale, setScale] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const drag = useRef(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  const zoom = (d) =>
    setScale((s) => Math.min(4, Math.max(1, +(s + d).toFixed(2))));

  useEffect(() => {
    if (scale === 1) setPos({ x: 0, y: 0 });
  }, [scale]);

  useEffect(() => {
    if (!image) return;
    setScale(1);
    setPos({ x: 0, y: 0 });
    const onKey = (e) => {
      if (e.key === "Escape") closeRef.current();
      if (e.key === "+" || e.key === "=") zoom(0.5);
      if (e.key === "-") zoom(-0.5);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [image]);

  if (!image || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="lb-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label={image.alt || "Image preview"}
      onClick={onClose}
    >
      <style>{lightboxCss}</style>

      <div className="lb-toolbar" onClick={(e) => e.stopPropagation()}>
        <button
          className="lb-btn"
          onClick={() => zoom(-0.5)}
          aria-label="Zoom out"
        >
          −
        </button>
        <span className="lb-zoom">{Math.round(scale * 100)}%</span>
        <button
          className="lb-btn"
          onClick={() => zoom(0.5)}
          aria-label="Zoom in"
        >
          +
        </button>
        <button
          className="lb-btn"
          onClick={() => setScale(1)}
          aria-label="Reset zoom"
        >
          Reset
        </button>
        <button className="lb-btn" onClick={onClose} aria-label="Close">
          ✕
        </button>
      </div>

      <div
        className="lb-stage"
        onWheel={(e) => zoom(e.deltaY < 0 ? 0.25 : -0.25)}
      >
        <img
          className={`lb-img ${dragging ? "lb-dragging" : ""}`}
          src={image.src}
          alt={image.alt || ""}
          draggable={false}
          style={{
            transform: `translate(${pos.x}px, ${pos.y}px) scale(${scale})`,
            cursor: scale > 1 ? (dragging ? "grabbing" : "grab") : "zoom-in",
          }}
          onClick={(e) => {
            e.stopPropagation();
            if (drag.current?.moved) return;
            setScale((s) => (s === 1 ? 2.5 : 1));
          }}
          onPointerDown={(e) => {
            if (scale === 1) return;
            e.currentTarget.setPointerCapture(e.pointerId);
            drag.current = {
              sx: e.clientX - pos.x,
              sy: e.clientY - pos.y,
              moved: false,
            };
            setDragging(true);
          }}
          onPointerMove={(e) => {
            if (!drag.current) return;
            const nx = e.clientX - drag.current.sx;
            const ny = e.clientY - drag.current.sy;
            if (Math.abs(nx - pos.x) + Math.abs(ny - pos.y) > 3)
              drag.current.moved = true;
            setPos({ x: nx, y: ny });
          }}
          onPointerUp={() => {
            setDragging(false);
            setTimeout(() => (drag.current = null), 0);
          }}
        />
      </div>

      {image.caption && (
        <div className="lb-caption" onClick={(e) => e.stopPropagation()}>
          {image.caption}
        </div>
      )}
    </div>,
    document.body,
  );
};

const formatMetric = (value) => {
  if (value === null || value === undefined || value === "") return "0";

  const numericValue = Number(String(value).replace(/,/g, "").trim());
  if (!Number.isFinite(numericValue)) return String(value);

  return new Intl.NumberFormat("en-US").format(numericValue);
};

const AnimatedMetric = ({ value, active }) => {
  const targetValue = useMemo(() => {
    const parsed = Number(String(value).replace(/,/g, "").trim());
    return Number.isFinite(parsed) ? parsed : null;
  }, [value]);

  const [displayValue, setDisplayValue] = useState(targetValue ?? 0);

  useEffect(() => {
    if (!active || targetValue === null) {
      setDisplayValue(targetValue ?? 0);
      return;
    }

    let frameId;
    const startTime = performance.now();
    const duration = 1400;

    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const easing = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(targetValue * easing));

      if (progress < 1) {
        frameId = window.requestAnimationFrame(tick);
      }
    };

    setDisplayValue(0);
    frameId = window.requestAnimationFrame(tick);

    return () => {
      if (frameId) window.cancelAnimationFrame(frameId);
    };
  }, [active, targetValue]);

  return (
    <>
      {targetValue === null
        ? formatMetric(value)
        : new Intl.NumberFormat("en-US").format(displayValue)}
    </>
  );
};

// shown when the office has not published any counters yet
const fallbackItems = [
  {
    text: "Our Services",
    note: "Browse the services offered by the TRUST WEBSITE.",
    href: "/service",
  },
  {
    text: "About Us",
    note: "Learn about our village and local administration.",
    href: "/About",
  },
  {
    text: "Our Team",
    note: "Meet the people serving the community.",
    href: "/Team",
  },
  {
    text: "Grievance Cell",
    note: "Raise a concern and track it with the office.",
    href: "/grievance",
  },
  {
    text: "Citizen Services",
    note: "Access online citizen services.",
    href: "http://wbpms.in/citizen",
  },
  {
    text: "Contact Office",
    note: "Reach the office for help and information.",
    href: "/contact",
  },
  {
    text: "Photo Gallery",
    note: "See moments and events from around the village.",
    href: "/gallery",
  },
  {
    text: "Video Gallery",
    note: "Watch videos from programs and public events.",
    href: "/video-gallery",
  },
  { text: "Home", note: "Go back to the main page of the portal.", href: "/" },
];

// images = gallery API theke asha chhobir list (StatsCard theke prop hishebe ashe)
const StatsCardGrid = ({ metrics = [], images = [] }) => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });
  const [lightbox, setLightbox] = useState(null);
  const [active, setActive] = useState(0); // last hovered card stays open
  const hasData = metrics.length > 0;
  const items = hasData ? metrics : fallbackItems;

  // Valid chhobi gulo alada kore nao
  const galleryImages = useMemo(
    () =>
      (Array.isArray(images) ? images : []).filter(
        (s) => typeof s === "string" && s.trim(),
      ),
    [images],
  );

  // Priority: card er nijer image > gallery chhobi > purono static fallback
  const getImage = (item, index) =>
    item?.image ||
    (galleryImages.length
      ? galleryImages[index % galleryImages.length]
      : `/IMG${(index % 9) + 1}.jpg`);

  return (
    <div ref={ref} className="vu-stories__row">
      {items.map((item, index) => {
        const imageSrc = getImage(item, index);
        const title = item?.text || "Public metric";
        const open = () =>
          setLightbox({ src: imageSrc, alt: title, caption: title });

        return (
          <article
            key={item?._id || index}
            className={`vu-story ${active === index ? "is-active" : ""}`}
            onMouseEnter={() => setActive(index)}
            onFocus={() => setActive(index)}
            role="button"
            tabIndex={0}
            aria-label={`View image: ${title}`}
            style={{
              "--i": index,
              backgroundImage: `url("${imageSrc}")`,
              cursor: "zoom-in",
            }}
            onClick={open}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                open();
              }
            }}
          >
            {item.href ? (
              <a
                href={item.href}
                className="vu-story__arrow"
                aria-label={`Open ${title}`}
                style={{ textDecoration: "none", color: "inherit" }}
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => e.stopPropagation()}
              >
                ↗
              </a>
            ) : null}
            <div className="vu-story__body">
              {hasData ? (
                <h3
                  className="vu-story__value"
                  aria-label={`Metric value ${formatMetric(item?.value ?? 0)}`}
                >
                  <AnimatedMetric value={item?.value ?? 0} active={inView} />
                </h3>
              ) : null}
              <p className="vu-story__label">{title}</p>
              {item.note ? <p className="vu-story__note">{item.note}</p> : null}
            </div>
          </article>
        );
      })}

      <ImageLightbox image={lightbox} onClose={() => setLightbox(null)} />
    </div>
  );
};

export const ImpactCards = ({ items = [] }) => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.25 });

  return (
    <div ref={ref} className="vu-impact__grid">
      {items.map((item, index) => (
        <article
          key={index}
          className="vu-impact__card"
          style={{ "--i": index }}
        >
          <h3 className="vu-impact__label">{item.label}</h3>
          <div className="vu-impact__bottom">
            <div className="vu-impact__value">
              <AnimatedMetric value={item.value} active={inView} />
              <span className="vu-impact__plus">+</span>
            </div>
            <p className="vu-impact__text">{item.text}</p>
          </div>
        </article>
      ))}
    </div>
  );
};

const socialMeta = [
  { key: "facebook", icon: "fab fa-facebook-f", label: "Facebook" },
  { key: "twitter", icon: "fab fa-twitter", label: "Twitter" },
  { key: "instagram", icon: "fab fa-instagram", label: "Instagram" },
  { key: "linkedin", icon: "fab fa-linkedin-in", label: "LinkedIn" },
  { key: "youtube", icon: "fab fa-youtube", label: "YouTube" },
];

export const ContactSection = ({ info }) => {
  const [tab, setTab] = useState("contact");
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(info.address)}&output=embed`;
  const ready = form.name.trim() && form.email.trim() && form.message.trim();

  const onChange = (e) => {
    setSent(false);
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!ready) return;
    const subject = encodeURIComponent(`Message from ${form.name}`);
    const body = encodeURIComponent(
      `${form.message}\n\nFrom: ${form.name}\nEmail: ${form.email}`,
    );
    window.location.href = `mailto:${info.email}?subject=${subject}&body=${body}`;
    setSent(true);
  };

  const bank = info.bank || {};

  return (
    <section className="vu-contact" aria-labelledby="contact-title">
      <div className="vu-contact__bg" aria-hidden="true" />

      <div className="vu-contact__card">
        {/* LEFT: form */}
        <form className="vu-contact__form" onSubmit={onSubmit}>
          <h3 className="vu-contact__card-title">Send us a message</h3>

          <input
            className="vu-contact__input"
            type="text"
            name="name"
            placeholder="Your name"
            value={form.name}
            onChange={onChange}
            autoComplete="name"
          />
          <input
            className="vu-contact__input"
            type="email"
            name="email"
            placeholder="Your email"
            value={form.email}
            onChange={onChange}
            autoComplete="email"
          />
          <textarea
            className="vu-contact__input vu-contact__textarea"
            name="message"
            rows={5}
            placeholder="How can we help?"
            value={form.message}
            onChange={onChange}
          />

          <button
            type="submit"
            className="vu-contact__submit"
            disabled={!ready}
          >
            Send message
          </button>

          {sent ? (
            <p className="vu-contact__note">
              Your email app should open with the message ready to send.
            </p>
          ) : null}
        </form>

        {/* RIGHT: map, details, socials */}
        <div className="vu-contact__side">
          <div className="vu-contact__map">
            <iframe
              title="Office location"
              src={mapSrc}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>

          <div className="vu-contact__tabs" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={tab === "contact"}
              className={tab === "contact" ? "is-active" : ""}
              onClick={() => setTab("contact")}
            >
              Contact
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={tab === "bank"}
              className={tab === "bank" ? "is-active" : ""}
              onClick={() => setTab("bank")}
            >
              Bank details
            </button>
          </div>

          {tab === "contact" ? (
            <ul className="vu-contact__list">
              <li className="vu-contact__item vu-contact__item--wide">
                <i className="fas fa-location-dot" />
                <div>
                  <span>Address</span>
                  <p>{info.address}</p>
                </div>
              </li>
              <li className="vu-contact__item">
                <i className="fas fa-phone" />
                <div>
                  <span>Phone</span>
                  <a href={`tel:${info.phone.replace(/\s/g, "")}`}>
                    {info.phone}
                  </a>
                </div>
              </li>
              <li className="vu-contact__item">
                <i className="far fa-envelope" />
                <div>
                  <span>Email</span>
                  <a href={`mailto:${info.email}`}>{info.email}</a>
                </div>
              </li>
              {info.hours ? (
                <li className="vu-contact__item vu-contact__item--wide">
                  <i className="far fa-clock" />
                  <div>
                    <span>Office hours</span>
                    <p>{info.hours}</p>
                  </div>
                </li>
              ) : null}
            </ul>
          ) : (
            <dl className="vu-contact__bank">
              <div className="vu-contact__bank-row vu-contact__bank-row--wide">
                <dt>Account name</dt>
                <dd>{bank.accountName}</dd>
              </div>
              <div className="vu-contact__bank-row">
                <dt>Account number</dt>
                <dd>{bank.accountNumber}</dd>
              </div>
              <div className="vu-contact__bank-row">
                <dt>IFSC</dt>
                <dd>{bank.ifsc}</dd>
              </div>
              <div className="vu-contact__bank-row vu-contact__bank-row--wide">
                <dt>Bank and branch</dt>
                <dd>{bank.bankBranch}</dd>
              </div>
              {bank.upi ? (
                <div className="vu-contact__bank-row vu-contact__bank-row--wide">
                  <dt>UPI ID</dt>
                  <dd>{bank.upi}</dd>
                </div>
              ) : null}
            </dl>
          )}

          <div className="vu-contact__socials">
            {socialMeta.map(({ key, icon, label }) =>
              info.socials?.[key] ? (
                <a
                  key={key}
                  href={info.socials[key]}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                >
                  <i className={icon} />
                </a>
              ) : null,
            )}
          </div>
        </div>
      </div>

      <div className="vu-contact__foot">
        <h2 id="contact-title" className="vu-contact__title">
          Get in touch with us
        </h2>
        <p className="vu-contact__sub">
          Questions, suggestions or support for the village? Write to us or
          visit the office. Every message is read by our team.
        </p>
      </div>
    </section>
  );
};

export default StatsCardGrid;