"use client";

import React, { useEffect } from "react";
import { useSidebar } from "@/components/ui/sidebar";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import {
  useChatContext,
  Channel,
  Window,
  ChannelHeader,
  MessageList,
  MessageInput,
  Thread,
} from "stream-chat-react";
import { Video, LogOut } from "lucide-react";

function Dashboard() {
  const { user } = useUser();
  const router = useRouter();
  const { channel, client, setActiveChannel } = useChatContext();
  const { setOpen } = useSidebar();

  // 📱 Close sidebar automatically when a channel opens (mobile UX)
  useEffect(() => {
    if (channel) {
      setOpen(false);
    }
  }, [channel, setOpen]);

  // 💤 No channel selected yet
  if (!channel) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-muted-foreground">
        <div className="text-lg font-medium text-foreground">
          No chat selected
        </div>
        <p className="max-w-xs text-sm">
          Choose a conversation from the sidebar or start a new chat.
        </p>
      </div>
    );
  }

  // 🚪 Leave chat
  const handleLeaveChat = async () => {
    if (!user || !channel) return;

    await channel.removeMembers([user.id]);
    setActiveChannel(undefined);
  };

  // 📹 Video call placeholder
  const handleVideoCall = () => {
    alert("Video calling coming soon 🚀");
    // later: Stream Video / WebRTC
  };

  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-xl border bg-background">
      <Channel channel={channel}>
        <Window>
          {/* ───── HEADER WITH ACTIONS ───── */}
          <div className="flex items-center justify-between border-b px-3 py-2 sm:px-4">
            <ChannelHeader />

            <div className="flex items-center gap-2">
              {/* VIDEO CALL */}
              <button
                onClick={handleVideoCall}
                className="flex items-center gap-1 rounded-md border px-2 py-1.5 text-xs sm:text-sm hover:bg-muted transition"
              >
                <Video className="h-4 w-4" />
                <span className="hidden sm:inline">Video</span>
              </button>

              {/* LEAVE CHAT */}
              <button
                onClick={handleLeaveChat}
                className="flex items-center gap-1 rounded-md border border-destructive/30 px-2 py-1.5 text-xs text-destructive hover:bg-destructive/10 transition sm:text-sm"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Leave</span>
              </button>
            </div>
          </div>

          {/* ───── MESSAGES ───── */}
          <div className="flex-1 overflow-y-auto">
            <MessageList />
          </div>

          {/* ───── INPUT ───── */}
          <div className="border-t bg-background px-2 py-2 sm:px-4">
            <MessageInput />
          </div>
        </Window>

        <Thread />
      </Channel>
    </div>
  );
}

export default Dashboard;
