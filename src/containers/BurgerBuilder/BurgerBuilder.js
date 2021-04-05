import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
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

    useEffect(() => {
        props.onInitIngredient();
        props.onInitPurchase();
    },[]);

    const updatePurchaseState = ingredients => { 
       /* const sum = Object.values(ingredients).reduce((a, b) => a + b, 0); */
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
        if(props.isAuthenticate){
            setPurchasing(true);
        }else{
            props.onSetRedirectPath('./checkout');
            props.history.push('/auth');
        }
    }

    const purchaseCancelHandler = () => {
        setPurchasing(false);
    }

    const purchaseContinueHandler = () =>{
        props.onInitPurchase();
        props.history.push('/checkout');
    }

     
    const disabledInfo = {...props.ings};
    for(let key in disabledInfo){
    disabledInfo[key] = disabledInfo[key] <= 0 ;
    }
        
    let orderSummary = null; 
    let burger = props.error ? <p style={{textAlign:'center'}}>Ingredient can't be loaded!</p> : <Spinner/>;
    if(props.ings){
            burger = (
                <Aux>
                    <div >
                        <Burger ingredients={props.ings} />
                    </div>
                    
                    <BuildControls             
                    ingredientAdded={props.onIngredientAdded}
                    ingredientRemoved={props.onIngredientRemoved}
                    disabled={disabledInfo}
                    purchasable={updatePurchaseState(props.ings)}
                    ordered={purchaseHandler}
                    isAuth={props.isAuthenticate}
                    price={props.totalPrice}/>
                </Aux>
            );
            
            orderSummary = (
                    <OrderSummary 
                        ingredients={props.ings}
                        price={props.totalPrice}
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

const mapStateToProps = (state ) => {
    return {
        ings: state.burgerBuilder.ingredients,
        totalPrice: state.burgerBuilder.totalPrice,
        error: state.burgerBuilder.error,
        isAuthenticate: state.auth.token !== null
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        onIngredientAdded:(ingName) => dispatch(actions.addIngrediet(ingName)),
        onIngredientRemoved:(ingName) => dispatch(actions.removeIngrediet(ingName)),
        onInitIngredient: ()=> dispatch(actions.initIngredient()),
        onInitPurchase: ()=> dispatch(actions.purchaseInit()),
        onSetRedirectPath: (path) => dispatch(actions.setAuthRedirectPath(path))

    }
} 

export default connect(mapStateToProps,mapDispatchToProps) (withErrorHandler(burgerBuilder, axios));