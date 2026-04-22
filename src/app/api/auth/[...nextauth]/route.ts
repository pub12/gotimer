// Route: /api/auth/[...nextauth]
// hazo_auth v5.1.36 handles proxy detection, NEXTAUTH_URL override, and
// params resolution internally. Just re-export the handlers.
export { nextauthGET as GET, nextauthPOST as POST } from "hazo_auth/server/routes";
