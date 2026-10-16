import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCart } from "@/components/AddToCart";
import { Price } from "@/components/Price";
import { getCategory, getProduct, getProducts } from "@/lib/catalog";

export function generateStaticParams() {
  return getProducts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/products/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  return {
    title: product ? `${product.name} — Alanyo Group` : "Product — Alanyo Group",
    description: product?.summary || undefined,
  };
}

export default async function ProductPage({ params }: PageProps<"/products/[slug]">) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();
  const category = getCategory(product.categorySlug);

  return (
    <main className="mx-auto grid max-w-[1800px] gap-12 px-5 pb-32 pt-32 sm:px-8 md:grid-cols-12 md:gap-8 lg:px-14 lg:pt-40">
      <div className="md:col-span-7">
        <div className="relative grid aspect-[4/5] place-items-center overflow-hidden bg-stone md:aspect-[5/6]">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.imageAlt ?? product.name}
              fill
              priority
              sizes="(min-width: 768px) 58vw, 100vw"
              className="object-cover"
            />
          ) : (
            <span className="text-[10px] uppercase tracking-[0.2em] text-warm">Photography to come</span>
          )}
        </div>
      </div>

      <div className="md:col-span-4 md:col-start-9 md:pt-8">
        {category && (
          <Link
            href={`/collections/${category.slug}`}
            className="text-[11px] font-medium uppercase tracking-[0.22em] text-warm hover:text-ink"
          >
            {category.name}
          </Link>
        )}
        <h1 className="mt-6 text-[clamp(1.75rem,3.2vw,3rem)] font-light leading-[1.1] tracking-[-0.02em]">
          {product.name}
        </h1>
        {product.sku && (
          <p className="mt-3 text-[11px] uppercase tracking-[0.18em] text-warm">Model {product.sku}</p>
        )}
        <p className="mt-6 text-xl font-light">
          <Price product={product} />
        </p>
        {product.summary && (
          <p className="mt-8 text-[15px] font-light leading-[1.8] text-ink/75">{product.summary}</p>
        )}
        <div className="mt-10">
          <AddToCart product={product} />
        </div>
        <p className="mt-10 border-t border-stone pt-6 text-[13px] font-light leading-[1.7] text-warm">
          Delivery, returns and warranty terms will be confirmed by Alanyo Group before this store opens.
        </p>
      </div>

      {(product.features.length > 0 || product.specs.length > 0) && (
        <div className="grid gap-12 border-t border-stone pt-16 md:col-span-12 md:grid-cols-12 md:gap-8">
          {product.features.length > 0 && (
            <section className="md:col-span-6">
              <h2 className="mb-6 text-[11px] font-medium uppercase tracking-[0.22em] text-warm">Features</h2>
              <ul className="space-y-3 text-[15px] font-light leading-[1.7] text-ink/80">
                {product.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </section>
          )}
          {product.specs.length > 0 && (
            <section className="md:col-span-4 md:col-start-9">
              <h2 className="mb-6 text-[11px] font-medium uppercase tracking-[0.22em] text-warm">Details</h2>
              <dl className="divide-y divide-stone text-[14px] font-light">
                {product.specs.map((s) => (
                  <div key={s.name} className="flex justify-between gap-6 py-3">
                    <dt className="text-warm">{s.name}</dt>
                    <dd className="text-right">{s.value}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}
        </div>
      )}
    </main>
  );
}
