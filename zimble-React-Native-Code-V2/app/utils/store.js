import { createStore, compose, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { persistStore, persistCombineReducers } from "redux-persist";
//import storage from "redux-persist/es/storage"; // default: localStorage if web, AsyncStorage if react-native
import reducers from "../reduxActionAndReducer";
import AsyncStorage from '@react-native-community/async-storage';
const config = {
  key: "root",
  storage: AsyncStorage,
};

const rootReducer = persistCombineReducers(config, reducers);

let middlewares = [thunk];

const store = createStore(
  rootReducer,
  undefined,
  compose(applyMiddleware(...middlewares))
);

export const persistor = persistStore(store);
export default store;
