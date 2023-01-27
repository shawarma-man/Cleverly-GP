import express from 'express';
import config from 'config';
import connect from './utils/connect';
import logger from './utils/logger';
import routes from './routes';
import deserializeUser from './middleware/deserializeUser';
import helmet from "helmet";
import bodyParser from 'body-parser';
import cors from 'cors';
const port = config.get<number>('port') || 1337;
const app = express();
import corsOptions from '../config/origins';
import rateLimit from 'express-rate-limit';

const apiLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 1000, // limit each IP to 100 requests per windowMs
    message: 'Too many requests, please try again later',
    statusCode: 429
});
app.use(apiLimiter);
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(express.json());
app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", 'maxcdn.com']
    }
}))
app.use(helmet());
app.use(deserializeUser);
app.listen(port, async () => {
    logger.info(`APP IS LISTENING ON PORT ${port}`);
    await connect();

    routes(app);
});