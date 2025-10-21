import mongoose from "mongoose";
import { cache } from "react";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI){
    throw new Error("No se ha definido una URI en el archivo .env :V")
}

let cached = global.mongoose

if (!cached) {
    cached = global.mongoose = {conn: null, promise: null}
}

export async function connectDB() {
    if (cached.conn) return cached.conn

    if (!cached.promise){
        cached.promise = mongoose.connect(MONGODB_URI, {
            dbName: 'Pedro',
            bufferCommands: false,
        }).then((mongoose) => mongoose)
    }

    cached.conn = await cached.promise
    return cached.conn;
}