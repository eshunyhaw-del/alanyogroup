import Image from "next/image";
import Link from "next/link";
import { formatGHS, type Product } from "@/lib/catalog";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden bg-stone">
        {product.image && (
          <Image
            src={product.image}
            alt={product.imageAlt ?? ""}
            fill
            sizes="(min-width: 768px) 33vw, 100vw"
            className="object-cover transition-transform duration-[1400ms] ease-quiet group-hover:scale-[1.04]"
          />
        )}
        {product.isSample && (
          <span className="absolute left-3 top-3 bg-porcelain px-2 py-1 text-[10px] uppercase tracking-[0.18em]">
            Sample
          </span>
        )}
      </div>
      <div className="mt-5 flex items-baseline justify-between gap-6">
        <h3 className="text-lg font-light tracking-tight">{product.name}</h3>
        <span className="text-[13px] text-warm">
          {product.pricePesewas === null ? "Price on request" : formatGHS(product.pricePesewas)}
        </span>
      </div>
    </Link>
  );
}
