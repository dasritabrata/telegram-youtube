import streamClient from "@/lib/stream";


export const useCreateNewChat = () => {
    const createNewChat = async ({
        members, createdBy, groupName }: { members: string[], createdBy: string, groupName?: string }) => {
        const isGroupChat = members.length > 2
        if (!isGroupChat) {
            const existingChannel = await streamClient.queryChannels(
                {
                    type: "messaging",
                    members: { $eq: members },
                },
                { created_at: -1 },
                { limit: 1 }
            );
            if (existingChannel.length > 0) {
                const channel = existingChannel[0]
                const channelMembers = Object.keys(channel.state.members);

               // for 1-1 chats ensure exactly same 2 mwembers
               if(
                channelMembers.length === 2 &&
                members.length === 2 &&
                channelMembers.every((memberId) => members.includes(memberId))
               ){
                return channel
               }
            }
        }

        // create new channel
        const channelId=`chat-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
        try {
            const channelData:{
                members:string[],
                name?:string,
                created_by_id:string
            }={
                members,
                created_by_id:createdBy
            }
            if(isGroupChat ){
                channelData.name=groupName || `Group Chat (${members.length} members)`
            }
            const channel=streamClient.channel(
                isGroupChat ? "team" : "messaging",
                channelId,
                channelData
             )
                await channel.watch({presence:true})
                return channel
            
        } 
        catch (error) {
            throw new Error("Failed to create channel: "+(error instanceof Error ? error.message : String(error)))
            
        }
               
    };

    return createNewChat;
};

