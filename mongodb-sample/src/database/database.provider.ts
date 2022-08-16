import { Db, MongoClient } from "mongodb";

export const databaseProviders = [
    {
        provide: 'DATABASE_CONNECTION',
        useFactory: async (): Promise<Db> => {
            try {
                const URI = `mongodb://localhost:27017`
                const client = new MongoClient(URI);
                await client.connect();
                console.log('Database initialized');
                return client.db('test-db');
            } catch (error) {
                console.error('Failed to initiaze DB')
                throw error;
            }
        }
    }
]