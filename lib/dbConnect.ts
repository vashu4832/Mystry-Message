// import "dotenv/config";
// import dns from "dns";

// dns.setServers(["1.1.1.1", "8.8.4.4"]);
// import mongoose from "mongoose";
// type ConnectionObject = {
//     isConnected?: number
// }

// const connection: ConnectionObject = {}

// async function dbConnect(): Promise<void>{
//     if(connection.isConnected) {
//         console.log("Already connected to DB")
//         return
//     }

//     try {
//         const db = await mongoose.connect(process.env.MONGODB_URI || '', {})
//         connection.isConnected = db.connection.readyState

//         console.log("DB connected")

//     } catch (error) {
//         console.log("DB connection failed",error);
//         process.exit(1);
//     }
// }

// export default dbConnect;

// import dns from "dns";
// dns.setServers(["8.8.8.8", "1.1.1.1"]);

import mongoose from "mongoose";

declare global {
  // eslint-disable-next-line no-var
  var _mongooseConn: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  } | undefined;
}

const cached = global._mongooseConn ?? { conn: null, promise: null };
global._mongooseConn = cached;

async function dbConnect(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error("MONGODB_URI is not defined");

    cached.promise = mongoose.connect(uri, {}).then((m) => m);
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null; // reset so next call can retry
    throw err;
  }

  return cached.conn;
}

export default dbConnect;