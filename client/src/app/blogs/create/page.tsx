"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { gql, useMutation } from "@apollo/client"
import { BtnBold, BtnBulletList, BtnItalic, BtnLink, BtnNumberedList, BtnUnderline, ContentEditableEvent, Editor, EditorProvider, Toolbar } from "react-simple-wysiwyg"

const CREATE_POST = gql`
  mutation CreateBlogPost($input: CreateBlogPostInput!) {
    createBlogPost(input: $input) {
      _id
      title
      content
      author
      createdAt
    }
  }
`;

export default function CreatePostPage() {
    const router = useRouter()
    const [formData, setFormData] = useState({
        title: "",
        author: "",
        content: "",
    })
    const [isSubmitting, setIsSubmitting] = useState(false)

    const [createPost] = useMutation(CREATE_POST)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const [html, setHtml] = useState('');
    function onHtmlChange(e: ContentEditableEvent) {
        setHtml(e.target.value);
        setFormData(prev => ({
            ...prev,
            content: e.target.value
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const { data } = await createPost({
                variables: {
                    input: {
                        title: formData.title,
                        content: formData.content || html,
                        author: formData.author
                    }
                }
            })

            if (data?.createBlogPost) {
                router.push("/")
            }
        } catch (error) {
            console.error("Error submitting form:", error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <main className="container mx-auto px-4 py-8 max-w-3xl">
            <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path
                        fillRule="evenodd"
                        d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
                        clipRule="evenodd"
                    />
                </svg>
                Back to Blog List
            </Link>

            <h1 className="text-3xl font-bold mb-8">Create New Post</h1>

            <div className="bg-white rounded border border-gray-200 p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                            Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
                            placeholder="Enter post title"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="author" className="block text-sm font-medium text-gray-700">
                            Author
                        </label>
                        <input
                            type="text"
                            id="author"
                            name="author"
                            value={formData.author}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
                            placeholder="Enter author name"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                            Content
                        </label>
                        <EditorProvider>
                            <Editor containerProps={{ style: { height: 250 } }} value={html} onChange={onHtmlChange} >
                                <Toolbar>
                                    <BtnBold />
                                    <BtnItalic />
                                    <BtnLink />
                                    <BtnUnderline />
                                    <BtnBulletList />
                                    <BtnNumberedList />
                                </Toolbar>
                            </Editor>
                        </EditorProvider>
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? "Creating..." : "Create Post"}
                        </button>
                    </div>
                </form>
            </div>
        </main>
    )
}
