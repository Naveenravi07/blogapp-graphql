import { Collection, Db, MongoClient } from 'mongodb';
import { BlogPost } from '../types';

export class DatabaseService {
  private static client: MongoClient;
  private static db: Db;
  public static blogPosts: Collection<BlogPost>

  static async connect(uri: string): Promise<void> {
    try {
      this.client = new MongoClient(uri);
      await this.client.connect();
      
      this.db = this.client.db();
      this.blogPosts = this.db.collection('blogPosts');
      
      console.log('🔌 Connected to MongoDB');
    } catch (error) {
      console.error('Failed to connect to MongoDB:', error);
      process.exit(1);
    }
  }

  static async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.close();
      console.log('MongoDB connection closed');
    }
  }
}
process.on('SIGINT', async () => {
  await DatabaseService.disconnect();
  process.exit(0);
});