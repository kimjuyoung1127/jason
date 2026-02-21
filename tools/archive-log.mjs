/** This file appends a compact JSONL record to archive/index.jsonl for RAG ingestion. */
import { appendFileSync } from "node:fs";

const [summary = "", tags = "", files = "", session = "manual"] = process.argv.slice(2);
if (!summary) {
  console.error("Usage: node tools/archive-log.mjs \"summary\" \"tag1,tag2\" \"file1,file2\" \"session-id\"");
  process.exit(1);
}

const line = JSON.stringify({
  ts: new Date().toISOString(),
  session,
  summary,
  tags: tags ? tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
  files: files ? files.split(",").map((f) => f.trim()).filter(Boolean) : []
});

appendFileSync("archive/index.jsonl", `${line}\n`, "utf8");
console.log("archive/index.jsonl updated");