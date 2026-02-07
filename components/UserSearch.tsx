import { Doc } from '@/convex/_generated/dataModel'
import React, { useState } from 'react'
import { useUserSearch } from '@/hooks/useUserSearch'
import { useUser } from '@clerk/nextjs'
import { Input } from './ui/input'
import { Search, UserIcon, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { X } from 'lucide-react'
import LoadingSpinner from './LoadingSpinner'

function UserSearch({
  onSelectUser,
  placeholder = 'Search users...',
  className,
}: {
  onSelectUser?: (user: Doc<'users'>) => void
  placeholder?: string
  className?: string
}) {
  const { searchTerm, setSearchTerm, searchResults, isLoading } =
    useUserSearch()
  const { user } = useUser()

  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)

  const filteredResults = searchResults.filter(
    (searchUser) => searchUser.userID !== user?.id
  )

  const handleSelectUser = (selectedUser: (typeof filteredResults)[0]) => {
    setSelectedUserId(selectedUser.userID)
    onSelectUser?.(selectedUser)
    setSearchTerm('')
  }

  const clearSearch = () => {
    setSearchTerm('')
    setSelectedUserId(null)
  }

  return (
    <div className={cn('w-full max-w-2xl mx-auto', className)}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

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
              text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        {/* Search Results */}
        {searchTerm.trim() && (
          <div className="mt-2 bg-card border border-border rounded-lg shadow-lg max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="p-4 flex items-center justify-center gap-2 text-muted-foreground">
                <LoadingSpinner size="sm" inline />
                <span>Searching users…</span>
              </div>
            ) : filteredResults.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                <UserIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>
                  No users found for{' '}
                  <span className="font-medium">&quot;{searchTerm}&quot;</span>
                </p>
              </div>
            ) : (
              <div className="p-1">
                {filteredResults.map((resultUser) => {
                  const isSelected =
                    selectedUserId === resultUser.userID

                  return (
                    <div
                      key={resultUser.userID}
                      onClick={() => handleSelectUser(resultUser)}
                      className={cn(
                        'flex items-center gap-3 p-2 rounded-md cursor-pointer transition-colors',
                        'hover:bg-muted',
                        isSelected && 'bg-muted'
                      )}
                    >
                      {/* Avatar */}
                      <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                        {resultUser.imageURL ? (
                          <img
                            src={resultUser.imageURL}
                            alt={resultUser.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <UserIcon className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>

                      {/* Name */}
                      <span className="flex-1 font-medium">
                        {resultUser.name}
                      </span>

                      {/* Selection indicator */}
                      {isSelected && (
                        <Check className="h-4 w-4 text-primary" />
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default UserSearch
