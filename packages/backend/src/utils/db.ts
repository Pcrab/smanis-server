import mongoose from "mongoose";

const initDb = async () => {
    const env = process.env;
    const mongoAuth =
        env.DB_USERNAME && env.DB_PASSWORD
            ? `${env.DB_USERNAME}:${env.DB_PASSWORD}@`
            : "";
    const mongoUrl = `${env.DB_PROTOCOL || "mongodb://"}${mongoAuth}${
        env.DB_URL || "localhost:27017"
    }/${env.DB_NAME || "smanis"}?authSource=admin`;
    console.log(`Connecting to MongoDB ${mongoUrl}`);
    await mongoose.connect(mongoUrl);
    console.log("Connect succeeded");
};

export default initDb;
