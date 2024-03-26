"use client";
import React, { useState } from "react";
const Filter = (props: any) => {
  const [dropdown, setDropdown] = useState<boolean>()
  const handleDropdown = () => {
    
  }
  return (
    <>
      <div className="inline-flex">
        <button
          className={`rounded-md px-2 py-1 ${
            props.priceCurrency === "gold" ? "bg-gray-700" : "bg-gray-500"
          } mr-[5px] text-white`}
          onClick={() => {
            props.setPriceCurrency("gold");
          }}
        >
          Gold
        </button>
        <button
          className={`rounded-md px-2 py-1 ${
            props.priceCurrency === "ela" ? "bg-gray-700" : "bg-gray-500"
          } mr-[5px] text-white w-[50px]`}
          onClick={() => {
            props.setPriceCurrency("ela");
          }}
        >
          Ela
        </button>
        <input
          className="w-[100px] border-[1px] border-slate-500 rounded-[5px] outline-none px-[5px]"
          onFocus={handleDropdown}
        />
      </div>
    </>
  );
};
export default Filter;
