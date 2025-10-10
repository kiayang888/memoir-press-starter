
import { notFound } from "next/navigation";
import Link from "next/link";
import { getBook, getChapter, listChapterNumbers } from "@/lib/fs-cms";
import Gallery from "@/components/Gallery";
import { Button } from "@/components/ui/button";

type Props = { params: { slug: string; chapter: string } };
export async function generateStaticParams() { return []; }

export default async function ChapterPage({ params }: Props) {
  const n = Number(params.chapter);
  if (Number.isNaN(n)) return notFound();

  const book = getBook(params.slug);
  if (!book) return notFound();

  const chapter = await getChapter(params.slug, n);
  if (!chapter) return notFound();

  const chapters = listChapterNumbers(params.slug);
  // idx is the position inside `chapters`
  const idx = chapters.indexOf(n);
  const prev = idx > 0 ? chapters[idx - 1] : 0; // when idx===0, prev -> 0
  const next = idx < chapters.length - 1 ? chapters[idx + 1] : null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <nav className="mb-6 text-sm text-neutral-500">
        <Link href="/" className="hover:underline">Home</Link> <span>›</span>{" "}
        <Link href="/books" className="hover:underline">Books</Link> <span>›</span>{" "}
        <Link href={`/books/${book.slug}`} className="hover:underline">{book.meta.title}</Link> <span>›</span>{" "}
        <span className="text-neutral-800">{chapter.title}</span>
      </nav>

      <h1 className="font-serif text-3xl mb-2">{chapter.title}</h1>

      {chapter.audio && (
        <div className="my-4 rounded-xl border bg-white p-4">
          <p className="text-sm mb-2">Audio narration</p>
          <audio controls src={chapter.audio} className="w-full">
            Your browser does not support the audio element.
          </audio>
        </div>
      )}

      <article
  className="
    prose prose-neutral prose-memoir max-w-none
    pt-4 pb-8
  "
  dangerouslySetInnerHTML={{ __html: chapter.html }}
/>
      {chapter.images && chapter.images.length > 0 && (
        <section className="mt-8">
          <h2 className="font-serif text-2xl mb-2">Photos</h2>
          <Gallery images={chapter.images} />
        </section>
      )}

      <div className="mt-10 flex items-center justify-between">
        <div>
          {prev && (
            <Link href={`/books/${book.slug}/chapters/${prev}`}>
              <Button variant="secondary">← Chapter {prev}</Button>
            </Link>
          )}
        </div>
        <div>
          {next && (
            <Link href={`/books/${book.slug}/chapters/${next}`}>
              <Button>Chapter {next} →</Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
