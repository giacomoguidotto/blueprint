import resend from "@convex-dev/resend/convex.config";
import workOSAuthKit from "@convex-dev/workos-authkit/convex.config";
import { defineApp } from "convex/server";

const app = defineApp();
app.use(workOSAuthKit);
app.use(resend);
export default app;
