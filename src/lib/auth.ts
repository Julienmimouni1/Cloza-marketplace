import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { authConfig } from "@/auth.config";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma) as any,
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        console.log("JWT: Nouvel utilisateur connecté", user.email);
        token.role = user.role;
        token.companyName = (user as any).companyName;
        token.kybStatus = (user as any).kybStatus;
      }
      
      // Handle session update
      if (trigger === "update" && session) {
          console.log("JWT: Mise à jour de session demandée");
          if (session.isImpersonating !== undefined) {
            token.isImpersonating = session.isImpersonating;
            token.originalRole = session.originalRole;
            token.originalId = session.originalId;
            token.sub = session.targetId || token.sub;
            
            if (session.targetId) {
              const targetUser = await prisma.user.findUnique({ where: { id: session.targetId } });
              if (targetUser) {
                token.role = targetUser.role;
                token.companyName = targetUser.companyName;
                token.kybStatus = targetUser.kybStatus;
                token.name = targetUser.name;
                token.email = targetUser.email;
              }
            }
          } else {
            token.companyName = session.companyName;
            token.kybStatus = session.kybStatus;
          }
      }

      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub as string;
        session.user.role = token.role as string;
        session.user.companyName = token.companyName as string;
        session.user.kybStatus = token.kybStatus as string;
        
        session.user.isImpersonating = token.isImpersonating as boolean;
        session.user.originalId = token.originalId as string;
        session.user.originalRole = token.originalRole as string;

        if (session.user.id) {
          try {
            console.log("Session: Recherche du vendorId pour l'utilisateur", session.user.id);
            const vendor = await prisma.vendor.findUnique({ 
              where: { userId: session.user.id },
              select: { id: true }
            });
            session.user.vendorId = vendor?.id || null;
            console.log("Session: vendorId trouvé :", session.user.vendorId);
          } catch (e) {
            console.error("Session: Erreur lors de la récupération du vendorId :", e);
            session.user.vendorId = null;
          }
        }
      }
      return session;
    },
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        console.log("Tentative de connexion pour :", credentials?.email);
        const parsedCredentials = z
          .object({ 
            email: z.string().email(), 
            password: z.string().min(6) // Match registration min length for consistency
          })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          try {
            const user = await prisma.user.findUnique({ where: { email } });
            console.log("Utilisateur trouvé dans la DB :", !!user);
            
            if (!user || !user.password) {
              console.log("Échec : Utilisateur non trouvé ou sans mot de passe");
              return null;
            }
            
            const passwordsMatch = await bcrypt.compare(password, user.password);
            console.log("Match du mot de passe :", passwordsMatch);

            if (passwordsMatch) return user;
          } catch (dbError) {
            console.error("Erreur de connexion à la base de données pendant l'auth :", dbError);
            throw new Error("DB_CONNECTION_ERROR");
          }
        }

        console.log("Échec de la validation des champs ou mot de passe incorrect");
        return null;
      },
    }),
  ],
});
