import Image from "next/image";
import Link from "next/link";
import { Price } from "@/components/Price";
import type { Product } from "@/lib/catalog";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="relative grid aspect-[4/5] place-items-center overflow-hidden bg-white">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.imageAlt ?? product.name}
            fill
            sizes="(min-width: 768px) 33vw, 100vw"
            className="object-contain p-4 transition-transform duration-[1400ms] ease-quiet group-hover:scale-[1.04]"
          />
        ) : (
          <span className="px-6 text-center text-[10px] uppercase tracking-[0.2em] text-warm">
            Photography to come
          </span>
        )}
        {!product.inStock && (
          <span className="absolute left-3 top-3 bg-porcelain px-2 py-1 text-[10px] uppercase tracking-[0.18em]">
            Out of stock
          </span>
        )}
      </div>
      <div className="mt-5 flex items-baseline justify-between gap-6">
        <div>
          <h3 className="text-lg font-light leading-snug tracking-tight">{product.name}</h3>
          {product.sku && <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-warm">{product.sku}</p>}
        </div>
        <Price product={product} className="shrink-0 text-right text-[14px]" />
      </div>
    </Link>
  );
}
