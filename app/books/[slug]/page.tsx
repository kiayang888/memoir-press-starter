
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getBook, listChapterNumbers } from "@/lib/fs-cms";

type Props = { params: { slug: string } };

export async function generateStaticParams() { return []; }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = getBook(params.slug);
  if (!data) return { title: "Book not found" };
  const { meta } = data;
  return { title: `${meta.title} — MemoryPress`, description: meta.description.slice(0, 140) };
}

export default function BookPage({ params }: Props) {
  const data = getBook(params.slug);
  if (!data) return notFound();
  const { meta } = data;
  const chapters = listChapterNumbers(params.slug);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <nav className="mb-6 text-sm text-neutral-500">
        <Link href="/" className="hover:underline">Home</Link> <span>›</span>{" "}
        <Link href="/books" className="hover:underline">Books</Link> <span>›</span>{" "}
        <span className="text-neutral-800">{meta.title}</span>
      </nav>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="md:col-span-1">
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <Image src={meta.cover} alt={`${meta.title} cover`} width={800} height={1200} className="h-auto w-full object-cover" priority />
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-4">
          <h1 className="font-serif text-3xl">{meta.title}</h1>
          {meta.subtitle && <p className="text-neutral-600">{meta.subtitle}</p>}
          <p className="text-neutral-800">{meta.description}</p>
          {meta.tags && (
            <div className="flex flex-wrap gap-2 pt-2">
              {meta.tags.map(tag => <span key={tag} className="rounded-full border px-3 py-1 text-xs">{tag}</span>)}
            </div>
          )}

          <section className="mt-6">
            <h2 className="font-serif text-2xl mb-2">Chapters</h2>
            <ul className="grid gap-2">
              {chapters.map((n) => (
                <li key={n}>
                  <Link href={`/books/${params.slug}/chapters/${n}`} className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 hover:bg-neutral-50">
                    <span className="text-sm">Chapter {n}</span>
                  </Link>
                </li>
              ))}
              {chapters.length === 0 && <p className="text-sm text-neutral-600">No chapters yet.</p>}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
