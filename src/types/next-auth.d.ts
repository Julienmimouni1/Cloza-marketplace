import { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: string;
      role: string;
      vendorId?: string | null;
      companyName?: string | null;
      kybStatus?: string;
      isImpersonating?: boolean;
      originalId?: string;
      originalRole?: string;
    } & DefaultSession["user"];
  }

  interface User {
    role: string;
    vendorId?: string | null;
    companyName?: string | null;
    kybStatus?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string;
    vendorId?: string | null;
    companyName?: string | null;
    kybStatus?: string;
    isImpersonating?: boolean;
    originalId?: string;
    originalRole?: string;
  }
}
