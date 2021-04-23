import React, {Component} from 'react';
import {connect} from 'react-redux';

import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';
import {Route, Redirect} from 'react-router-dom';
import ContactData from './ContactData/ContactData';

class Checkout extends Component{

    checkoutContinuedHandler = () => {
        this.props.history.replace('/checkout/contact-data');
        var elmnt = document.getElementById("myDiv");
        elmnt.scrollIntoView();    }

    checkOutCancelledHandler = () => {
        this.props.history.goBack();
    }


    render(){
        let summary = (<Redirect to="/" />);
        if(this.props.ings){
            const purchasedRedirect = this.props.purchased ? <Redirect to="/"/> : null;
            summary = (
                <div id="myDiv">
                    {purchasedRedirect}
                    <CheckoutSummary 
                    onCheckoutContinued={this.checkoutContinuedHandler}
                    onCheckOutCancelled={this.checkOutCancelledHandler} 
                    ingredients ={this.props.ings}/>
                    <Route
                    path={this.props.match.path + '/contact-data'} 
                    component={ContactData}/>
                </div>
            );
        }
        return summary;
    }
}

const mapStateToProps = (state ) => {
    return {
        ings: state.burgerBuilder.ingredients,
        totalPrice: state.burgerBuilder.totalPrice,
        purchased: state.order.purchased
    }
}


export default connect(mapStateToProps, null)(Checkout);