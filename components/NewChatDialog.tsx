"use client"

import { useState } from "react"
import { useUser } from "@clerk/nextjs"
import { useChatContext } from "stream-chat-react"
import { useCreateNewChat } from "@/hooks/useCreateNewChat"
import { Doc } from "@/convex/_generated/dataModel"
import UserSearch from "./UserSearch"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

export function NewChatDialog({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState(false)
    const [selectedUsers, setSelectedUsers] = useState<string[]>([])
    const [groupName, setGroupName] = useState("")
    const createNewChat = useCreateNewChat();
    const { user } = useUser()
    const { setActiveChannel } = useChatContext()

    const handleSelectUser = (user: Doc<"users">) => {
        if (!selectedUsers.find((u) => u === user._id)) {
            setSelectedUsers((prev) => [...prev, user._id]);
        } else {
            setSelectedUsers((prev) => prev.filter(u => u !== user._id))
        }
    }

    const removeSelectedUser = (userId: string) => {
        setSelectedUsers((prev) => prev.filter(u => u !== userId))
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
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. This will permanently delete your account
                        and remove your data from our servers.
                    </DialogDescription>
                </DialogHeader>
                <div>
                    <UserSearch></UserSearch>
                </div>
            </DialogContent>
        </Dialog>
    )
}
