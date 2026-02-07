'use client'

import { Chat } from 'stream-chat-react';
import UserSyncWrapper from '@/components/UserSyncWrapper';
import streamClient from '@/lib/stream';
import { AppSidebar } from "@/components/app-sidebar"

import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import Link from 'next/link';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    
    <UserSyncWrapper>
  <Chat client={streamClient}>
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset className="flex min-h-screen flex-col bg-background">
        {/* TOP APP BAR */}
        <header className="sticky top-0 z-30 flex h-14 sm:h-16 items-center gap-3 border-b bg-background/80 px-3 sm:px-4 backdrop-blur-md">
          <SidebarTrigger className="rounded-md p-2 hover:bg-muted transition" />

          <Separator
            orientation="vertical"
            className="mx-1 hidden sm:block data-[orientation=vertical]:h-5"
          />

          <Link href="/dashboard" className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-semibold tracking-tight">
              Scholrpark
            </h1>
          </Link>

          {/* Right spacer (future actions / user menu ready) */}
          <div className="ml-auto" />
        </header>

        {/* MAIN CONTENT */}
        <main className="flex flex-1 flex-col gap-6 p-3 sm:p-4 lg:p-6">
          

          {/* MAIN PANEL */}
          <div className="flex-1 rounded-xl bg-muted/40 p-4 sm:p-6">
            {children}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  </Chat>
</UserSyncWrapper>

        
  );
}
