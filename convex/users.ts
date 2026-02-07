import {query,mutation} from "./_generated/server";
import { v } from "convex/values";

export const getUserByClerkID = query({
    args: { userID: v.string() },
    handler: async (ctx,  {userID}) => {
        if(!userID) return null;
        return await ctx.db.query("users").filter((q) => q.eq(q.field("userID"), userID)).first();

    }});

// create or update user
export const upsertUser = mutation({
    args: { userID: v.string(), email: v.string(), name: v.string(), imageURL: v.string() },
    handler: async (ctx, { userID, email, name, imageURL }) => {
        const existingUser = await ctx.db.query("users").filter((q) => q.eq(q.field("userID"), userID)).first();

        if(existingUser) {
            await ctx.db.patch(existingUser._id, {
                name,
                imageURL
            });
            return existingUser._id;
        }
        return await ctx.db.insert("users", {
            userID,
            email,
            name,
            imageURL
        });
    }
});

//Search users by name or email
export const searchUsers = query({
    args: { searchTerm: v.string() },
    handler: async (ctx, { searchTerm }) => {
        if(!searchTerm.trim()) return [];
        const normalizedTerm = searchTerm.toLowerCase().trim();
        const allUsers = await ctx.db.query("users").collect();
        return allUsers.filter(user => 
            user.name.toLowerCase().includes(normalizedTerm) ||
            user.email.toLowerCase().includes(normalizedTerm)
        ).slice(0, 10); // Limit to 10 results  

    },
});

// Return all users (for contacts list)
export const listUsers = query({
    handler: async (ctx) => {
        const allUsers = await ctx.db.query("users").collect();
        return allUsers;
    },
});