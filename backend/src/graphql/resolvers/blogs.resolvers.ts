import { ObjectId } from 'mongodb';
import { BlogPost, CreateBlogPostInput, UpdateBlogPostInput } from '../../types/blog';
import { DatabaseService } from '../../db/mongodb';
import AppError from '../../classes/Error';


export const blogResolvers = {
  Query: {
    blogPosts: async (): Promise<BlogPost[]> => {
      const posts = (await DatabaseService.blogPosts.find({}).toArray()).map((obj)=>{
        return {
            ...obj,
            _id: obj._id.toString()
        }
      });
      return posts
    },
    
    blogPost: async (_: unknown, { _id }: { _id: string }): Promise<BlogPost> => {
      const post = await DatabaseService.blogPosts.findOne({ _id: new ObjectId(_id) })
      if (!post) throw new AppError(`Blog post with id ${_id} not found`, 404);
      return {
          ...post,
          _id:post._id.toString()
      }
    }
  },

  Mutation: {
    createBlogPost: async (_: unknown, { input }: { input: CreateBlogPostInput }): Promise<BlogPost> => {
      const now = new Date().toISOString();
      const newPost = {
        ...input,
        createdAt: now,
        updatedAt: null
      };
      
      const result = await DatabaseService.blogPosts.insertOne(newPost);
      return {
        _id: result.insertedId.toString(),
        ...newPost
      }
    },
  }
};