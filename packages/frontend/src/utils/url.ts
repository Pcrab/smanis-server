import { isDev } from "./consts.js";

const remoteUrl = isDev ? "http://127.0.0.1:20080" : "some production url";

export default remoteUrl;
