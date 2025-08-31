import React from "react";

const AdminHeader = ({ title }) => {
  return (
    <div>
      <h1 className="p-11 font-bold tracking-tighter md:tracking-normal text-2xl">
        {title}
      </h1>
    </div>
  );
};

export default AdminHeader;
