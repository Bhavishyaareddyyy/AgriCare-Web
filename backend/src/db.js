import mongoose from 'mongoose';
mongoose.set('strictQuery', true);
export async function connectDatabase(uri = process.env.MONGODB_URI) {
  if (!uri || uri.includes('PASTE_YOUR_ATLAS')) return false;
  try { await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 }); console.info('MongoDB connection established.'); return true; }
  catch { console.error('MongoDB connection unavailable; database operations will return 503.'); const retry=setTimeout(()=>connectDatabase(uri),10_000); retry.unref?.(); return false; }
}
export const databaseAvailable = () => mongoose.connection.readyState === 1;
mongoose.connection.on('disconnected', () => console.warn('MongoDB connection lost.'));
mongoose.connection.on('error', () => console.error('MongoDB connection error.'));
