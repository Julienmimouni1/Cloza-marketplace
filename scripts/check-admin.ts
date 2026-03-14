import { prisma } from "../src/lib/prisma";
import bcrypt from "bcryptjs";

async function verifyAdminPassword() {
  const adminEmail = 'admin@cloza.com';
  const passwordToTest = 'Admin123!@#$';

  const user = await prisma.user.findUnique({
    where: { email: adminEmail },
    select: { id: true, email: true, password: true }
  });

  if (user && user.password) {
    const isMatch = await bcrypt.compare(passwordToTest, user.password);
    console.log(`🔍 Vérification mot de passe : ${isMatch ? "✅ MATCH" : "❌ NO MATCH"}`);
    
    if (!isMatch) {
       console.log("⚠️ Mot de passe incorrect ou hachage différent. Je vais le réinitialiser...");
       const newHashed = await bcrypt.hash(passwordToTest, 12);
       await prisma.user.update({
          where: { email: adminEmail },
          data: { password: newHashed }
       });
       console.log("✅ Mot de passe réinitialisé pour admin@cloza.com : Admin123!@#$");
    }
  }
}

verifyAdminPassword()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
