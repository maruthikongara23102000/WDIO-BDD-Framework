import dotenv from "dotenv";
import path from "node:path";

const envPath = path.resolve(process.cwd(), "e2e/.env.local");
dotenv.config({ path: envPath });
