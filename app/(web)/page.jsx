import styles from "./page.module.css";
import About from "./About/page";
import Hero from "./Hero/page";
import Team from "./Team/page";
import ChairmanDesk from "./Desk/page";
import Notifications from "./Notificatons/page";
import Project from "./project/page";
import { GallerySmall } from "./gallery/page";
import VideoGallery from "./videos/page";
import Uselinks from "./components/UsefulLinks";
import ServiceGrid from "./service/page";
import Tender from "./Tender/page";
import Ads from "./Ads/page";
import StatsCard from "./StatsCard/page";
import Founder from "./founder/page";
import Notice from "./notices/page";
import Impact from "./impact/page";
import WhatWeDo from "./WhatWeDo/page";
import StoryVideo from "./StoryVideo/page";

async function getData() {
  try {
    let officeData = await fetch(`${process.env.BACKLINK}/public/officeData`, {
      headers: {
        "x-api-key": process.env.API_KEY,
        "office-id": process.env.OFFICE,
      },
      next: {
        revalidate: 1000,
      },
    });
    officeData = await officeData.json();
    const isActive = officeData.data?.enabled_services?.includes("faq");

    // if (!isActive) return;

    const res = await fetch(`${process.env.BACKLINK}/public/useful_links`, {
      headers: {
        "x-api-key": process.env.API_KEY,
        "office-id": process.env.OFFICE,
      },
      next: {
        revalidate: 1000,
      },
    });

    if (!res.ok) {
      return console.error(`Failed to fetch service data: ${res.statusText}`);
    }

    return res.json();
  } catch (error) {
    console.error("Error:", error.message);
    return null;
  }
}

export default async function Home() {
  const usefulinks = await getData();

  return (
    <main className={styles.main}>
      <div id="home"><Hero /></div>
      <Tender />
      <div id="founder"><Founder /></div>
      <div id="notices"><Notice /></div>
      <div id="impact"><Impact /></div>
      <div id="what-we-do"><StatsCard afterStats={<WhatWeDo />} /></div>
      <StoryVideo />
      <div id="contact"><ChairmanDesk section="contact" /></div>
      <Notifications />
      <Ads />
      <div id="services"><ServiceGrid /></div>
      <div id="team"><Team /></div>
      <div id="videos"><VideoGallery /></div>
      <div id="links"><Uselinks data={usefulinks?.data} /></div>
    </main>
  );
}
