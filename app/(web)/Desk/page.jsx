import ChairmanDesk from "../components/ChairmanDesk";

function page({ showFullDescription = true, section = "all" }) {
  return <ChairmanDesk showFullDescription={showFullDescription} section={section} />;
}

export default page;
