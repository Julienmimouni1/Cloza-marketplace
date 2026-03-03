import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface PolicyData {
  title: string;
  lastUpdated: string;
  content: string;
  slug: string;
}

/**
 * Reads a markdown policy file from src/content/legal/{locale}/{slug}.md
 * @param locale 'fr' or 'en'
 * @param slug 'privacy', 'refund', 'shipping', 'terms'
 */
export async function getPolicyContent(locale: string, slug: string): Promise<PolicyData | null> {
  try {
    const contentDir = path.join(process.cwd(), 'src/content/legal', locale);
    const filePath = path.join(contentDir, `${slug}.md`);

    if (!fs.existsSync(filePath)) {
      console.warn(`Policy file not found: ${filePath}`);
      return null;
    }

    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      title: data.title || '',
      lastUpdated: data.lastUpdated || '',
      content: content,
      slug: slug,
    };
  } catch (error) {
    console.error(`Error reading policy content for ${slug} (${locale}):`, error);
    return null;
  }
}
