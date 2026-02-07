"use client"

import { useUser, SignInButton } from "@clerk/nextjs"
import { ChannelList, EmptyStateIndicator, useChatContext } from "stream-chat-react"
import { Button } from "@/components/ui/button"
import { UserButton } from "@clerk/nextjs"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
} from "@/components/ui/sidebar"
import { ChannelFilters } from "stream-chat"
import {NewChatDialog} from "./NewChatDialog"
import ContactsList from './ContactsList'
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useCreateNewChat } from '@/hooks/useCreateNewChat'

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const { user, isLoaded } = useUser()

  const filters:ChannelFilters={
    members: { $in: [user?.id || ""] },
    type: { $in: ["messaging","team"] },
  }

  return (
    <Sidebar {...props}>
  {/* ───────── HEADER ───────── */}
  <SidebarHeader className="border-b px-4 py-4 space-y-4">
    {/* BRAND */}
    <div className="flex items-center justify-between">
      <h2 className="text-lg font-semibold tracking-tight">
        Scholrpark
      </h2>
      <UserButton signInUrl="/sign-in" />
    </div>

    {/* WELCOME TEXT */}
    <div className="text-sm text-muted-foreground">
      Welcome back,
      <span className="ml-1 font-medium text-foreground">
        {user?.firstName || "User"}
      </span>
    </div>

    {/* PRIMARY ACTION */}

    <NewChatDialog>
    <Button
      variant="outline"
      className="
        w-full justify-center gap-2
        border-dashed
        hover:border-solid
        transition
      "
    >
      Start New Chat
    </Button>
    </NewChatDialog>

    {/* SIGN IN (fallback) */}
    {isLoaded && !user && (
      <SignInButton mode="modal">
        <button className="w-full rounded-md border px-3 py-2 text-sm hover:bg-muted transition">
          Sign in
        </button>
      </SignInButton>
    )}
  </SidebarHeader>

  {/* ───────── CONTENT ───────── */}
  <SidebarContent className="px-2 py-3">
    <SidebarGroup>
      <SidebarGroupLabel className="px-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
        Chats
      </SidebarGroupLabel>

      <SidebarGroupContent className="mt-2">
        <div className="rounded-md bg-muted/30 p-1">
          <ContactsList />
        </div>
      </SidebarGroupContent>
    </SidebarGroup>
  </SidebarContent>

  <SidebarRail />
</Sidebar>

  )
}
