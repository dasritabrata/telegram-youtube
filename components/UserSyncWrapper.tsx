'use client'

import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { useCallback, useEffect, useState } from "react";
import LoadingSpinner from "./LoadingSpinner";
import streamClient from "@/lib/stream";

import { createToken } from "@/actions/createToken";

function UserSyncWrapper({ children }: { children: React.ReactNode }) {
    console.log("🧩 UserSyncWrapper rendered");
    const { user, isLoaded: isUserLoaded } = useUser();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createOrUpdateUser = useMutation(api.users.upsertUser);

    

    const syncUser = useCallback(async () => {
        console.log("🔁 syncUser called", user?.id);
        if (!user?.id) {
            console.log("❌ No user id, returning");
            return;
        }
        try {
            setIsLoading(true);
            setError(null);
            console.log("📤 Calling Convex upsertUser...");

            const tokenProvider = async () => {
                if (!user?.id) throw new Error("User is not authenticated");
                const token = await createToken(user.id)
                return token;
            }

            //1. Save user to convex
            await createOrUpdateUser({
                userID: user.id,
                name: user.fullName || user.firstName ||
                    user.emailAddresses[0]?.emailAddress || "Anonymous",
                email: user.emailAddresses[0]?.emailAddress || "",
                imageURL: user.imageUrl || ""
            });
            console.log("✅ Convex upsertUser finished");
            //2. Sync with stream
            await streamClient.connectUser(
                {
                    id: user.id,
                    name: user.fullName || user.firstName ||
                        user.emailAddresses[0]?.emailAddress || "Anonymous",

                    image: user.imageUrl || ""
                }, tokenProvider
            )


        } catch (error) {
            console.error("Error syncing user data:", error);
            setError("Failed to sync user data. Please try again.");
            return;
        }
        finally {
            setIsLoading(false);
        }
    }, [user?.id, createOrUpdateUser]);

    const disconnectUser = useCallback(async () => {
        try {
            await streamClient.disconnectUser();
        } catch (error) {
            console.error("Error disconnecting user from Stream:", error);
        }
    }, []);

    useEffect(() => {
        if (!isUserLoaded) return;

        if (user) {
            syncUser();
        }
        else {
            disconnectUser();
            setIsLoading(false);
        }
//cleanup function to disconnect user when component unmounts or user changes
        return () => {
            if(user){
                disconnectUser();   
            }
        }

    }, [user, syncUser, disconnectUser, isUserLoaded])


    //loading state
    if (!isUserLoaded || isLoading) {
        return <LoadingSpinner
            size="lg"
            message={isUserLoaded ? "Syncing user data..." : "Loading user data..."}
            className="w-full h-full flex items-center justify-center" />
    }

    if (error) {
        return <div>
            <p className="text-red-500">Sync Error</p>
            <p className="">Please try restarting the app or contact support if error persists</p>
        </div>
    }

    return (
        <div>
            {children}
        </div>
    )
}

export default UserSyncWrapper;
