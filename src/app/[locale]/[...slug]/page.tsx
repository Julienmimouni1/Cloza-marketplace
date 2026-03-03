import CatalogPage from "@/app/[locale]/catalog/page";

// Re-use the CatalogPage logic but transform the slug into a category search parameter
// This is a simple implementation to ensure links work. 
// Ideally, we would parse the slug hierarchy (e.g. beauty-wellness -> facial-care) more strictly.

interface CategoryPageProps {
  params: Promise<{
    slug: string[];
    locale: string;
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function CategoryPage(props: CategoryPageProps) {
  const params = await props.params;
  const searchParams = await props.searchParams;

  // Join the slug parts to form a loose category search string or pick the last part
  // For better accuracy with the current "contains" logic in CatalogPage, 
  // we might just pass the last segment or a formatted version.
  // Example: /beauty-wellness/facial-care -> "facial-care" or "Facial Care"
  
  // A simple strategy for this prototype: 
  // Take the last segment of the slug, replace dashes with spaces, and use that as the category filter.
  const categorySlug = params.slug[params.slug.length - 1];
  const categoryName = categorySlug.replace(/-/g, ' ');

  // Inject the category into searchParams
  const newSearchParams = {
    ...searchParams,
    category: categoryName,
  };

  // Render the existing CatalogPage with the new params
  return <CatalogPage searchParams={Promise.resolve(newSearchParams)} />;
}
