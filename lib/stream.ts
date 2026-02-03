import {StreamChat} from "stream-chat";
if(!process.env.NEXT_STREAM_API_KEY){
  throw new Error("STREAM_API_KEY and STREAM_API_SECRET must be set in environment variables");
}

const streamClient=StreamChat.getInstance(process.env.NEXT_STREAM_API_KEY,process.env.NEXT_STREAM_API_SECRET);


export default streamClient;