"use client";
import React, {useState} from "react";
import Stake from "@/components/staking/components/Stake";
import StakeListTable from "@/components/staking/components/StakeListTable"
const Component = (props: any) => {
  
  
  return (
    <>
      <div className="relative mt-[25px] w-full rounded-[12px] border border-gray-200 bg-white pb-[20px] shadow-lg shadow-gray-400 desktop:h-[1095px] desktop:pb-[0px]">
        <div className="relative w-full">
          <Stake
            handleChangeAmount={props.handleChangeAmount}
            disable={props.disable}
            period={props.period}
            stakingPeriod={props.stakingPeriod}
            setStakingPeriod={props.setStakingPeriod}
            staking={props.staking}
            stakingButtonContext={props.stakingButtonContext}
          />
        </div>
        <div className="absolute right-[20px] inline-flex text-[12px] text-white">
          <button
            className={`mr-[10px] rounded-md px-2 py-1 ${props.stakingActive}`}
            onClick={() => props.handleChangeStakingList("active")}
          >
            Active Stakes
          </button>
          <button
            className={`rounded-md px-2 py-1 ${props.stakingHistory}`}
            onClick={() => props.handleChangeStakingList("history")}
          >
            Staking History
          </button>
        </div>
        <div className="mt-[70px] flex w-full justify-center">
          <div className="w-full mobile:w-[95%]">
            <StakeListTable
              userStakedList={props.userStakedList}
              totalBalance={props.totalBalance}
              totalStakedAmount={props.totalStakedAmount}
              usdPrice={props.usdPrice}
              handleUnstake={props.handleUnstake}
              stakingListStatus={props.stakingListStatus}
              userUnstakeList={props.userUnstakeList}
              windowWidth={props.windowWidth}
            />
          </div>
        </div>
      </div>
    </>
  );
};
export default Component;
