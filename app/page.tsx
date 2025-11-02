'use client'

import Home from '@/componets/Home'
import StartLoader from '@/componets/StartLoader'
import React, { useEffect, useState } from 'react'

const Page = () => {
  const [inital, setinital] = useState(true)
  

  useEffect(() => {

    setTimeout(() => {
      setinital(false)
    }, 2000)

  }, [])

  return (
    <div className="h-dvh  bg-background  justify-center items-center">
      {inital ? (
        <StartLoader />
      ) : (
        <>
        {/* <Sidebar/> */}
          <Home />
        </>

      )}

    </div>
  )
}

export default Page
