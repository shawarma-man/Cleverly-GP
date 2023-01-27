import cors from "cors";

const allowedOrigins = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'http://localhost:3003',
    'http://localhost:3004',
    'http://localhost:3005',
    'https://polar-waters-85807.herokuapp.com/',
    'https://polar-waters-85807.herokuapp.com:443',
];

const corsOptions: cors.CorsOptions = {
    origin: allowedOrigins,
    optionsSuccessStatus: 200,
    methods: 'get,HEAD,PUT,PATCH,post,DELETE,OPTIONS',
};
export default corsOptions;