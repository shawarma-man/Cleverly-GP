import mongoose from 'mongoose';
import config from 'config';
import logger from './logger';



async function connect() {
    const dbUri = process.env.dbUri || config.get<string>('dbUri');
    try {
        await mongoose.connect(dbUri);
        logger.info("Connected to DB");
    }
    catch (error) {
        logger.error("Error connecting to DB");
        process.exit(1);
    }
}
export default connect;