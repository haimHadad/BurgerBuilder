import React from 'react';
import {connect} from 'react-redux';

import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';
import {Route, Redirect} from 'react-router-dom';
import ContactData from './ContactData/ContactData';

const checkout  = props => {

    const checkoutContinuedHandler = () => {
        props.history.replace('/checkout/contact-data');
    }

    const checkOutCancelledHandler = () => {
        props.history.goBack();
    }

    let summary = (<Redirect to="/" />);
    if(props.ings){
        const purchasedRedirect = props.purchased ? <Redirect to="/"/> : null;
        summary = (
            <div>
                {purchasedRedirect}
                <CheckoutSummary 
                onCheckoutContinued={checkoutContinuedHandler}
                onCheckOutCancelled={checkOutCancelledHandler} 
                ingredients ={props.ings}/>
                <Route 
                path={props.match.path + '/contact-data'} 
                component={ContactData}/>
            </div>
        );
    }
    return summary;
    
}

const mapStateToProps = (state ) => {
    return {
        ings: state.burgerBuilder.ingredients,
        totalPrice: state.burgerBuilder.totalPrice,
        purchased: state.order.purchased
    }
}


export default connect(mapStateToProps, null)(checkout);