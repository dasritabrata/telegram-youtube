"use client"

import { useEffect } from "react"
import { StreamChat } from "stream-chat"
import { Chat } from "stream-chat-react"
import { useUser } from "@clerk/nextjs"

const client = StreamChat.getInstance(
  process.env.NEXT_PUBLIC_STREAM_API_KEY!
)

export default function StreamProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = useUser()

  useEffect(() => {
    if (!user) {
      console.error("StreamProvider: User object is undefined.")
      return
    }

    console.log("StreamProvider: User object:", user)
    console.log(
      "StreamProvider: Stream token:",
      user.publicMetadata?.streamToken
    )

    const connect = async () => {
      if (client.userID) return // Prevent double connect

      try {
        await client.connectUser(
          {
            id: user.id,
            name: user.fullName ?? user.username ?? "User",
            image: user.imageUrl,
          },
          user.publicMetadata.streamToken as string
        )
        console.log("StreamProvider: Successfully connected user.")
      } catch (error) {
        console.error("StreamProvider: Failed to connect user.", error)
      }
    }

    connect()

    return () => {
      client.disconnectUser()
      console.log("StreamProvider: User disconnected.")
    }
  }, [user])

  return <Chat client={client}>{children}</Chat>
}
