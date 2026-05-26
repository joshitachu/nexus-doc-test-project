import { readdir } from "node:fs/promises";

export async function loadRules(directoryUrl) {
  const files = await readdir(directoryUrl);
  const ruleFiles = files.filter((file) => file.endsWith(".rule.js")).sort();
  const modules = await Promise.all(ruleFiles.map((file) => import(new URL(file, directoryUrl))));

  return modules.map((module) => module.default);
}
