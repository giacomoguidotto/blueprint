import { withAuth } from "@workos-inc/authkit-nextjs";
import { SettingsClient } from "./settings-client";

export default async function SettingsPage() {
  await withAuth({ ensureSignedIn: true });
  return <SettingsClient />;
}
