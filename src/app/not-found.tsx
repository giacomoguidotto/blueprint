import { FileQuestion, Sparkles } from "lucide-react";
import { Inter, Space_Mono } from "next/font/google";
import Link from "next/link";
import { cn } from "@/lib/utils";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const spaceMono = Space_Mono({
  variable: "--font-mono",
  weight: ["400", "700"],
  subsets: ["latin"],
});

export default function RootNotFound() {
  return (
    <html className="dark" lang="en">
      <body className={cn(inter.variable, spaceMono.variable, "antialiased")}>
        <div className="flex min-h-screen flex-col">
          <header className="glass sticky top-0 z-50 border-b bg-background/80">
            <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4">
              <div className="flex items-center gap-3">
                <Link
                  className="flex items-center gap-2 transition-opacity hover:opacity-80"
                  href="/en"
                >
                  <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
                    <Sparkles className="size-4 text-primary-foreground" />
                  </div>
                  <span className="hidden font-mono font-semibold text-lg sm:inline-block">
                    Blueprint
                  </span>
                </Link>
              </div>
            </div>
          </header>

          <main className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center">
            <FileQuestion className="mb-6 size-16 text-muted-foreground/50" />
            <h1 className="mb-2 font-bold font-mono text-6xl tracking-tighter">
              404
            </h1>
            <p className="mb-1 font-mono text-xl">Page not found</p>
            <p className="mb-8 text-muted-foreground">
              The page you&apos;re looking for doesn&apos;t exist or has been
              moved.
            </p>
            <Link
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground text-sm shadow-xs transition-colors hover:bg-primary/90"
              href="/en"
            >
              Go Home
            </Link>
          </main>
        </div>
      </body>
    </html>
  );
}
