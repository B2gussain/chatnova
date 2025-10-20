import React from 'react'
import {
    ClerkProvider,
    SignInButton,
    SignUpButton,
    SignedIn,
    SignedOut,
    UserButton,
} from '@clerk/nextjs'
import Image from 'next/image'
const Header = () => {
  return (
     <header className="flex  w-full justify-between fixed top-0 bg-black z-30 right-0 items-center p-4 gap-4 h-16">
        <div className='flex items-center gap-1 justify-center '>
            <Image src="/logo.png" height={30} width={30} alt="" className='h-full' />
            <p className='font-bold'>ChatNova</p>
        </div>
            <SignedOut>
                <SignInButton />
                <SignUpButton>
                    <button className="bg-primary text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
                        Sign Up
                    </button>
                </SignUpButton>
            </SignedOut>
            <SignedIn>
                <UserButton />
            </SignedIn>
        </header>
  )
}

export default Header