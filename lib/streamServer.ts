import {StreamChat} from "stream-chat";
if(!process.env.NEXT_PUBLIC_STREAM_API_KEY){
  throw new Error("STREAM_API_KEY and STREAM_API_SECRET must be set in environment variables");
}

export const serverClient=StreamChat.getInstance(
  process.env.NEXT_PUBLIC_STREAM_API_KEY,
  process.env.STREAM_API_SECRET
);


