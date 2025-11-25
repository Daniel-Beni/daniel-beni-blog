'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { cn, getCategoryName } from '@/lib/utils';
import { Category } from '@/types/content';

interface CategoryFilterProps {
  locale: string;
  categories: Category[];
  currentCategory?: string;
}

export function CategoryFilter({
  locale,
  categories,
  currentCategory,
}: CategoryFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleCategoryChange = (category: Category | 'all') => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (category === 'all') {
      params.delete('category');
    } else {
      params.set('category', category);
    }

    const queryString = params.toString();
    const newPath = queryString ? `${pathname}?${queryString}` : pathname;
    router.push(newPath);
  };

  const allCategories: Array<Category | 'all'> = ['all', ...categories];

  return (
    <div className="flex flex-wrap gap-2">
      {allCategories.map((category) => {
        const isActive = category === 'all' 
          ? !currentCategory 
          : category === currentCategory;

        const label = category === 'all'
          ? locale === 'fr' ? 'Tous' : 'All'
          : getCategoryName(category, locale as any);

        return (
          <button
            key={category}
            onClick={() => handleCategoryChange(category)}
            className={cn(
              'rounded-lg px-4 py-2 text-sm font-medium transition-colors',
              isActive
                ? 'bg-primary-600 text-white dark:bg-primary-500'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
            )}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
