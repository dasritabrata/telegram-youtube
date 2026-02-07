import { Doc } from '@/convex/_generated/dataModel'
import React from 'react'
import { useUserSearch } from '@/hooks/useUserSearch'
import { useUser } from '@clerk/nextjs'
import { Input } from './ui/input';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { Button } from './ui/button';

function UserSearch({
    onSelectUser, placeholder = "Search users...",
    className,
}:
    {
        onSelectUser?: (user: Doc<"users">) => void,
        placeholder?: string,
        className?: string,
    }

) {
    const {searchTerm, setSearchTerm, searchResults, isLoading} = useUserSearch();
    const { user } = useUser()

    const filteredResults = searchResults.filter(
        (searchUser) => searchUser.userId !== user?.id
        );

    const handleSelectUser = (user: (typeof filteredResults)[0]) => {
        onSelectUser?.(user);
        setSearchTerm(""); // Clear search after selection
    };
    const clearSearch = () => {
        setSearchTerm("");
    };

    return (
        <div className={cn("w-full max-w-2xl mx-auto", className)}>
            {/* Search Input */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2
            text-muted-foreground" />
                <Input
                    type="text"
                    placeholder={placeholder}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-10 h-12 text-base"
                />

                {searchTerm && (
                    <button
                        onClick={clearSearch}
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 
               text-muted-foreground hover:text-foreground 
               transition-colors"
                        aria-label="Clear search"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}



            </div>
        </div>
    );
}

export default UserSearch
