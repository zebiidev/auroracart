import React from "react";

const Title = ({ title }) => {
  return (
    <div className="font-semibold text-2xl  w-full text-center mt-7 my-4">
      <h1 className="uppercase">{title}</h1>
    </div>
  );
};

export default Title;
