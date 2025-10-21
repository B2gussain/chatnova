'use client'

import Image from 'next/image'
const StartLoader = () => {
 
  
 
   return (
     <div className="h-dvh w-full bg-background flex justify-center items-center">
       <div className="flex justify-center opacity-0 animate-[fadeIn_3s_ease-in-out_forwards] items-center gap-2">
         <Image src="/logo.png" height={50} width={50} alt="ChatNova Logo" />
         <h2 className="text-foreground font-semibold text-2xl">ChatNova</h2>
       </div>
     </div>
   )
 }

export default StartLoader