'use client'

import { ClerkProvider } from "@clerk/nextjs";
import UserSyncWrapper from '@/components/UserSyncWrapper';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ClerkProvider>
          <UserSyncWrapper>
            {children}
          </UserSyncWrapper>
        </ClerkProvider>
      </body>
    </html>
  );
}
