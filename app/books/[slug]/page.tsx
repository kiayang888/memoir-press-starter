import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getBook, listChapterNumbers, getChapter } from "@/lib/fs-cms";

type Props = { params: { slug: string } };

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = getBook(params.slug);
  if (!data) return { title: "Book not found" };
  const { meta } = data;
  return {
    title: `${meta.title} — MemoryPress`,
    description: meta.description.slice(0, 140),
  };
}

// Simple helpers to create a clean excerpt from chapter HTML
function stripHtml(html: string) {
  // remove tags
  const text = html.replace(/<[^>]+>/g, " ");
  // decode a few common entities (quick + good enough)
  const decoded = text
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
  // collapse whitespace
  return decoded.replace(/\s+/g, " ").trim();
}

function makeExcerpt(html: string, max = 140) {
  const t = stripHtml(html);
  if (t.length <= max) return t;
  const cut = t.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > 60 ? cut.slice(0, lastSpace) : cut).trim() + "…";
}

export default async function BookPage({ params }: Props) {
  const data = getBook(params.slug);
  if (!data) return notFound();
  const { meta } = data;

  // 1) numbers -> 2) fetch each chapter for titles & excerpts
  const numbers = listChapterNumbers(params.slug);
  const chapters = await Promise.all(
    numbers.map(async (n) => {
      const ch = await getChapter(params.slug, n);
      return {
        number: n,
        title: ch?.title || `Chapter ${n}`,
        excerpt: ch ? makeExcerpt(ch.html, 160) : "",
      };
    })
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <nav className="mb-6 text-sm text-neutral-500">
        <Link href="/" className="hover:underline">Home</Link> <span>›</span>{" "}
        <Link href="/books" className="hover:underline">Books</Link> <span>›</span>{" "}
        <span className="text-neutral-800">{meta.title}</span>
      </nav>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* Left: cover */}
        <div className="md:col-span-1">
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <Image
                src={meta.cover}
                alt={`${meta.title} cover`}
                width={800}
                height={1200}
                className="h-auto w-full object-cover"
                priority
              />
            </CardContent>
          </Card>
        </div>

        {/* Right: details + chapters */}
        <div className="md:col-span-2 space-y-4">
          <h1 className="font-serif text-3xl">{meta.title}</h1>
          {meta.subtitle && <p className="text-neutral-600">{meta.subtitle}</p>}
          <p className="text-neutral-800">{meta.description}</p>

          {meta.tags && (
            <div className="flex flex-wrap gap-2 pt-2">
              {meta.tags.map((tag) => (
                <span key={tag} className="rounded-full border px-3 py-1 text-xs">
                  {tag}
                </span>
              ))}
            </div>
          )}

          <section className="mt-6">
            <div className="mb-2 flex items-baseline justify-between">
              <h2 className="font-serif text-2xl">Chapters</h2>
              {chapters.length > 0 && (
                <span className="text-xs text-neutral-500">
                  {chapters.length} {chapters.length === 1 ? "chapter" : "chapters"}
                </span>
              )}
            </div>

            {/* Card grid of chapters with title + excerpt */}
            {chapters.length === 0 ? (
              <p className="text-sm text-neutral-600">No chapters yet.</p>
            ) : (
              <ul className="grid gap-3 sm:grid-cols-2">
                {chapters.map((ch) => (
                  <li key={ch.number}>
                    <Link
                      href={`/books/${params.slug}/chapters/${ch.number}`}
                      className="block"
                      aria-label={`Open Chapter ${ch.number}: ${ch.title}`}
                    >
                      <Card className="h-full transition-shadow hover:shadow-md">
                        <CardContent className="p-4">
                          <div className="mb-1 text-xs text-neutral-500">
                            Chapter {ch.number}
                          </div>
                          <div className="font-medium text-neutral-900">
                            {ch.title}
                          </div>
                          {ch.excerpt && (
                            <p className="mt-2 line-clamp-3 text-sm text-neutral-700">
                              {ch.excerpt}
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
