import Link from 'next/link';
import { Calendar, Clock } from 'lucide-react';
import { Article } from '@/types/content';
import { Badge } from '../ui/Badge';
import { Card, CardContent, CardFooter, CardHeader } from '../ui/Card';
import { formatDate, getCategoryColor, getCategoryName } from '@/lib/utils';

interface ArticleCardProps {
  article: Article;
  locale: string;
}

export function ArticleCard({ article, locale }: ArticleCardProps) {
  const { slug, frontmatter, readingTime, type } = article;
  const categoryColor = getCategoryColor(frontmatter.category);
  const categoryName = getCategoryName(frontmatter.category, locale as any);

  return (
    <Link href={`/${locale}/${type}/${slug}`}>
      <Card className="h-full transition-all hover:shadow-lg">
        <CardHeader>
          <div className="mb-3 flex items-center gap-2">
            <Badge className={categoryColor}>{categoryName}</Badge>
            {frontmatter.featured && (
              <Badge variant="warning">
                {locale === 'fr' ? '⭐ En vedette' : '⭐ Featured'}
              </Badge>
            )}
          </div>
          <h3 className="line-clamp-2 text-xl font-bold text-gray-900 dark:text-white">
            {frontmatter.title}
          </h3>
        </CardHeader>

        <CardContent>
          <p className="line-clamp-3 text-gray-600 dark:text-gray-400">
            {frontmatter.description}
          </p>
        </CardContent>

        <CardFooter className="flex-wrap gap-3">
          <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(frontmatter.date, locale as any)}</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
            <Clock className="h-4 w-4" />
            <span>
              {readingTime} {locale === 'fr' ? 'min' : 'min'}
            </span>
          </div>
          {frontmatter.difficulty && (
            <Badge variant="secondary">
              {frontmatter.difficulty === 'beginner' && (locale === 'fr' ? '🟢 Débutant' : '🟢 Beginner')}
              {frontmatter.difficulty === 'intermediate' && (locale === 'fr' ? '🟡 Intermédiaire' : '🟡 Intermediate')}
              {frontmatter.difficulty === 'advanced' && (locale === 'fr' ? '🔴 Avancé' : '🔴 Advanced')}
            </Badge>
          )}
        </CardFooter>

        {frontmatter.tags.length > 0 && (
          <div className="border-t border-gray-200 px-6 py-3 dark:border-gray-700">
            <div className="flex flex-wrap gap-2">
              {frontmatter.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-xs text-gray-600 dark:text-gray-400"
                >
                  #{tag}
                </span>
              ))}
              {frontmatter.tags.length > 3 && (
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  +{frontmatter.tags.length - 3}
                </span>
              )}
            </div>
          </div>
        )}
      </Card>
    </Link>
  );
}
