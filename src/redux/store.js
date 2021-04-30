import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'

import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers } from "redux";
import {
    persistStore, persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER
} from 'redux-persist'

import clientReducer from './clientSlice'
import globalReducer from './globalSlice'

const reducers = combineReducers({
    client: clientReducer,
    global: globalReducer,
});

const persistConfig = {
    key: 'hak',
    storage: AsyncStorage,
    whitelist: ['client']
};
const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
    reducer: persistedReducer,
    devTools: process.env.NODE_ENV !== 'production',
    middleware: getDefaultMiddleware({
        serializableCheck: {
            ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
        }
    })
});

let persistor = persistStore(store)

export { store, persistor }