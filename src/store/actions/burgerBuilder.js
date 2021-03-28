import * as actionTypes from './actionsTypes';

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

export const fetchIngredientFailed = () =>{
    return {type: actionTypes.SET_INGREDIENT
    };
}

export const initIngredient = () =>{
    return {
        type: actionTypes.INIT_INGREDIENTS
    };
};