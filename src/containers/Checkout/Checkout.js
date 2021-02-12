import React, {Component} from 'react';
import {connect} from 'react-redux';

import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';
import {Route} from 'react-router-dom';
import ContactData from './ContactData/ContactData';

class Checkout extends Component{
    
    checkoutContinuedHandler = () => {
        this.props.history.replace('/checkout/contact-data');
    }

    checkOutCancelledHandler = () => {
        this.props.history.goBack();
    }


    render(){
        return (<div>
            <CheckoutSummary 
                onCheckoutContinued={this.checkoutContinuedHandler}
                onCheckOutCancelled={this.checkOutCancelledHandler} 
                ingredients ={this.props.ings}/>
        <Route 
            path={this.props.match.path + '/contact-data'} 
            component={ContactData}/>
                
        </div>);
    }
}

const mapStateToProps = (state ) => {
    return {
        ings: state.ingredients,
        totalPrice: state.totalPrice
    }
}
/* const mapDispatchToProps = (dispatch) => {
    return {
        onIngredientAdded:(ingName) => dispatch({type: actionType.ADD_INGREDIENT, ingredientName:ingName }),
        onIngredientRemoved:(ingName) => dispatch({type: actionType.REMOVE_INGREDIENT, ingredientName:ingName })
    }
} */

export default connect(mapStateToProps, null)(Checkout);