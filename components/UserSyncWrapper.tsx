'use client'

import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { useCallback, useState } from "react";
import LoadingSpinner from "./LoadingSpinner";

function UserSyncWrapper({ children }: { children: React.ReactNode }) {
    const { user ,isLoaded:isUserLoaded} = useUser();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const createOrUpdateUser=useMutation(api.users.upsertUser);
    const syncUser=useCallback(async () => {
        if(!user?.id) return;
        try {
            setIsLoading(true);
            //1. Save user to convex
            await createOrUpdateUser({
                userID: user.id,
                name: user.fullName || user.firstName ||
                user.emailAddresses[0]?.emailAddress || "Anonymous",
                email: user.emailAddresses[0]?.emailAddress || "",
                imageURL: user.imageUrl || ""
            });
        } catch (error) {
            console.error("Error syncing user data:", error);
            setError("Failed to sync user data. Please try again.");
            return;
        }
        finally{
            setIsLoading(false);
        }

//loading state
    if(!isUserLoaded || isLoading){
        <LoadingSpinner 
        size="lg"
        message={isUserLoaded ? "Syncing user data..." : "Loading user data..."}
        className="w-full h-full flex items-center justify-center" />
    }

    if(error){
        <div>
            <p className="text-red-500">Sync Error</p>
            <p className="">Please try restarting the app or contact support if error persists</p>
        </div>
    }
        
    }
  return (
    <div>
      {children}
    </div>
  )
}

export default UserSyncWrapper
