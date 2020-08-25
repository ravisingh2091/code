import {Server} from './server';

let server = new Server();
let port = server.port;
let app = server.app;

app.listen(port, () => {
    console.log(`server is running on port ${port}`);
});




