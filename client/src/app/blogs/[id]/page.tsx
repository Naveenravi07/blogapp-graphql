import { getClient } from "@/lib/appolo-client";
import { BlogPost } from "@/types/blog";
import { gql } from "@apollo/client";
import Link from "next/link";
import '@mantine/tiptap/styles.css';

const GET_POST = gql`
  query GetPost($_id: ID!) {
    blogPost(_id: $_id) {
      _id
      title
      content
      author
      createdAt
    }
  }
`;

interface PageProps {
  params: Promise<{ id: string }>;
}

const richTextStyles = `
  .mantine-tiptap-content h1 { font-size: 2em; font-weight: bold; margin-bottom: 0.5em; }
  .mantine-tiptap-content h2 { font-size: 1.5em; font-weight: bold; margin-bottom: 0.5em; }
  .mantine-tiptap-content h3 { font-size: 1.25em; font-weight: bold; margin-bottom: 0.5em; }
  .mantine-tiptap-content p { margin-bottom: 1em; }
  .mantine-tiptap-content ul { list-style: disc; margin-left: 1em; margin-bottom: 1em; }
  .mantine-tiptap-content ol { list-style: decimal; margin-left: 1em; margin-bottom: 1em; }
  .mantine-tiptap-content li { margin-bottom: 0.5em; }
  .mantine-tiptap-content a { color: #2563eb; text-decoration: underline; }
  .mantine-tiptap-content strong { font-weight: bold; }
  .mantine-tiptap-content em { font-style: italic; }
`;

export default async function BlogDetail({ params }: PageProps) {
  let post: BlogPost | null = null;
  let error: string | null = null;

  try {
    const resolvedParams = await params;
    const { data } = await getClient().query({
      query: GET_POST,
      variables: { _id: resolvedParams.id }
    });
    post = data.blogPost;
  } catch (err) {
    console.error("Failed to fetch blog post:", err);
    error = "Failed to load blog post. Please try again later.";
  }

  return (
    <main className="container mx-auto px-4 py-8 max-w-3xl">
      <style>{richTextStyles}</style>
      <Link
        href="/"
        className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-1"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
            clipRule="evenodd"
          />
        </svg>
        Back to Blog List
      </Link>

      {error && (
        <p className="text-red-500 mb-4">
          {error}
        </p>
      )}

      {post && (
        <article className="bg-white rounded p-6">
          <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
          <p className="text-gray-600 mb-6">Author: {post.author}</p>

          <div 
            className="prose max-w-none mantine-tiptap-content"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
      )}
    </main>
  );
}
