import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function addJsExtension(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.lstatSync(fullPath).isDirectory()) {
      addJsExtension(fullPath);
    } else if (fullPath.endsWith(".js")) {
      let content = fs.readFileSync(fullPath, "utf8");
      content = content.replace(/from\s+["'](.+)["']/g, (match, group1) => {
        if (!group1.endsWith(".js") && group1.includes("/")) {
          return match.replace(group1, `${group1}.js`);
        }
        return match;
      });
      fs.writeFileSync(fullPath, content, "utf8");
    }
  }
}

addJsExtension(path.join(__dirname, "../dist"));
