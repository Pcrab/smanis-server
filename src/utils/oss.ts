import "dotenv/config";
import OSS from "ali-oss";

const client = new OSS({
    region: process.env.OSS_REGION || "",
    bucket: process.env.OSS_BUCKET || "smanis",
    secure: true,
    accessKeyId: process.env.OSS_ACCESS_KEY_ID || "",
    accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET || "",
});

export default client;
