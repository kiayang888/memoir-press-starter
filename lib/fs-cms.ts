
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

export type BookMeta = {
  title: string;
  subtitle?: string;
  cover: string;
  description: string;
  tags?: string[];
};

export type ChapterMeta = {
  title: string;
  audio?: string;
  images?: string[];
};

export type Chapter = ChapterMeta & {
  number: number;
  html: string;
};

const ROOT = process.cwd();
const CONTENT_DIR = path.join(ROOT, "content", "books");

export function listBooks(): { slug: string; meta: BookMeta; chapterNumbers: number[] }[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  const slugs = fs.readdirSync(CONTENT_DIR).filter((p) => fs.statSync(path.join(CONTENT_DIR, p)).isDirectory());
  return slugs.map((slug) => {
    const metaPath = path.join(CONTENT_DIR, slug, "_book.json");
    const meta = JSON.parse(fs.readFileSync(metaPath, "utf-8")) as BookMeta;
    const chapterDir = path.join(CONTENT_DIR, slug, "chapters");
    const numbers = fs
      .readdirSync(chapterDir)
      .filter((f) => f.endsWith(".md"))
      .map((f) => parseInt(path.basename(f, ".md"), 10))
      .sort((a, b) => a - b);
    return { slug, meta, chapterNumbers: numbers };
  });
}

export function getBook(slug: string): { slug: string; meta: BookMeta } | null {
  const metaPath = path.join(CONTENT_DIR, slug, "_book.json");
  if (!fs.existsSync(metaPath)) return null;
  const meta = JSON.parse(fs.readFileSync(metaPath, "utf-8")) as BookMeta;
  return { slug, meta };
}

export async function getChapter(slug: string, number: number): Promise<Chapter | null> {
  const chapterPath = path.join(CONTENT_DIR, slug, "chapters", `${number}.md`);
  if (!fs.existsSync(chapterPath)) return null;
  const raw = fs.readFileSync(chapterPath, "utf-8");
  const parsed = matter(raw);
  const fm = parsed.data as ChapterMeta;
  const processed = await remark().use(html).process(parsed.content);
  return {
    number,
    title: fm.title || `Chapter ${number}`,
    audio: fm.audio || "",
    images: Array.isArray(fm.images) ? fm.images : [],
    html: processed.toString(),
  };
}

export function listChapterNumbers(slug: string): number[] {
  const chapterDir = path.join(CONTENT_DIR, slug, "chapters");
  if (!fs.existsSync(chapterDir)) return [];
  return fs
    .readdirSync(chapterDir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => parseInt(path.basename(f, ".md"), 10))
    .sort((a, b) => a - b);
}
