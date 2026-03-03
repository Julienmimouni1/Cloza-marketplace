import { Category } from "@/generated/client";
import { MENU_DATA, MenuItem } from "@/lib/menu-data";

/**
 * Resolves a string input to a Category Enum if it matches a main category.
 * Uses strict matching against MENU_DATA titles and known aliases.
 */
export const resolveMainCategory = (input: string): Category | null => {
  const normalized = input.toLowerCase().trim();

  // 1. Direct match with Enum values (case-insensitive)
  if (Object.values(Category).some(c => c.toLowerCase() === normalized)) {
    // Map back to the correct Enum case
    const match = Object.values(Category).find(c => c.toLowerCase() === normalized);
    return match || null;
  }

  // 2. Strict Aliases
  const aliases: Record<string, Category> = {
    'textile': Category.Textile,
    'fashion': Category.Textile,
    'clothing': Category.Textile,
    'clothes': Category.Textile,
    'beauty': Category.Beauty,
    'cosmetics': Category.Beauty,
    'makeup': Category.Beauty,
    'food': Category.Food,
    'groceries': Category.Food,
    'grocery': Category.Food,
  };

  return aliases[normalized] || null;
};

/**
 * Finds the parent Category for a given Sub-Category string.
 * Traverses the MENU_DATA tree to find where this sub-category exists.
 */
export const getParentCategory = (subCategoryName: string): Category | null => {
  const normalize = (s: string) => s.toLowerCase().trim();
  const target = normalize(subCategoryName);

  for (const menu of MENU_DATA) {
    // Check if this menu item maps to a Category
    const category = resolveMainCategory(menu.title);
    if (!category) continue;

    // Search children (Sub-Categories)
    if (menu.children) {
        // BFS or DFS to find the target sub-category
        // Based on MENU_DATA structure: Category -> [Group -> [SubItem]]
        // We need to flatten to find if 'target' is any child title
        const allSubItems = flattenMenuChildren(menu.children);
        if (allSubItems.some(item => normalize(item.title) === target)) {
            return category;
        }
    }
  }
  return null;
};

/**
 * Helper to flatten menu children into a single list of items.
 */
function flattenMenuChildren(items: MenuItem[]): MenuItem[] {
    let result: MenuItem[] = [];
    for (const item of items) {
        result.push(item);
        if (item.children) {
            result = result.concat(flattenMenuChildren(item.children));
        }
    }
    return result;
}

/**
 * Finds the proper display name for a category from MENU_DATA.
 */
export const getCategoryDisplayName = (categoryParam: string): string => {
    const allItems = flattenMenuChildren(MENU_DATA);
    const match = allItems.find(item => {
        const url = new URL(item.href, "http://localhost");
        const cat = url.searchParams.get("category");
        return cat === categoryParam || decodeURIComponent(cat || "") === categoryParam;
    });

    return match ? match.title : categoryParam.replace('-', ' ');
};

/**
 * Returns all sub-categories (leaf nodes) for a given Main Category.
 * Used to populate the sidebar when a Main Category is selected.
 */
export const getAllSubCategoriesForCategory = (category: Category): string[] => {
     const menu = MENU_DATA.find(m => resolveMainCategory(m.title) === category);
     if (!menu || !menu.children) return [];

     // We generally want the leaf nodes (actual clickable sub-cats) or the immediate groups?
     // Based on previous logic, we seem to use the immediate children names OR leaf nodes.
     // Let's grab all titles of the "Leaf" items (items that don't have children or are at the lowest level desired).
     // Actually, looking at MENU_DATA, "Women" is a child of "Textile", and "Tops" is a child of "Women".
     // The sidebar filters usually list the direct sub-groups (Women, Men) OR the specific types (Tops, Bottoms).
     // Let's assume we want ALL unique names found in the tree under this category to allow broad filtering.
     
     const allItems = flattenMenuChildren(menu.children);
     // Filter duplicates
     const uniqueTitles = Array.from(new Set(allItems.map(i => i.title)));
     return uniqueTitles;
};
