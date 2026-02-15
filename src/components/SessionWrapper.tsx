"use client";

/**
 * SessionWrapper - Better Auth Compatibility
 *
 * Better Auth doesn't require a session provider wrapper like NextAuth did.
 * This component is kept as a simple passthrough for backward compatibility.
 *
 * If you want to completely remove it, you can safely delete this file and
 * remove the <SessionWrapper> usage from layout.tsx.
 */

import React from 'react'

const SessionWrapper = ({children}: {children: React.ReactNode}) => {
  return <>{children}</>;
}

export default SessionWrapper