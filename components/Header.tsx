'use client'
import { usePathname } from 'next/navigation'
import React from 'react'
import Link from 'next/link';
import { Authenticated, Unauthenticated } from 'convex/react';

import { SignInButton, UserButton } from '@clerk/nextjs';
import { Button } from './ui/button';

function Header() {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard")

  return (
    <header className="sticky top-0 z-50 mb-6 border-b border-white/40 bg-white/70 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-10">
        
        <Link
          href={"/dashboard"}
          className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl"
        >
          Scholrpark
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <Authenticated>
            {!isDashboard && (
              <Link href={"/dashboard"}>
                <Button
                  variant="outline"
                  className="rounded-full border-slate-200 bg-white/80 px-4 py-2 text-sm hover:bg-white sm:px-5"
                >
                  Dashboard
                </Button>
              </Link>
            )}
            <UserButton />
          </Authenticated>

          <Unauthenticated>
            <SignInButton
              mode="modal"
              forceRedirectUrl={"/dashboard"}
              signUpForceRedirectUrl={"/dashboard"}
            >
              <Button
                variant="outline"
                className="rounded-full border-slate-200 bg-white/80 px-4 py-2 text-sm hover:bg-white sm:px-5"
              >
                Sign In
              </Button>
            </SignInButton>
          </Unauthenticated>
        </div>

      </div>
    </header>
  )
}

export default Header
