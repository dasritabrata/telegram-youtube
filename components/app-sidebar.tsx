"use client"

import { useUser, SignInButton } from "@clerk/nextjs"
import { ChannelList, EmptyStateIndicator } from "stream-chat-react"
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
          <ChannelList
            filters={{ type: "messaging" }}
            sort={{ last_message_at: -1 }}
            options={{ state: true, presence: true, limit: 20 }}
            EmptyStateIndicator={() => (
              <div className="flex flex-col items-center justify-center gap-3 px-4 py-8 text-center">
                {/* ICON */}
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted/40">
                  <svg
                    className="h-6 w-6 text-muted-foreground"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M7.5 8.25h9m-9 3.75h6m-6 3.75h9M3 5.25A2.25 2.25 0 015.25 3h13.5A2.25 2.25 0 0121 5.25v13.5A2.25 2.25 0 0118.75 21H5.25A2.25 2.25 0 013 18.75V5.25z"
                    />
                  </svg>
                </div>
            
                {/* TEXT */}
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">
                    No conversations yet
                  </p>
                  <p className="text-xs text-muted-foreground max-w-[220px]">
                    Start a new chat to connect with your classmates or teachers.
                  </p>
                </div>
              </div>
            )}
            
          />
        </div>
      </SidebarGroupContent>
    </SidebarGroup>
  </SidebarContent>

  <SidebarRail />
</Sidebar>

  )
}
