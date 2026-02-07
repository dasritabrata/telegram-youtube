"use client"

import { useState } from "react"
import { useUser } from "@clerk/nextjs"
import { useChatContext } from "stream-chat-react"
import { useCreateNewChat } from "@/hooks/useCreateNewChat"
import { Doc } from "@/convex/_generated/dataModel"
import UserSearch from "./UserSearch"
import streamClient from "@/lib/stream"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X } from "lucide-react"

export function NewChatDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [selectedUsers, setSelectedUsers] = useState<Doc<"users">[]>([])
  const [groupName, setGroupName] = useState("")

  const createNewChat = useCreateNewChat()
  const { user } = useUser()
  const { setActiveChannel } = useChatContext()
  const isStreamReady = !!streamClient.userID;


  const handleSelectUser = (selectedUser: Doc<"users">) => {
    setSelectedUsers((prev) =>
      prev.find((u) => u._id === selectedUser._id)
        ? prev.filter((u) => u._id !== selectedUser._id)
        : [...prev, selectedUser]
    )
  }

  const removeSelectedUser = (userId: string) => {
    setSelectedUsers((prev) => prev.filter((u) => u._id !== userId))
  }

  const handleCreateChat = async () => {
    if (selectedUsers.length === 0) return

    try {
      const channel = await createNewChat({
        members: selectedUsers.map((u) => u.userID),
        createdBy: user!.id,
        groupName:
          selectedUsers.length > 1 && groupName.trim()
            ? groupName
            : undefined,
      })

      setActiveChannel(channel)
      setOpen(false)
      setSelectedUsers([])
      setGroupName("")
    } catch (err) {
      console.error("Failed to create chat", err)
    }
  }

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen)
    if (!isOpen) {
      setSelectedUsers([])
      setGroupName("")
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent
        className="max-w-lg"
        aria-describedby="dialog-description"
      >
        <p id="dialog-description" className="sr-only">
          Provide details about the chat you want to create.
        </p>
        <DialogHeader>
          <DialogTitle>
            {selectedUsers.length > 1 ? "New Group Chat" : "New Chat"}
          </DialogTitle>
        </DialogHeader>

        {/* Selected users */}
        {selectedUsers.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedUsers.map((u) => (
              <div
                key={u._id}
                className="flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-sm"
              >
                <span>{u.name}</span>
                <button
                  onClick={() => removeSelectedUser(u._id)}
                  className="hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Group name */}
        {selectedUsers.length > 1 && (
          <Input
            placeholder="Group name (optional)"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
        )}

        {/* User search */}
        <UserSearch onSelectUser={handleSelectUser} />

        {/* Action */}
        <div className="flex justify-end pt-4">
        <Button
  disabled={selectedUsers.length === 0 || !isStreamReady}
  onClick={handleCreateChat}
>
  {selectedUsers.length > 1 ? "Create Group" : "Start Chat"}
</Button>

        </div>
      </DialogContent>
    </Dialog>
  )
}
