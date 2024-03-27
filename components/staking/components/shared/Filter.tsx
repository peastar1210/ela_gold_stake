"use client";
import React, { useState } from "react";
import { tokenList } from "@/utils/tokenList";
const Filter = (props: any) => {
  const [dropdown, setDropdown] = useState<boolean>(false);
  const [filter, setFilter] = useState<string>();
  const handleDropdown = () => {
    setDropdown(true);
  };
  const [filterOption, setFilterOption] = useState<any>(tokenList);
  const handleChangeFilter = (e: any) => {
    setFilter(e.target.value);
    setFilterOption(
      tokenList.filter((item: any) =>
        item.symbol.toLowerCase().includes(e.target.value.toLowerCase())
      )
    );
  };
  const handleSetFilter = (item: any) => {
    setDropdown(false);
    setFilter(item.symbol)
    props.setFilter(item)
  };
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
        <div className="relative">
          <input
            className="absolute w-[100px] border-[1px] border-slate-500 rounded-[5px] outline-none px-[5px] py-[3px] z-[50]"
            onFocus={handleDropdown}
            onChange={handleChangeFilter}
            value={filter}
          />
          {dropdown && (
            <>
              <div
                className="fixed top-0 bottom-0 left-0 right-0"
                onClick={() => {
                  setDropdown(false);
                }}
              ></div>
              <div className={`absolute top-[40px] w-[100px] bg-white ${filterOption.length === 0 ? "border-white" : "border-slate-500"} rounded-[5px] border-[1px] z-[50] flex flex-col shadow-md`}>
                {filterOption.map((item: any, index: number) => {
                  return (
                    <>
                      <button
                        key={index}
                        className="hover:bg-slate-200 h-[30px]"
                        onClick={() => handleSetFilter(item)}
                      >
                        {item.symbol}
                      </button>
                    </>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};
export default Filter;
