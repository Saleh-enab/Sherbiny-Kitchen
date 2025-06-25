import { createServer } from "./app.js";
import env from "./env.js";

const port = env.PORT || 3000;
const server = createServer();

const startServer = async () => {
    try {
        server.listen(port, () => {
            console.log(`API runs on port ${port}`)
        })
    } catch (err) {
        console.error(err);
    }
}
startServer();