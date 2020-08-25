import { createStore, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import { persistStore, persistCombineReducers } from "redux-persist";
import AsyncStorage from '@react-native-community/async-storage';

import AuthReducer from './reducers/AllReducer';
const config = {
    key: "root",
    storage: AsyncStorage,
};

const reducers = {
    auth: AuthReducer
};

const rootReducer = persistCombineReducers(config, reducers);
const store = createStore(rootReducer, {}, applyMiddleware(ReduxThunk))

export const persistor = persistStore(store);
export default store;