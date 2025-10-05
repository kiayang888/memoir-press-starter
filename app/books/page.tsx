
import Link from "next/link";
import Image from "next/image";
import { listBooks } from "@/lib/fs-cms";

export default function BooksIndex() {
  const books = listBooks();
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-serif text-3xl mb-6">Books</h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {books.map(({ slug, meta }) => (
          <Link key={slug} href={`/books/${slug}`} className="group rounded-2xl border bg-white overflow-hidden">
            <Image src={meta.cover} alt={`${meta.title} cover`} width={800} height={600} className="h-56 w-full object-cover group-hover:opacity-95" />
            <div className="p-4">
              <h3 className="font-serif text-xl">{meta.title}</h3>
              {meta.subtitle && <p className="text-sm text-neutral-600">{meta.subtitle}</p>}
              {meta.description && <p className="text-sm mt-2 text-neutral-700 line-clamp-2">{meta.description}</p>}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
