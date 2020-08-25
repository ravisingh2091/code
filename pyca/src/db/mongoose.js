import mongoose from 'mongoose';


mongoose.Promise = global.Promise;


// const MONGODB_URI = `mongodb+srv://${mlab_user}:${mlab_password}@cluster0-b9rob.mongodb.net/weaverseV3?retryWrites=true`;

const MONGODB_URI = 'mongodb://127.0.0.1:27017/pyca'


const options = {
    useUnifiedTopology: true,
    // reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
    // reconnectInterval: 500, // Reconnect every 500ms
    useNewUrlParser: true
};

mongoose.connect(MONGODB_URI, options);
mongoose.set('useFindAndModify', false);
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
