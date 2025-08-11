import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const words = fs.readFileSync(path.join(__dirname, "../data/words.txt")).toString().split("\n");
