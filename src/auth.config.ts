import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    // Authorized callback is used by Middleware
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const userRole = (auth?.user as any)?.role;
      const isAdmin = userRole === "ADMIN";
      const isVendor = userRole === "VENDOR" || userRole === "SELLER"; // Handle potential role naming variations
      
      const pathname = nextUrl.pathname;
      // Strip locale prefix (e.g., /fr/vendor -> /vendor)
      const pathWithoutLocale = pathname.replace(/^\/(en|fr)/, "") || "/";

      const isProtectedRoute = ["/checkout", "/dashboard", "/profile", "/vendor"].some((route) =>
        pathWithoutLocale.startsWith(route)
      );
      
      const isAdminRoute = pathWithoutLocale.startsWith("/admin");
      const isVendorRoute = pathWithoutLocale.startsWith("/vendor");

      // 1. Admin Routes Protection
      if (isAdminRoute) {
        if (isLoggedIn && isAdmin) return true;
        if (isLoggedIn && !isAdmin) return Response.redirect(new URL("/dashboard", nextUrl)); // Fallback
        return false; // Redirect unauthenticated
      }

      // 2. Vendor Routes Protection
      if (isVendorRoute) {
        if (isLoggedIn && (isVendor || isAdmin)) return true; // Admins can see vendor views usually, or we block
        if (isLoggedIn && !isVendor) return Response.redirect(new URL("/dashboard", nextUrl));
        return false;
      }

      // 3. General Protected Routes
      if (isProtectedRoute) {
        if (isLoggedIn) return true;
        return false;
      } 
      
      // 4. Auth Pages Redirection (Already Logged In)
      else if (isLoggedIn && (pathWithoutLocale === "/login" || pathWithoutLocale === "/register")) {
        // Detect current locale to avoid double redirect
        const locale = pathname.startsWith("/en") ? "/en" : pathname.startsWith("/fr") ? "/fr" : "";
        
        // Smart Redirect based on Role
        if (isAdmin) return Response.redirect(new URL(`${locale}/admin`, nextUrl));
        if (isVendor) return Response.redirect(new URL(`${locale}/vendor`, nextUrl));
        return Response.redirect(new URL(`${locale}/dashboard`, nextUrl));
      }
      return true;
    },
    // JWT callback to persist role from user to token
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.role = user.role;
        token.companyName = (user as any).companyName;
        token.kybStatus = (user as any).kybStatus;
      }
      
      // Handle session update (client-side trigger)
      if (trigger === "update" && session) {
          if (session.isImpersonating !== undefined) {
             token.isImpersonating = session.isImpersonating;
             token.originalId = session.originalId;
             token.originalRole = session.originalRole;
             token.sub = session.targetId || token.sub;
             // Note: Full data refresh handled in lib/auth.ts for server-side consistency,
             // but we pass basics here for Edge compatibility if needed.
          } else {
             token.companyName = session.companyName;
             token.kybStatus = session.kybStatus;
          }
      }
      return token;
    },
    // Session callback to map token fields to session.user
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub as string;
        (session.user as any).role = token.role as string;
        (session.user as any).companyName = token.companyName as string;
        (session.user as any).kybStatus = token.kybStatus as string;
        (session.user as any).isImpersonating = token.isImpersonating as boolean;
        (session.user as any).originalId = token.originalId as string;
      }
      return session;
    },
  },
  providers: [], // Add providers with an empty array for now
  secret: process.env.AUTH_SECRET,
} satisfies NextAuthConfig;
