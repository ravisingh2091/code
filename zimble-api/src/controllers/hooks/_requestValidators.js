import mongoose from '../../db';
const isValidObjectId = value => mongoose.Types.ObjectId.isValid(value);
