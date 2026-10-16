import { formatGHS, type Product } from "@/lib/catalog";

export function Price({ product, className = "" }: { product: Product; className?: string }) {
  if (product.pricePesewas === null) {
    return <span className={`text-warm ${className}`}>Price on request</span>;
  }
  const showCompare = product.compareAtPesewas !== null && product.compareAtPesewas > product.pricePesewas;
  return (
    <span className={className}>
      <span>{formatGHS(product.pricePesewas)}</span>
      {showCompare && (
        <span className="ml-2 text-warm line-through">
          <span className="sr-only">Previously </span>
          {formatGHS(product.compareAtPesewas!)}
        </span>
      )}
    </span>
  );
}
