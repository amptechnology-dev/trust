// EDIT THIS OBJECT. Every word shown in the section comes from here.
const founder = {
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

export default function FounderSection() {
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

      <div className="vu-founder__bottom">
        <div className="vu-founder__text">
          {founder.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        <div className="vu-founder__acc">
          {founder.accordions.map((item, i) => (
            <details key={i} open={i === 0}>
              <summary>{item.title}</summary>
              <p>{item.text}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}