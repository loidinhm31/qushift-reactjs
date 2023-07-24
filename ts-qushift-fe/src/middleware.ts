export { default } from "next-auth/middleware";

/**
 * Guards these test and redirects them to the sign-in page.
 */
export const config = {
  matcher: ["/account/:path*", "/messages/:path*"],
};
