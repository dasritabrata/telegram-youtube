
"use client"

import React from 'react'
import { useUser } from '@clerk/nextjs'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Button } from '@/components/ui/button'
import { UserIcon } from 'lucide-react'
import { useCreateNewChat } from '@/hooks/useCreateNewChat'
import { useChatContext } from 'stream-chat-react'

export default function ContactsList() {
  const { user } = useUser()
  const allUsers = useQuery(api.users.listUsers) || []
  const createNewChat = useCreateNewChat()
  const { setActiveChannel } = useChatContext()

  const contacts = allUsers.filter((u: any) => u.userID !== user?.id)

  const handleOpenChat = async (contact: any) => {
    if (!user) return
    try {
      const channel = await createNewChat({
        members: [user.id, contact.userID],
        createdBy: user.id,
      })
      setActiveChannel(channel)
    } catch (err) {
      console.error('Failed to open chat with', contact, err)
    }
  }

  if (contacts.length === 0) {
    return (
      <div className="p-4 text-sm text-muted-foreground">No contacts found.</div>
    )
  }

  return (
    <div className="flex flex-col divide-y">
      {contacts.map((c: any) => (
        <button
          key={c._id}
          onClick={() => handleOpenChat(c)}
          className="flex items-center gap-3 w-full p-2 hover:bg-muted rounded-md text-left"
        >
          <div className="w-10 h-10 rounded-full bg-muted overflow-hidden flex items-center justify-center">
            {c.imageURL ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={c.imageURL} alt={c.name} className="w-full h-full object-cover" />
            ) : (
              <UserIcon className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
          <div className="flex-1">
            <div className="font-medium">{c.name}</div>
            <div className="text-xs text-muted-foreground truncate">{c.email}</div>
          </div>
          <div className="text-xs text-muted-foreground">Open</div>
        </button>
      ))}
    </div>
  )
}
