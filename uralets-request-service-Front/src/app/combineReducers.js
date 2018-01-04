import {combineReducers} from 'redux';

import userReducer from '../reducers/userReducer';


export const reducers = combineReducers({
    user: userReducer,
});
