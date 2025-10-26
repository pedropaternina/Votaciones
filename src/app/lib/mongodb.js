import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI){
    throw new Error("No se ha definido una URI en el archivo .env :V")
}

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = {conn: null, promise: null};
}

export async function connectDB() {
    if (cached.conn) return cached.conn;

    if (!cached.promise){
        console.log('🔄 Conectando a MongoDB Atlas...');
        
        cached.promise = mongoose.connect(MONGODB_URI, {
            // Elimina dbName ya que viene en la URI
            bufferCommands: false,
        })
        .then((mongoose) => {
            console.log('✅ Conectado a MongoDB Atlas exitosamente');
            return mongoose;
        })
        .catch((error) => {
            console.error('❌ Error conectando a MongoDB Atlas:', error.message);
            throw error;
        });
    }

    try {
        cached.conn = await cached.promise;
        return cached.conn;
    } catch (error) {
        cached.promise = null;
        throw error;
    }
}