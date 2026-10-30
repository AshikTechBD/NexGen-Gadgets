// One-time final verification and commit near the end of the 3-hour exam window.
// Run with --dry-run to inspect; the scheduled task uses --finalize.
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import { existsSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const require = createRequire(import.meta.url);
const git = (...args) => execFileSync("git", args, { cwd: root, encoding: "utf8" }).trim();
const mode = process.argv[2];

if (mode !== "--dry-run" && mode !== "--finalize") {
    throw new Error("Use --dry-run or --finalize explicitly.");
}

const initialCommit = git("rev-list", "--max-parents=0", "HEAD").split("\n")[0];
const firstDate = new Date(git("show", "-s", "--format=%aI", initialCommit));
const deadline = new Date(firstDate.getTime() + 3 * 60 * 60 * 1000);
const finalTarget = new Date(deadline.getTime() - 2 * 60 * 1000);
const now = new Date();
const stamp = (date) => new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Dhaka", dateStyle: "medium", timeStyle: "medium"
}).format(date) + " (UTC+06:00)";

if (mode === "--finalize" && (now < firstDate.getTime() + 2 * 60 * 60 * 1000 ||
    now > deadline.getTime() - 60 * 1000)) {
    throw new Error(`Refusing an early/late final commit: ${stamp(now)}; deadline ${stamp(deadline)}.`);
}

const status = git("status", "--porcelain");
if (status) throw new Error("Working tree has changes; refusing to stage or overwrite user work:\n" + status);
git("diff", "--check");
git("log", "--oneline", "-10");

const checks = ["script.js", "catalog.js", "apple-products.js", "dazzle-data.js", "dazzle-products.js"];
for (const file of checks) {
    execFileSync(process.execPath, ["--check", file], { cwd: root, stdio: "pipe" });
}
for (const page of ["index.html", "products.html", "contact.html"]) {
    if (!existsSync(new URL("../" + page, import.meta.url))) throw new Error("Missing " + page);
}

const apple = require("../apple-products.js");
const dazzle = require("../dazzle-data.js");
const featuredAndBundles = 100;
const total = featuredAndBundles + apple.length + dazzle.length;
if (apple.length !== 144 || dazzle.length !== 1258 || total !== 1502) {
    throw new Error(`Catalog mismatch: ${apple.length} Apple + ${dazzle.length} Dazzle + 100 base.`);
}

console.log(`Verified ${total} product listings and ${checks.length} JavaScript files.`);
console.log(`First commit: ${stamp(firstDate)}; deadline: ${stamp(deadline)}.`);
console.log(`Target final commit: ${stamp(finalTarget)}.`);
if (mode === "--dry-run") {
    console.log("Dry run complete: no file, commit, or push was created.");
} else {
    const report = `# NexGen Gadgets — final submission check\n\n` +
        `Verified: ${stamp(now)}\n\n` +
        `- Home, Products, and Contact pages are present.\n` +
        `- ${total} product listings: ${featuredAndBundles} initial products, ${apple.length} Apple Gadgets BD listings, and ${dazzle.length} Dazzle phone listings.\n` +
        `- ${checks.length} JavaScript files passed syntax validation.\n` +
        `- First commit: ${stamp(firstDate)}. Three-hour deadline: ${stamp(deadline)}.\n` +
        `- Public catalog references: [Apple Gadgets BD](https://www.applegadgetsbd.com/brands/apple) and [Dazzle](https://dazzle.com.bd/categories/phones). Listed prices are a 30 October 2026 snapshot; confirm current prices before ordering.\n\n` +
        `## Publish on Netlify\n\n` +
        `Import [the GitHub repository](https://github.com/AshikTechBD/NexGen-Gadgets) into Netlify, using the included \`netlify.toml\` configuration. Hosting requires the site owner's Netlify sign-in.\n`;
    const reportPath = new URL("../PROJECT_STATUS.md", import.meta.url);
    if (existsSync(reportPath)) throw new Error("PROJECT_STATUS.md already exists; refusing to overwrite it.");
    writeFileSync(reportPath, report, "utf8");
    git("add", "--", "PROJECT_STATUS.md");
    git("diff", "--cached", "--check");
    const message = git("commit", "-m", "Record final catalog validation and Netlify publish steps");
    console.log(message);
    process.env.GIT_TERMINAL_PROMPT = "0";
    process.env.GCM_INTERACTIVE = "never";
    console.log(git("push", "origin", "master"));
}
