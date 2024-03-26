"use client"
import React, { useState, useEffect } from "react";
import Link from "next/link";
const Footer = () => {
  const [windowWidth, setWindowWidth] = useState(0);
  const ContractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || ""
  useEffect(() => {
    const handleResize = () => {
      const windowWidth = window.innerWidth
      setWindowWidth(windowWidth)
    }
    window.addEventListener('resize', handleResize)
    handleResize() // Initial margin calculation

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])
  return (
    <>
      <div className="flex h-[50px] w-full items-center justify-center bg-slate-800 backdrop-blur-sm">
        <div className="flex h-[45px] w-[90%] items-center justify-center text-white">
          Distribution Address:&nbsp;&nbsp;
          <Link
            href={`https://esc-testnet.elastos.io/address/${ContractAddress}`}
            target="_blank"
          >
            {windowWidth > 574 ? (
              <>{ContractAddress}</>
            ) : (
              <>
                {ContractAddress.substring(0, 4)}...
                {ContractAddress.substring(38, 43)}
              </>
            )}
          </Link>
        </div>
      </div>
    </>
  );
};
export default Footer;
