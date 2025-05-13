export interface BlogPost {
    id: string;
    title: string;
    content: string;
    author: string;
    createdAt: string;
    updatedAt: string | null;
  }
  
  export interface CreateBlogPostInput {
    title: string;
    content: string;
    author: string;
  }
  
  export interface UpdateBlogPostInput {
    title?: string;
    content?: string;
    author?: string;
  }