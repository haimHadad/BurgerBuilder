import * as actionTypes from '../actions/actionsTypes';

const initialState = {
    orders: [],
    loading: false,
    redirect: false
}

const reducer = (state = initialState, action) =>{
    switch(action.type){
        
        case actionTypes.PURCHASE_ORDER_START:
            return {
                ...state,
                loading: true
            }

        case actionTypes.PURCHASE_BURGER_SUCCESS:
            const newOrder = {
                ...action.orderData,
                id: action.id,
                redirect:true
            };
            return {
                ...state,
                orders: state.orders.concat(action.orderData),
                loading: false,
                redirect:true
            }

        case actionTypes.PURCHASE_BURGER_FAIL:
            return {
                ...state,
                loading: false
            }
        case actionTypes.ORDER_REDIRECTION:
            return {
                ...state,
                redirect: false
            }
        default:
            return state;
    }
}


export default reducer;