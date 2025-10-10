import fs from "node:fs/promises";
import path from "node:path";
import { cache } from "react";

/** Pull a number out of a string like "chapter-01.mdx" → 1; "0.md" → 0 */
function extractFirstNumber(input: string): number | null {
  const m = input.match(/\d+/);
  if (!m) return null;
  return parseInt(m[0], 10);
}

/** Sort helper */
function numericAsc(a: number, b: number) {
  return a - b;
}

/**
 * Finds the first chapter path for a given book slug by:
 * 1️⃣ Checking for a chapters array in _book.json (if it exists)
 * 2️⃣ Scanning /chapters folder for numbered files/folders
 * 3️⃣ Falling back to /chapters/0
 */
export const getFirstChapterHref = cache(async (slug: string) => {
  const bookDir = path.join(process.cwd(), "content", "books", slug);
  const bookJsonPath = path.join(bookDir, "_book.json");
  const chaptersDir = path.join(bookDir, "chapters");

  // Try _book.json first
  try {
    const raw = await fs.readFile(bookJsonPath, "utf8");
    const data = JSON.parse(raw);
    const chapters = data?.chapters ?? data?.Chapters ?? null;

    if (Array.isArray(chapters) && chapters.length > 0) {
      const nums = chapters
        .map((c: any) =>
          Number.isInteger(c?.n)
            ? c.n
            : extractFirstNumber(String(c?.slug ?? c?.id ?? c?.title ?? ""))
        )
        .filter((v): v is number => Number.isInteger(v))
        .sort(numericAsc);

      if (nums.length > 0) return `/books/${slug}/chapters/${nums[0]}`;
      const firstTitle = String(chapters[0]?.title ?? "").toLowerCase();
      const looksOneIndexed =
        firstTitle.includes("chapter 1") || firstTitle.includes("chap 1");
      return `/books/${slug}/chapters/${looksOneIndexed ? 1 : 0}`;
    }
  } catch {
    // Ignore missing _book.json
  }

  // Otherwise scan /chapters directory
  try {
    const entries = await fs.readdir(chaptersDir, { withFileTypes: true });
    const nums = entries
      .map((e) => extractFirstNumber(e.name))
      .filter((n): n is number => Number.isInteger(n))
      .sort(numericAsc);

    if (nums.length > 0) return `/books/${slug}/chapters/${nums[0]}`;
  } catch {
    // Ignore missing /chapters
  }

  // Default
  return `/books/${slug}/chapters/0`;
});
