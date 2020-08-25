import mongoose from 'mongoose';
mongoose.Promise = global.Promise;

const MONGODB_URI = 'mongodb://127.0.0.1:27017/zimble'
const options = {
    useUnifiedTopology: true,
    // reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
    // reconnectInterval: 500, // Reconnect every 500ms
    useNewUrlParser: true
};

mongoose.connect(MONGODB_URI, options);
// mongoose.set('useCreateIndex', true);



mongoose.connection.on('connected', () => {
    // eslint-disable-next-line no-console
    console.info(`Connected to MongoDB`);
});
mongoose.connection.on('error', err => {
    // eslint-disable-next-line no-console
    console.error(`MongoDB connection error:`, err);
    process.exit(-1);
});

mongoose.connection.on('disconnected', () => {
    // eslint-disable-next-line no-console
    console.error('MongoDB disconnected');
});

export default mongoose;
