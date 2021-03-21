import React, {Component} from 'react';
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



class BurgerBuilder extends Component{
    state ={
        purchasing: false
    };

    componentDidMount(){
        this.props.onInitIngredient();
        this.props.onInitPurchase();
    }


    updatePurchaseState(ingredients){ 
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


    purchaseHandler = () => {
        if(this.props.isAuthenticate){
            this.setState({purchasing: true})
        }else{
            this.props.onSetRedirectPath('./checkout');
            this.props.history.push('/auth');
        }
    }

    purchaseCancelHandler = ()=>{
        this.setState({purchasing: false})
    }

    purchaseContinueHandler = () =>{
        this.props.onInitPurchase();
        this.props.history.push('/checkout');
    }

    render(){  
        const disabledInfo = {...this.props.ings};
        for(let key in disabledInfo){
            disabledInfo[key] = disabledInfo[key] <= 0
        }
        
        let orderSummary = null; 
        let burger = this.props.error ? <p style={{textAlign:'center'}}>Ingredient can't be loaded!</p> : <Spinner/>;
        if(this.props.ings){
            burger = (
                <Aux>
                    <div style={{width: '60%', margin: 'auto'}}>
                        <Burger ingredients={this.props.ings} />
                    </div>
                    
                    <BuildControls             
                    ingredientAdded={this.props.onIngredientAdded}
                    ingredientRemoved={this.props.onIngredientRemoved}
                    disabled={disabledInfo}
                    purchasable={this.updatePurchaseState(this.props.ings)}
                    ordered={this.purchaseHandler}
                    isAuth={this.props.isAuthenticate}
                    price={this.props.totalPrice}/>
                </Aux>
            );
            
            orderSummary = (
                    <OrderSummary 
                        ingredients={this.props.ings}
                        price={this.props.totalPrice}
                        purchaseCanceled={this.purchaseCancelHandler}
                        purchaseContinued = {this.purchaseContinueHandler}/>
            );
        }

        

        return (
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                   {orderSummary} 
                </Modal>               
                {burger}
            </Aux>
        );
    }
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

export default connect(mapStateToProps,mapDispatchToProps) (withErrorHandler(BurgerBuilder, axios));