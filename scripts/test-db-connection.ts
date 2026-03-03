import 'dotenv/config';
import { Pool } from 'pg';

async function test() {
  console.log("Tentative de connexion avec :", process.env.DATABASE_URL);
  const pool = new Pool({ 
    connectionString: process.env.DATABASE_URL,
    connectionTimeoutMillis: 5000,
  });
  
  try {
    const res = await pool.query('SELECT email, role FROM "User" LIMIT 1');
    console.log("✅ CONNEXION RÉUSSIE !");
    console.log("Données reçues :", res.rows);
  } catch (err: any) {
    console.error("❌ ÉCHEC DE LA CONNEXION !");
    console.error("Détails de l'erreur :", err.message);
  } finally {
    await pool.end();
  }
}

test();
