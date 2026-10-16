import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AddToCart } from "@/components/AddToCart";
import { formatGHS, getCategory, getProduct } from "@/lib/catalog";

export const metadata: Metadata = { title: "Product — Alanyo Group" };

// Product slugs are runtime data (they will come from the catalogue API), so params are read
// inside a Suspense boundary rather than prerendered.
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

  return (
    <main className="mx-auto grid max-w-[1800px] gap-12 px-5 pb-32 pt-32 sm:px-8 md:grid-cols-12 md:gap-8 lg:px-14 lg:pt-40">
      <div className="md:col-span-7">
        <div className="relative aspect-[4/5] overflow-hidden bg-stone md:aspect-[5/6]">
          {product.image && (
            <Image
              src={product.image}
              alt={product.imageAlt ?? ""}
              fill
              priority
              sizes="(min-width: 768px) 58vw, 100vw"
              className="object-cover"
            />
          )}
        </div>
        <p className="mt-4 text-[10px] uppercase tracking-[0.18em] text-warm">
          Atmosphere photography. Not a product listing.
        </p>
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
        <h1 className="mt-6 text-[clamp(2rem,3.6vw,3.5rem)] font-light leading-[1.06] tracking-[-0.02em]">
          {product.name}
        </h1>
        {product.isSample && (
          <p className="mt-4 text-[11px] uppercase tracking-[0.18em] text-warm">
            Development sample. Not a real product or price.
          </p>
        )}
        <p className="mt-6 text-xl font-light">
          {product.pricePesewas === null ? "Price on request" : formatGHS(product.pricePesewas)}
        </p>
        <p className="mt-8 text-[15px] font-light leading-[1.8] text-ink/75">{product.summary}</p>
        <div className="mt-10">
          <AddToCart product={product} />
        </div>
        <p className="mt-10 border-t border-stone pt-6 text-[13px] font-light leading-[1.7] text-warm">
          Delivery, returns and warranty terms will be confirmed by Alanyo Group before this store opens.
        </p>
      </div>
    </main>
  );
}
