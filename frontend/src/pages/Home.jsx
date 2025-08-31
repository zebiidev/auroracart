import React from "react";
import MenWomen from "../components/MenWomen";
import YouMayLike from "../components/YouMayLike";
import NewsLetter from "../components/NewsLetter";
const Home = () => {
  return (
    <div className="pt-[100vh]">
      <MenWomen />
      <YouMayLike />
      <NewsLetter />
    </div>
  );
};

export default Home;
