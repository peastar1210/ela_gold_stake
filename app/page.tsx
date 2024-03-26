"use client";
import React, { Children, SetStateAction, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
export default function Home() {
  const router = useRouter();
  useEffect(() => {
    router.push("/staking")
  }, [])
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
    </main>
  );
}
