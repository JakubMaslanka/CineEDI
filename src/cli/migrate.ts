import "dotenv/config";
import ws from "ws";
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import * as schema from "../lib/db.schema";

neonConfig.webSocketConstructor = ws;

async function performMigration() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }

  const pool = new Pool({ connectionString });
  pool.on("error", (err) => console.error(err));

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const db = drizzle(client, { schema });
    await migrate(db, { migrationsFolder: "src/migrations" });

    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }

  await pool.end();
}

if (require.main === module) {
  console.log("Performing migration... 💣");

  performMigration()
    .then(() => {
      console.log("Migration complete! 🎉");
      process.exit(0);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
