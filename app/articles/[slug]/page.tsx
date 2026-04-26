import { notFound } from "next/navigation";
import { redirect } from "next/navigation";
import Head from "next/head";
import Header from "@/app/components/themes/Header";
import Footer from "@/app/components/themes/Footer";
import Breadcrumbs from "@/app/components/themes/Breadcrumbs"
import "@/app/css/articls.css"
import ArticleDisplay from "./ArticleDisplay"

async function getArticleData(slug: string) {
  if (!slug) {
    throw new Error("slug is missing");
  }
  const baseUrl = process.env.NEXT_PUBLIC_API_URLL;
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/articles/${slug}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    if (res.status === 404) {
      notFound();
    }
    throw new Error(`Failed to fetch article: ${res.statusText}`);
  }

  return res.json();
}

async function getCommentData() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URLL || "http://localhost:3000";
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/comments`, {
    cache: "no-store",
  });

  if (!res.ok) {
    if (res.status === 404) {
      notFound();
    }
    throw new Error(`Failed to fetch article: ${res.statusText}`);
  }

  return res.json();
}

async function getAllArticles(props: any) {
  const paramsPromise = props.params;
  const params = await paramsPromise;
  const slug = params?.slug;

  const article = await getArticleData(slug);
  const categories = article.categories;
  const baseUrl = process.env.NEXT_PUBLIC_API_URLL || "http://localhost:3000";

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/articles`);
    if (!response.ok) throw new Error('Failed to fetch articles');

    const allArticles = await response.json();

    const relatedArticles = allArticles.filter((a: any) => {
      return a.categories?.some((cat: string) => categories.includes(cat));
    });

    return relatedArticles;
  } catch (error) {
    console.error('Error fetching related articles:', error);
    return [];
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: { slug: string } }) {
  try {
    // Handle both direct params and Promise params
    const resolvedParams = await params;
    const slug = resolvedParams?.slug;

    if (!slug) {
      console.error('No slug provided in generateMetadata');
      return {
        title: 'Article',
        description: 'Article description',
      };
    }

    const baseUrl = process.env.NEXT_PUBLIC_API_URLL || "http://localhost:3000";
    console.log('Fetching article for metadata:', slug);

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/articles/${slug}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      console.error('Failed to fetch article for metadata:', response.status, response.statusText);
      return {
        title: 'Article',
        description: 'Article description',
      };
    }

    const article = await response.json();
    console.log('Article data for metadata:', article);

    const title = article.seoTitle || article.title || 'Article';
    const description = article.seoMeta || article.seoDestination || article.title || 'Article description';

    return {
      title,
      description,
      keywords: article.categories ? article.categories.join(', ') : '',
      canonical: article.seoCanonikalOrigin || `${baseUrl}/articles/${slug}`,
      openGraph: {
        type: 'article',
        title,
        description,
        url: article.seoOrigin || `${baseUrl}/articles/${slug}`,
        images: article.coverImage ? [article.coverImage] : [],
        siteName: 'Real Estate',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: article.coverImage ? [article.coverImage] : [],
      },
      authors: [{ name: 'Real Estate Team' }],
      robots: 'index, follow',
      other: {
        language: 'fa-IR',
        'article:published_time': article.createdAt,
        'article:modified_time': article.updatedAt,
        'article:section': 'blog',
        ...(article.categories ? Object.fromEntries(
          article.categories.map((cat: string, index: number) => [`article:tag:${index}`, cat])
        ) : {}),
      },
    };
  } catch (error) {
    console.error('Error in generateMetadata:', error);
    return {
      title: 'Article',
      description: 'Article description',
    };
  }
}

export default async function ArticleDetailPage(props: any) {

  const paramsPromise = props.params;

  const params = await paramsPromise;

  const slug = params?.slug;

  let ridirect = '';
  let article = null;
  let articlsMoshabe: any[] = [];
  let comments = null;

  if (!slug) {
    return notFound();
  }

  try {

    article = await getArticleData(slug);
    console.log('Article data in page component:', article);

    comments = await getCommentData();

    articlsMoshabe = await getAllArticles({ params: { slug: slug } });

  } catch (error) {
    console.error("Error fetching article:", error);
    return notFound();
  }


  if (article && (article as any) && articlsMoshabe && comments !== null) {

    if ((article as any).seoDestination && (article as any).seoDestination.trim() !== "") {
      ridirect = (article as any).seoDestination;
    }

    if (ridirect && ridirect.trim() !== "") {
      redirect(ridirect)
    }

    articlsMoshabe = articlsMoshabe.filter((arac: any) => {
      return arac.active === true
    })

    return (
      <>
        <Header />

        <ArticleDisplay content={article} articlsMoshabe={articlsMoshabe} articlesComments={comments} />

        <Footer />

      </>
    );
  }

}