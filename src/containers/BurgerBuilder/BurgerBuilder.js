import React, {useEffect, useState, useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import axios from '../../axios-orders';

import Aux from '../../hoc/Auxiliary/Auxiliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../store/actions/index';



const burgerBuilder = props => {
    
    const [purchasing, setPurchasing] = useState(false);

    const dispatch = useDispatch();

    const ings = useSelector(state => {
        return state.burgerBuilder.ingredients
    });

    const totalPrice = useSelector(state => {
        return state.burgerBuilder.totalPrice
    });

    const error = useSelector(state => {
        return state.burgerBuilder.error
    });
    
    const isAuthenticate = useSelector(state => {
        return state.auth.token !== null
    });

    const onIngredientAdded = (ingName) => dispatch(actions.addIngrediet(ingName));
    const onIngredientRemoved = (ingName) => dispatch(actions.removeIngrediet(ingName));
    const onInitIngredients =  useCallback( ()=> dispatch(actions.initIngredient()) , [dispatch] );
    const onInitPurchase =  useCallback ( () => dispatch(actions.purchaseInit()) , [dispatch]);
    const onSetRedirectPath =  (path) => dispatch(actions.setAuthRedirectPath(path));


    useEffect(() => {
        onInitIngredients();
        onInitPurchase();
    },[onInitIngredients, onInitPurchase]);

    const updatePurchaseState = ingredients => { 
       const sum = Object.keys(ingredients)
        .map(igKey=>{
            return ingredients[igKey];
        })
        .reduce((sum, el) => {
            return sum + el;
        }, 0);
       return sum > 0;
    }


    const purchaseHandler = () => {
        if(isAuthenticate){
            setPurchasing(true);
        }else{
            onSetRedirectPath('./checkout');
            props.history.push('/auth');
        }
    }

    const purchaseCancelHandler = () => {
        setPurchasing(false);
    }

    const purchaseContinueHandler = () =>{
        onInitPurchase();
        props.history.push('/checkout');
    }

     
    const disabledInfo = {...ings};
    for(let key in disabledInfo){
    disabledInfo[key] = disabledInfo[key] <= 0 ;
    }
        
    let orderSummary = null; 
    let burger = error ? <p style={{textAlign:'center'}}>Ingredient can't be loaded!</p> : <Spinner/>;
    if(ings){
            burger = (
                <Aux>
                    <div >
                        <Burger ingredients={ings} />
                    </div>
                    
                    <BuildControls             
                    ingredientAdded={onIngredientAdded}
                    ingredientRemoved={onIngredientRemoved}
                    disabled={disabledInfo}
                    purchasable={updatePurchaseState(ings)}
                    ordered={purchaseHandler}
                    isAuth={isAuthenticate}
                    price={totalPrice}/>
                </Aux>
            );
            
            orderSummary = (
                    <OrderSummary 
                        ingredients={ings}
                        price={totalPrice}
                        purchaseCanceled={purchaseCancelHandler}
                        purchaseContinued = {purchaseContinueHandler}/>
            );
        }

        

    return (
        <Aux>
            <Modal show={purchasing} modalClosed={purchaseCancelHandler}>
                {orderSummary} 
            </Modal>               
            {burger}
        </Aux>
    );
    
}

export default withErrorHandler(burgerBuilder, axios);