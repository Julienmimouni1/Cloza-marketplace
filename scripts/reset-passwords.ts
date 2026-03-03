import { prisma } from "../src/lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  const password = process.env.DEFAULT_USER_PASSWORD || "password123";
  const hashedPassword = await bcrypt.hash(password, 10);

  const users = [
    "admin@cloza.com",
    "sophie@example.com",
    "test@cloza.com",
    "testboutique@junaid.com",
    "testacheteur@acheteur.com"
  ];

  console.log(`Réinitialisation des mots de passe pour ${users.length} utilisateurs...`);

  for (const email of users) {
    try {
      await prisma.user.update({
        where: { email },
        data: { password: hashedPassword },
      });
      console.log(`✅ Mot de passe réinitialisé pour : ${email}`);
    } catch (e) {
      console.error(`❌ Impossible de mettre à jour ${email} : l'utilisateur n'existe peut-être pas.`);
    }
  }

  console.log("Terminé !");
  console.log(`Les mots de passe ont été réinitialisés avec le mot de passe par défaut configuré.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
