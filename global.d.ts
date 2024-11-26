declare namespace NodeJS {
    interface Global {
      _mongoClientPromise?: Promise<MongoClient>; // Add your custom property here
    }
  }