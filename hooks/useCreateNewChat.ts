import streamClient from "@/lib/stream";
import { createToken } from "@/actions/createToken";

export const useCreateNewChat = () => {
  const createNewChat = async ({
    members,
    createdBy,
    groupName,
  }: {
    members: string[];
    createdBy: string;
    groupName?: string;
  }) => {
    // 🔒 REQUIRED GUARD — does NOT change logic
    if (!streamClient.userID) {
      throw new Error(
        "Stream user is not connected. connectUser must be called before creating or querying chats."
      );
    }

    // Ensure the client has a valid user token. If a request fails due to missing
    // token, attempt to fetch a fresh token from the server and reconnect.
    const ensureTokenAndRetry = async <T>(fn: () => Promise<T>): Promise<T> => {
      try {
        return await fn();
      } catch (err: any) {
        const msg = err?.message || String(err);
        if (msg.includes("Both secret and user tokens are not set")) {
          try {
            const token = await createToken(streamClient.userID as string);
            await streamClient.connectUser({ id: streamClient.userID! }, token);
            return await fn();
          } catch (re) {
            throw re;
          }
        }
        throw err;
      }
    };

    const isGroupChat = members.length > 2;

    if (!isGroupChat) {
      const existingChannel = await ensureTokenAndRetry(() =>
        streamClient.queryChannels(
          {
            type: "messaging",
            members: { $eq: members },
          },
          { created_at: -1 },
          { limit: 1 }
        )
      );

      if (existingChannel.length > 0) {
        const channel = existingChannel[0];
        const channelMembers = Object.keys(channel.state.members);

        // for 1-1 chats ensure exactly same 2 members
        if (
          channelMembers.length === 2 &&
          members.length === 2 &&
          channelMembers.every((memberId) => members.includes(memberId))
        ) {
          return channel;
        }
      }
    }

    // create new channel
    const channelId = `chat-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 8)}`;

    try {
      const channelData: {
        members: string[];
        name?: string;
        created_by_id: string;
      } = {
        members,
        created_by_id: createdBy,
      };

      if (isGroupChat) {
        channelData.name =
          groupName || `Group Chat (${members.length} members)`;
      }

      const channel = streamClient.channel(
        isGroupChat ? "team" : "messaging",
        channelId,
        channelData
      );

      await ensureTokenAndRetry(() => channel.watch({ presence: true }));

      return channel;
    } catch (error) {
      throw new Error(
        "Failed to create channel: " +
          (error instanceof Error ? error.message : String(error))
      );
    }
  };

  return createNewChat;
};
