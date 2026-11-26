/* ---------- API data na thakle eta dekhabe ---------- */
const defaults = {
  titleStart: "Led by service:",
  titleHighlight: "Meet our founder",
  image: "/founder.png",
  imageAlt: "Founder portrait",
  quote:
    "Write the founder's message here. A few honest sentences about why this work matters and what it means for the village.",
  attribution: "Founder Name, Founder",
  paragraphs: [
    "Write a short introduction about the founder and how the work began.",
    "Write a second short paragraph about the community and the mission.",
  ],
  accordions: [
    { title: "Our vision", text: "Describe the vision for the village and its people." },
    { title: "Our journey", text: "Describe how the organisation started and grew." },
    { title: "Our promise", text: "Describe the commitment made to the community." },
    { title: "What's next", text: "Describe the plans and goals ahead." },
  ],
};

async function getFounder() {
  const headers = {
    "x-api-key": process.env.API_KEY,
    "office-id": process.env.OFFICE,
  };

  try {
    const res = await fetch(`${process.env.BACKLINK}/public/founder`, {
      headers,
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data || null;
  } catch (error) {
    console.error("[founder] error:", error.message);
    return null;
  }
}

export default async function FounderSection() {
  const api = await getFounder();

  const founder = api
    ? {
        ...defaults,
        image: api.image || defaults.image,
        imageAlt: api.name ? `${api.name} portrait` : defaults.imageAlt,
        quote: api.quote || defaults.quote,
        attribution: [api.name, api.designation].filter(Boolean).join(", "),
        paragraphs: api.paragraphs?.length ? api.paragraphs : [],
        accordions: api.accordions?.length ? api.accordions : [],
      }
    : defaults;

  return (
    <section className="vu-founder" aria-labelledby="founder-title">
      <h2 id="founder-title" className="vu-founder__title">
        {founder.titleStart} <span>{founder.titleHighlight}</span>
      </h2>

      <div className="vu-founder__top">
        <div className="vu-founder__photo">
          <img src={founder.image} alt={founder.imageAlt} loading="lazy" />
        </div>

        <figure className="vu-founder__quote">
          <span className="vu-founder__mark" aria-hidden="true">
            &rdquo;
          </span>
          <blockquote>{founder.quote}</blockquote>
          <figcaption>&mdash; {founder.attribution}</figcaption>
        </figure>
      </div>

      {(founder.paragraphs.length > 0 || founder.accordions.length > 0) && (
        <div className="vu-founder__bottom">
          <div className="vu-founder__text">
            {founder.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          <div className="vu-founder__acc">
            {founder.accordions.map((item, i) => (
              <details key={item._id || i} open={i === 0}>
                <summary>{item.title}</summary>
                <p>{item.text}</p>
              </details>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}