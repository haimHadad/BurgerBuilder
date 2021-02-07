import React, {Component} from 'react';
import axios from '../../axios-orders';
import {connect} from 'react-redux';

import * as actionType from '../../store/actions';
import Aux from '../../hoc/Auxiliary/Auxiliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7
}

class BurgerBuilder extends Component{
    state ={
        totalPrice: 4,
        purchasable: false,
        purchasing: false,
        loading: false,
        error: false
    };

    componentDidMount(){
        /* axios.get('https://react-my-burger-a69cd-default-rtdb.firebaseio.com/ingredient.json')
        .then(response => {
            this.setState({ingredients: response.data})
        })
        .catch(error => {
            this.setState({error: true});
        }) */
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
       this.setState({purchasable: sum > 0 });
    }

    addIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        const updatedCount = oldCount + 1;
        const updatedIngredient = {
            ...this.state.ingredients
        };
        updatedIngredient[type] = updatedCount;
        const priceAddition = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice + priceAddition;
        this.setState({totalPrice: newPrice, ingredients: updatedIngredient});
        this.updatePurchaseState(updatedIngredient);
    }

    removeIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        if(oldCount <= 0){
            return;
        }
        const updatedCount = oldCount - 1;
        const updatedIngredient = {
            ...this.state.ingredients
        };
        updatedIngredient[type] = updatedCount;
        const priceAddition = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice - priceAddition;
        this.setState({totalPrice: newPrice, ingredients: updatedIngredient});
        this.updatePurchaseState(updatedIngredient);
    }

    purchaseHandler = () => {
        this.setState({purchasing: true})
    }

    purchaseCancelHandler = ()=>{
        this.setState({purchasing: false})
    }

    purchaseContinueHandler = ()=>{
            const queryParams = [];
            for(let i in this.state.ingredients){
                queryParams.push(encodeURIComponent(i) + '=' +encodeURIComponent(this.state.ingredients[i]));
            }
            queryParams.push('price=' + this.state.totalPrice);
            const queryString = queryParams.join('&');
            this.props.history.push({
                pathname: '/checkout',
                search: '?' + queryString
            });


    }

    render(){  
        const disabledInfo = {...this.props.ings};
        for(let key in disabledInfo){
            disabledInfo[key] = disabledInfo[key] <= 0
        }
        
        let orderSummary = null; 
        let burger = this.state.error ? <p style={{textAlign:'center'}}>Ingredient can't be loaded!</p> : <Spinner/>;
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
                    purchasable={this.state.purchasable}
                    ordered={this.purchaseHandler}
                    price={this.state.totalPrice}/>
                </Aux>
            );
            
            orderSummary = (
                    <OrderSummary 
                        ingredients={this.props.ings}
                        price={this.state.totalPrice}
                        purchaseCanceled={this.purchaseCancelHandler}
                        purchaseContinued = {this.purchaseContinueHandler}/>
            );
   
        if(this.state.loading){
            orderSummary = <Spinner/>
        }
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
        ings: state.ingredients,
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        onIngredientAdded:(ingName) => dispatch({type: actionType.ADD_INGREDIENT, ingredientName:ingName }),
        onIngredientRemoved:(ingName) => dispatch({type: actionType.REMOVE_INGREDIENT, ingredientName:ingName })
    }
} //

export default connect(mapStateToProps,mapDispatchToProps) (withErrorHandler(BurgerBuilder, axios));