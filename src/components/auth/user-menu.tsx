"use client";

import { useAuth } from "@workos-inc/authkit-nextjs/components";
import { api } from "convex/_generated/api";
import { useQuery } from "convex/react";
import { LogOut, Settings } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/**
 * User menu dropdown for authenticated users.
 *
 * Shows user avatar (preferring Convex-stored avatar over WorkOS profile picture)
 * with dropdown for profile, settings, and sign out.
 */
export function UserMenu() {
  const { user, signOut } = useAuth({ ensureSignedIn: true });
  const t = useTranslations("common");

  const convexUser = useQuery(api.users.getUser);
  const storedAvatarUrl = useQuery(
    api.tasks.getStorageUrl,
    convexUser?.avatarId ? { storageId: convexUser.avatarId } : "skip"
  );

  // Prefer stored avatar > WorkOS profile picture > initials
  const avatarSrc =
    storedAvatarUrl ?? user?.profilePictureUrl ?? undefined;

  const getInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user?.firstName) {
      return user.firstName.slice(0, 2).toUpperCase();
    }
    if (user?.email) {
      return user.email.slice(0, 2).toUpperCase();
    }
    return "U";
  };

  const getDisplayName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user?.firstName) {
      return user.firstName;
    }
    return user?.email?.split("@")[0] || "User";
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 rounded-full focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
        <Avatar className="size-9 cursor-pointer transition-opacity hover:opacity-80">
          <AvatarImage alt={getDisplayName()} src={avatarSrc} />
          <AvatarFallback className="bg-primary text-primary-foreground text-xs">
            {getInitials()}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="font-medium text-sm leading-none">
              {getDisplayName()}
            </p>
            {user?.email && (
              <p className="text-muted-foreground text-xs leading-none">
                {user.email}
              </p>
            )}
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href="/settings">
            <Settings />
            {t("settings")}
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => signOut()}
          variant="destructive"
        >
          <LogOut />
          {t("signOut")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
