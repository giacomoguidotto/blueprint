"use client";

import { useAuth } from "@workos-inc/authkit-nextjs/components";
import { Authenticated } from "convex/react";
import { Database, Home } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "@/i18n/routing";

export default function DashboardPage() {
  return (
    <Authenticated>
      <DashboardContent />
    </Authenticated>
  );
}

function DashboardContent() {
  const { user } = useAuth({ ensureSignedIn: true });

  return (
    <div className="container mx-auto space-y-8 px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="font-bold text-3xl tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.firstName || "there"}
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/">
            <Home className="size-4" />
            Home
          </Link>
        </Button>
      </div>

      {/* Example Content */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="size-5" />
              Database Ready
            </CardTitle>
            <CardDescription>
              Your Convex backend is configured and ready to use
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Badge variant="secondary">
              Schema defined in convex/schema.ts
            </Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Build Your App</CardTitle>
            <CardDescription>
              This is a placeholder. Replace with your application logic.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              Check out the example tasks schema and queries in the convex/
              directory.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Next Steps</CardTitle>
            <CardDescription>
              Start building with the provided template
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm">
              • Define your schema
              <br />• Create queries & mutations
              <br />• Build your UI components
              <br />• Deploy to production
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
