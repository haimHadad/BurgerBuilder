import * as actionTypes from './actionsTypes';
import axios from '../../axios-orders';

export const purchaseBurgerSuccess = (id, orderData) =>{
    return {
        type: actionTypes.PURCHASE_BURGER_SUCCESS,
        orderId: id,
        orderData: orderData
    }
}


export const purchaseBurgerFail = (error) =>{
    return {
        type: actionTypes.PURCHASE_BURGER_FAIL,
        error: error
    }
}

export const purchaseBurgerStart = () => {
  return {
      type: actionTypes.PURCHASE_ORDER_START
  }  
}
export const resetRedirection = () => {
  return {
      type: actionTypes.ORDER_REDIRECTION
  }  
}

export const purchaseBurger = (orderData) => {
    return dispatch => {
        dispatch(purchaseBurgerStart());
        axios.post('orders.json', orderData)
        .then(response => {
            dispatch( purchaseBurgerSuccess(response.data.name,orderData) );
            console.log(response);

        })
        .catch(error => {
            dispatch( purchaseBurgerFail(error) );
            console.log(error);

        });
    }
}