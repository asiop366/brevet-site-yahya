import { execSync } from "child_process";
import { writeFileSync } from "fs";

const html = execSync("git show 3d2a987:index.html", { encoding: "utf8" });
const m = html.match(/<script>\n([\s\S]*)<\/script>\n<\/body>/);
if (!m) throw new Error("script not found");
writeFileSync("www/app-engine-base.js", m[1], "utf8");
console.log("extracted", m[1].length, "chars");
