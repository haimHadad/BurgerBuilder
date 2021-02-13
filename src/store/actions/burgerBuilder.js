import * as actionTypes from './actionsTypes';
import axios from '../../axios-orders';

export const addIngrediet = (name) => {
    return {
        type: actionTypes.ADD_INGREDIENT,
        ingredientName: name 
    }
}

export const removeIngrediet = (name) => {
    return {
        type: actionTypes.REMOVE_INGREDIENT,
        ingredientName: name 
    }
}

export const setIngredients = (ingredients) =>{
    return{
        type: actionTypes.SET_INGREDIENT,
        ingredients: ingredients
    };
}

export const fetchIngredientError = () =>{
    return {type: actionTypes.SET_INGREDIENT
    };
}

export const initIngredient = () =>{
    return dispatch => {
        axios.get('https://react-my-burger-a69cd-default-rtdb.firebaseio.com/ingredient.json')
        .then(response => {
            dispatch(setIngredients(response.data));
        })
        .catch(error => {
            dispatch(fetchIngredientError());
        })
    };
};