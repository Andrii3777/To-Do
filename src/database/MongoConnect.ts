import { MongoClient } from "mongodb";
import env from '../config';
const uri = env.MONGODB_URI;
export const client = new MongoClient(uri);

(async () => {
    try {
        await client.connect();
        console.log('Connected to MongoDB successfully!');
    } catch (err) {
        console.error('Failed connection to MongoDB:', err);
    }
})();