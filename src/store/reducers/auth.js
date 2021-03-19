import * as actionsTypes from '../actions/actionsTypes';
import {updatedObject} from '../utility';

const initialState = {
    token: null,
    userId: null,
    error: null,
    loading: false
}

const authStart = (state, action) => {
    return updatedObject(state, {error: null, loading: true});
}

const authSuccess = (state, action) => {
    return updatedObject(state, {
        token: action.idToken, 
        userId: action.userId, 
        error: null, 
        loading: false});
}

const authFail = (state, action) => {
    return updatedObject(state, {
        error: action.error, 
        loading: false});
}

const reducer = (state = initialState, action) =>{ 
    switch(action.type){
        case actionsTypes.AUTH_START: return authStart(state, action);
        case actionsTypes.AUTH_SUCCESS: return authSuccess(state, action);
        case actionsTypes. AUTH_FAIL: return authFail(state, action);    
        default: return state;            
    }
}


export default reducer;