import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import '@mantine/core/styles.css';
import '@mantine/tiptap/styles.css';
import { MantineProvider } from '@mantine/core';
import { ApolloWrapper } from "@/components/ApolloWrapper"

export const metadata: Metadata = {
  title: "Simple Blog",
  description: "A simple blog built with Next.js and Tailwind CSS",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        <header className="border-b border-gray-200">
          <div className="container  px-4 py-4 max-w-4xl">
            <h1 className="text-2xl font-bold">Blog App</h1>
          </div>
        </header>
        <MantineProvider>
          <ApolloWrapper>
            {children}
          </ApolloWrapper>
        </MantineProvider>
      </body>
    </html>
  )
}
