"use client";
import Footer from "@/components/staking/layout/Footer";
import Header from "@/components/staking/layout/Header";
import React from "react";
const StakingLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <>
      <div className="flex flex-col fixed right-0 left-0 top-0 bottom-0">
        <Header/>
        {children}
        <Footer/>
      </div>
    </>
  );
};
export default StakingLayout;
