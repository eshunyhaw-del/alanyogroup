import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ButtonLink, PageHeader } from "@/components/PageHeader";
import { ProductCard } from "@/components/ProductCard";
import { categories, getCategory, getProducts } from "@/lib/catalog";

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/collections/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategory(slug);
  return { title: category ? `${category.name} — Alanyo Group` : "Collections — Alanyo Group" };
}

export default async function CategoryPage({ params }: PageProps<"/collections/[slug]">) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();

  const products = getProducts().filter((p) => p.categorySlug === category.slug);

  return (
    <main>
      <PageHeader kicker="Collections" title={category.name} intro={category.blurb} />
      <div className="mx-auto max-w-[1800px] px-5 pb-32 sm:px-8 lg:px-14">
        {products.length > 0 ? (
          <ul className="grid gap-x-6 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <li key={p.slug}>
                <ProductCard product={p} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="max-w-xl border-t border-stone pt-10">
            <p className="text-[15px] font-light leading-[1.8] text-ink/75">
              Products for this collection are being prepared. If you are planning a project, tell us what
              you need and we will help.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <ButtonLink href={`/contact?collection=${category.slug}`}>Make an enquiry</ButtonLink>
              <ButtonLink href="/collections" variant="outline">
                All collections
              </ButtonLink>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
