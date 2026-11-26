import { ImpactCards } from "./StatsCardGrid";

const MAX_ITEMS = 3;

const FALLBACK_ITEMS = [
  {
    label: "Families Supported",
    value: 1200,
    text: "Households reached through welfare schemes and village support programs.",
  },
  {
    label: "Projects Completed",
    value: 70,
    text: "Roads, water, sanitation and community works delivered for the village.",
  },
  {
    label: "Services Delivered",
    value: 3200,
    text: "Certificates, applications and citizen requests handled by the office.",
  },
];

/* ---------- API ---------- */
async function getImpactData() {
  // headers ekhane (function er bhitore), module level e na
  const headers = {
    "x-api-key": process.env.API_KEY,
    "office-id": process.env.OFFICE,
  };

  try {
    const officeRes = await fetch(`${process.env.BACKLINK}/public/officeData`, {
      headers,
      next: { revalidate: 1000 },
    });
    if (!officeRes.ok) return [];

    const office = await officeRes.json();
    if (!office?.data?.enabled_services?.includes("counter")) return [];

    const res = await fetch(`${process.env.BACKLINK}/public/counter`, {
      headers,
      next: { revalidate: 60 },
    });
    if (!res.ok) {
      console.error(`[impact] counter API failed: ${res.status}`);
      return [];
    }

    const payload = await res.json();
    const d = payload?.data;

    // data.counter[] ba direct array, duto-i handle kore
    if (Array.isArray(d?.counter)) return d.counter;
    if (Array.isArray(d)) return d;

    console.warn("[impact] counter data empty:", payload?.data);
    return [];
  } catch (error) {
    console.error("[impact] error:", error.message);
    return [];
  }
}

/* ---------- API item -> ImpactCards item ---------- */
const toNumber = (v) => {
  const n = Number(String(v ?? "").replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : 0;
};

const mapItem = (item) => ({
  label: item?.text || item?.label || item?.title || item?.name || "Untitled",
  value: toNumber(item?.value ?? item?.count),
  text: item?.description || item?.desc || item?.details || "",
});

/* ---------- COMPONENT ---------- */
export default async function ImpactSection() {
  const data = await getImpactData();

  const items = data.length
    ? data.slice(0, MAX_ITEMS).map(mapItem)
    : FALLBACK_ITEMS;

  return (
    <section className="vu-impact" aria-labelledby="impact-title">
      <h2 id="impact-title" className="vu-impact__title">
        Our <span>Impact</span> in Action
      </h2>
      <p className="vu-impact__sub">
        The TRUST WEBSITE works with villagers, volunteers and local leaders to
        deliver services, support families and build a stronger community.
      </p>
      <ImpactCards items={items} />
    </section>
  );
}