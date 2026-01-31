import { cookies } from "next/headers";

export async function getServerTheme() {
  const cookieStore = await cookies();
  const themeCookie = cookieStore.get("theme")?.value;
  return themeCookie === "dark" || themeCookie === "light"
    ? themeCookie
    : "dark"; // force dark on first visit
}
