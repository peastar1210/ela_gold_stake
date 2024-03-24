/* eslint-disable jsx-a11y/alt-text */

import React, { Children, SetStateAction, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
function Home() {
  const router = useRouter();
  useEffect(() => {
    router.push("/telegramtipbot")
  }, [])
  return (
    <div>
    </div>
  )
}



export default Home;
