import { createServer } from "./app.js";
import env from "./env.js";

const port = env.PORT || 3000;
const server = createServer();

const startServer = async () => {
    try {
        server.listen(port, () => {
            console.log(`API runs on port ${port}`)
            console.log(`📜 Swagger Docs available at http://localhost:${port}/api-docs`);

        })
    } catch (err) {
        console.error(err);
    }
}
startServer();