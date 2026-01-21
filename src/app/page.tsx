"use client";

import { useAuth } from "@workos-inc/authkit-nextjs/components";
import { Authenticated, Unauthenticated } from "convex/react";
import Link from "next/link";

export default function Home() {
  const { user, signOut } = useAuth();

  return (
    <div className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <h1>Convex + AuthKit</h1>
        <div className="flex gap-2">
          {user ? (
            <button onClick={() => signOut()} type="button">
              Sign out
            </button>
          ) : (
            <>
              <Link href="/sign-in">
                <button type="button">Sign in</button>
              </Link>
              <Link href="/sign-up">
                <button type="button">Sign up</button>
              </Link>
            </>
          )}
        </div>
      </div>
      <Authenticated>
        <Content />
      </Authenticated>
      <Unauthenticated>
        <p>Please sign in to view data</p>
      </Unauthenticated>
    </div>
  );
}

function Content() {
  const { user } = useAuth({ ensureSignedIn: true });
  return (
    <div>
      Hi {user?.firstName} {user?.lastName}
    </div>
  );
}
