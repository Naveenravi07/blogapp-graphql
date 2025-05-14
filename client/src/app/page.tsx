import { gql } from "@apollo/client";
import Link from "next/link";
import { getClient } from "@/lib/appolo-client";
import { BlogPost } from "@/types/blog";

const GET_POSTS = gql`
  query GetPosts {
    blogPosts {
      _id
      title
      content
      author
      createdAt
    }
  }
`;

export default async function Home() {
    let posts: BlogPost[] = [];
    let error: string | null = null;

    try {
        const { data } = await getClient().query({ query: GET_POSTS });
        posts = data?.blogPosts || [];
    } catch (err) {
        console.error("Failed to fetch blog posts:", err);
        error = "Failed to load blog posts. Please try again later.";
    }

    return (
        <main className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Blog Posts</h1>
                <Link href="/blogs/create" className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors">
                    Create New Post
                </Link>
            </div>

            {error ? (
                <div className="text-center text-red-500">{error}</div>
            ) : (
                <div className="space-y-4">
                    {posts.map((post) => (
                        <Link key={post._id} href={`/blogs/${post._id}`} className="block">
                            <div className="bg-white rounded border border-gray-200 p-6 hover:shadow-sm transition-shadow">
                                <h2 className="text-xl font-semibold text-gray-900">
                                    {post.title}
                                </h2>
                                <p className="text-gray-600 mt-2">Author: {post.author}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </main>
    );
}
