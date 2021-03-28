import axios from '../../axios-orders';
import { put } from 'redux-saga/effects';
import * as actions from '../actions/index';


export function* initIngredientsSaga( action){
    try{
        const response = yield axios.get('https://react-my-burger-a69cd-default-rtdb.firebaseio.com/ingredient.json');
        yield put(actions.setIngredients(response.data));

    }catch(error) {
        yield put(actions.fetchIngredientFailed());
    }
}