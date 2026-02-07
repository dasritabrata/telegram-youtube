"use client"

import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { useCallback, useEffect, useRef, useState } from "react";
import LoadingSpinner from "./LoadingSpinner";
import streamClient from "@/lib/stream";
import { createToken } from "@/actions/createToken";

function UserSyncWrapper({ children }: { children: React.ReactNode }) {
  console.log("🧩 UserSyncWrapper rendered");

  const { user, isLoaded: isUserLoaded } = useUser();
  const createOrUpdateUser = useMutation(api.users.upsertUser);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 🔒 prevents duplicate connectUser (StrictMode + rerenders)
  const hasConnectedRef = useRef(false);

  const syncUser = useCallback(async () => {
    if (!user?.id) return;

    // 🚫 ABSOLUTE GUARD
    if (hasConnectedRef.current || streamClient.userID) {
      console.log("⚠️ Stream already connected, skipping connectUser");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      console.log("📤 Upserting user in Convex");

      // 1️⃣ Save user in Convex
      await createOrUpdateUser({
        userID: user.id,
        name:
          user.fullName ||
          user.firstName ||
          user.emailAddresses[0]?.emailAddress ||
          "Anonymous",
        email: user.emailAddresses[0]?.emailAddress || "",
        imageURL: user.imageUrl || "",
      });

      console.log("✅ Convex upsertUser finished");

      // 2️⃣ Generate Stream token (STRING, not provider)
      const token = await createToken(user.id);

      // 3️⃣ Connect Stream user (ONCE)
      await streamClient.connectUser(
        {
          id: user.id,
          name:
            user.fullName ||
            user.firstName ||
            user.emailAddresses[0]?.emailAddress ||
            "Anonymous",
          image: user.imageUrl || "",
        },
        token
      );

      hasConnectedRef.current = true;
      console.log("✅ Stream user connected");
    } catch (err) {
      console.error("❌ Error syncing user:", err);
      setError("Failed to sync user data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, createOrUpdateUser]);

  const disconnectUser = useCallback(async () => {
    try {
      if (streamClient.userID) {
        await streamClient.disconnectUser();
        hasConnectedRef.current = false;
        console.log("🔌 Stream user disconnected");
      }
    } catch (err) {
      console.error("Error disconnecting Stream user:", err);
    }
  }, []);

  useEffect(() => {
    if (!isUserLoaded) return;

    if (user) {
      syncUser();
    } else {
      disconnectUser();
      setIsLoading(false);
    }

    // cleanup on unmount / logout
    
  }, [user, isUserLoaded, syncUser, disconnectUser]);

  // 🔄 Loading UI
  if (!isUserLoaded || isLoading) {
    return (
      <LoadingSpinner
        size="lg"
        message={isUserLoaded ? "Syncing user data..." : "Loading user data..."}
        className="w-full h-full flex items-center justify-center"
      />
    );
  }

  // ❌ Error UI
  if (error) {
    return (
      <div>
        <p className="text-red-500">Sync Error</p>
        <p>Please restart the app or contact support.</p>
      </div>
    );
  }

  return <>{children}</>;
}

export default UserSyncWrapper;
