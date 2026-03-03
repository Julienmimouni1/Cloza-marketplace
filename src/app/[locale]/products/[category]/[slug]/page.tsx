import { getProductBySlug } from "@/features/catalog/actions";
import { AddToCartButton } from "@/features/cart/components/AddToCartButton";
import { notFound } from "next/navigation";
import { ProductImage } from "@/features/catalog/components/ProductImage";
import { Metadata } from "next";

interface PageProps {
  params: Promise<{
    category: string;
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  const description = product.description.length > 160
    ? product.description.substring(0, 157).split(" ").slice(0, -1).join(" ") + "..."
    : product.description;

  const displayImage = product.images?.find(img => img.isMain)?.url 
    || product.images?.[0]?.url 
    || product.image;

  return {
    title: `${product.title} | Cloza`,
    description,
    alternates: {
      canonical: `/products/${product.category.toLowerCase()}/${slug}`,
    },
    openGraph: {
      images: [displayImage],
      title: product.title,
      description,
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { category, slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // Validate category match (case insensitive)
  if (product.category.toLowerCase() !== category.toLowerCase()) {
    notFound();
  }

  const displayImage = product.images?.find(img => img.isMain)?.url 
    || product.images?.[0]?.url 
    || product.image;

  const cartProduct = {
    id: product.id,
    title: product.title,
    price: product.price, // Keep in cents
    image: displayImage,
    vendorId: product.vendorId, 
    stock: product.stock,
    vatRate: 20 // Default
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column: Image */}
        <div className="relative aspect-square md:aspect-[4/3] w-full overflow-hidden rounded-lg bg-gray-100">
          <ProductImage
            src={displayImage}
            alt={product.title}
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>

        {/* Right Column: Details */}
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{product.title}</h1>
            <p className="text-sm text-gray-500 mt-1">
              Sold by <span className="font-medium text-gray-900">{product.vendor.name}</span>
            </p>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gray-900">
              {(product.price / 100).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
            </span>
            <span className="text-sm text-gray-500">HT</span>
          </div>

          <div className="prose prose-sm text-gray-600">
            <p>{product.description}</p>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between mb-4">
               <span className="text-sm font-medium text-gray-700">Stock Status</span>
               <span className={`text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                 {product.stock > 0 ? `${product.stock} units available` : 'Out of Stock'}
               </span>
            </div>
            
            <AddToCartButton product={cartProduct} variant="full" className="h-12 text-lg" />
          </div>
        </div>
      </div>
    </main>
  );
}