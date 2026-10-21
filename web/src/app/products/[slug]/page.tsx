import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AddToCart } from "@/components/AddToCart";
import { ProductGallery } from "@/components/ProductGallery";
import { Price } from "@/components/Price";
import { ProductCard } from "@/components/ProductCard";
import { RiseIn } from "@/components/RiseIn";
import { getCategory, getProduct, getProducts, similarProducts } from "@/lib/catalog";

export function generateStaticParams() {
  return getProducts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/products/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  return {
    title: product ? `${product.name} | Alanyo Group` : "Product | Alanyo Group",
    description: product?.summary || undefined,
  };
}

export default function ProductPage({ params }: PageProps<"/products/[slug]">) {
  return (
    <Suspense fallback={<div className="min-h-svh" />}>
      <ProductDetail params={params} />
    </Suspense>
  );
}

async function ProductDetail({ params }: { params: PageProps<"/products/[slug]">["params"] }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();
  const category = getCategory(product.categorySlug);
  const similar = similarProducts(product);

  return (
    <main className="mx-auto grid max-w-[1800px] gap-12 px-5 pb-32 pt-32 sm:px-8 md:grid-cols-12 md:gap-8 lg:px-14 lg:pt-40">
      <div className="md:col-span-7">
        <ProductGallery product={product} />
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
          Delivery is described in our{" "}
          <Link href="/delivery" className="border-b border-ink/40 text-ink hover:border-ink">
            shipping policy
          </Link>
          . Broken items can be returned within 7 days (see our{" "}
          <Link href="/returns" className="border-b border-ink/40 text-ink hover:border-ink">
            returns policy
          </Link>
          ), and every purchase has a{" "}
          <Link href="/warranty" className="border-b border-ink/40 text-ink hover:border-ink">
            5-year warranty
          </Link>
          .
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

      {similar.length > 0 && (
        <RiseIn as="section" className="border-t border-stone pt-16 md:col-span-12" >
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-[clamp(1.75rem,3vw,2.75rem)] font-light tracking-[-0.02em]">Similar products</h2>
            {category && (
              <Link
                href={`/collections/${category.slug}`}
                className="border-b border-ink/50 pb-1 text-[11px] font-medium uppercase tracking-[0.2em] hover:opacity-60"
              >
                View all {category.name}
              </Link>
            )}
          </div>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-4 md:gap-x-6">
            {similar.map((p) => (
              <li key={p.slug}>
                <ProductCard product={p} />
              </li>
            ))}
          </ul>
        </RiseIn>
      )}
    </main>
  );
}
