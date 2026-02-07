"use client";
import LoadingSpinner from "@/components/LoadingSpinner";
import { StatusCard } from "@/components/StatusCard";
import { useSidebar } from "@/components/ui/sidebar";

import {
    CallControls,
    CallingState,
    SpeakerLayout,
    useCallStateHooks,
} from "@stream-io/video-react-sdk";
import { useRouter } from "next/navigation";
import { useState } from "react";


function VideoCall() {
    const { useCallCallingState, useParticipants } = useCallStateHooks();
    const callingState = useCallCallingState();
    const participants = useParticipants();
    const router = useRouter();
    const [copied, setCopied] = useState(false);
    const { setOpen } = useSidebar();

    // ✅ ADDED: detect if user is alone
    const isAloneInCall = participants.length === 1;

    const handleLeave = () => {
        router.push("/dashboard");
        setOpen(true);
    };


    const copyToClipboard = async ()=>{
        try {
            await navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy: ", err);
        }
    };

    if (callingState === CallingState.JOINING) {
        return (
            <StatusCard
                title="Joining call..."
                description="Please wait while we connect you to the call."
                className="bg-gray-50 rounded-lg">
                <LoadingSpinner inline size="lg" />
            </StatusCard>)
    }


    if (callingState === CallingState.RECONNECTING) {
        return (
            <StatusCard
                title="Reconnecting..."
                description="Connection lost, attempting to reconnect."
                className="bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="animate-pulse rounded-full h-12 w-12 bg-yellow-400
                mx-auto"></div>
            </StatusCard>
        );
    }



    if (callingState !== CallingState.JOINED) {
        return (
            <StatusCard
                title="Loading call..."
                description={`Status: ${callingState}`}
                className="bg-gray-50 rounded-lg">
                <div className="animate-pulse rounded-full h-12 w-12 bg-gray-400
                    mx-auto"> </div>
            </StatusCard>
        );
    }


return (
    <div className="flex flex-col">
        <div className="flex-1 relative">
            <SpeakerLayout />
        </div>

        {/* ✅ ADDED: show invite button only if alone */}
        {isAloneInCall && (
            <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-10">
                <button
                    onClick={copyToClipboard}
                    className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                >
                    {copied ? "Link copied!" : "Copy meet link"}
                </button>
            </div>
        )}

        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2
                z-10">
            <CallControls onLeave={handleLeave} />
        </div>
    </div>)
    }
                
export default VideoCall;
