"use client";
import React from "react";
import ConnectWallet from '@/components/shared/ConnectWallet'
const Header = () => {
  return (
    <>
      <div className="relative flex h-[80px] w-full items-center bg-slate-800">
        <div className="absolute left-[20px] flex h-[80%] items-center">
          <img className="h-full" src="logo.png" />
          <div className="ml-[15px] hidden font-sans text-[18px] font-bold text-white mobile:block">
            Earn GOLD Stake GOLD
          </div>
        </div>
        <div className={`absolute right-[20px] inline-flex h-[52px]`}>
          <ConnectWallet />
        </div>
      </div>
    </>
  );
};
export default Header;