import { blogResolvers } from './blogs.resolvers';

export const resolvers = {
  Query: {
    ...blogResolvers.Query
  },
  Mutation: {
    ...blogResolvers.Mutation
  }
};