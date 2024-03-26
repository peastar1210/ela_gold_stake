import React from "react";
const Component = (props:any) => {
  return (
    <>
      <div className="rounded bg-slate-700 px-1 py-[3px] text-[12px] w-[153px] flex h-[30px]">
        <button
          className={`mr-2 ${props.chartPrice} rounded-sm px-1 `}
          onClick={() => {
            props.handleChangeChart('price')
          }}
        >
          Price
        </button>
        <button
          className={`mr-2 ${props.chartStakes} rounded-sm px-1`}
          onClick={() => {
            props.handleChangeChart('staked')
          }}
        >
          Staked
        </button>
        <button
          className={`mr-2 ${props.chartRewards} rounded-sm px-1 `}
          onClick={() => {
            props.handleChangeChart('rewards')
          }}
        >
          Rewards
        </button>
      </div>
    </>
  );
};
export default Component;
