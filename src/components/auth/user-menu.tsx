"use client";

import { useAuth } from "@workos-inc/authkit-nextjs/components";
import { LogOut, User as UserIcon } from "lucide-react";
import { useTranslations } from "next-intl";
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
 * Shows:
 * - User avatar with initials
 * - Dropdown with user info and sign out action
 *
 * Best practices:
 * - Avatar positioned far right of header (industry standard)
 * - Accessible keyboard navigation
 * - Clear visual feedback on hover/focus
 */
export function UserMenu() {
  const { user, signOut } = useAuth({ ensureSignedIn: true });
  const t = useTranslations("common");

  // Generate user initials for avatar fallback
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

  // Get display name
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
          <AvatarImage
            alt={getDisplayName()}
            src={user?.profilePictureUrl ?? undefined}
          />
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

        <DropdownMenuItem className="cursor-pointer">
          <UserIcon />
          {t("profile")}
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
