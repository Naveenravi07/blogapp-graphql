import { ObjectId } from 'mongodb';
import { BlogPost, CreateBlogPostInput, UpdateBlogPostInput } from '../../types';
import { DatabaseService } from '../../db/mongodb';
import AppError from '../../classes/Error';
import { v4 as uuidv4 } from 'uuid';

export const blogResolvers = {
  Query: {
    blogPosts: async (): Promise<BlogPost[]> => {
      const posts = await DatabaseService.blogPosts.find({}).toArray();
      return posts
    },
    
    blogPost: async (_: unknown, { id }: { id: string }): Promise<BlogPost> => {
      const post = await DatabaseService.blogPosts.findOne({ _id: new ObjectId(id) });
      if (!post) throw new AppError(`Blog post with id ${id} not found`, 404);
      return post
    }
  },

  Mutation: {
    createBlogPost: async (_: unknown, { input }: { input: CreateBlogPostInput }): Promise<BlogPost> => {
      const now = new Date().toISOString();
      
      const newPost = {
        ...input,
        id: uuidv4(),
        createdAt: now,
        updatedAt: null
      };
      
      const result = await DatabaseService.blogPosts.insertOne(newPost);
      if(result.acknowledged == false) throw new AppError("Failed to create blog post", 500);
      return newPost
    },

    updateBlogPost: async (_: unknown, { id, input }: { id: string, input: UpdateBlogPostInput }): Promise<BlogPost> => {
      const now = new Date().toISOString();
      
      const updateData = {
        ...input,
        updatedAt: now
      };
      
      const result = await DatabaseService.blogPosts.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: updateData },
        { returnDocument: 'after' }
      );
      
      if (!result.value) {
        throw new Error(`Blog post with id ${id} not found`);
      }
      
      return result.value
    },

    deleteBlogPost: async (_: unknown, { id }: { id: string }): Promise<boolean> => {
      const result = await DatabaseService.blogPosts.deleteOne({ _id: new ObjectId(id) });
      if(result.deletedCount == 0) throw new AppError("Failed to delete blog post", 500);
      return true;
    }
  }
};