import React, {Component} from 'react';
import {connect} from 'react-redux';
import axios from '../../../axios-orders';
import Spinner from '..//..//../components/UI/Spinner/Spinner';
import Button from '../../../components/UI/Button/Button';
import classes from './ContactData.css';
import Input from '../../../components/UI/Input/Input';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../../store/actions/index';
import {updateObject, checkValidity} from '../../../shared/utility';

class ContactData extends Component{
    state={
        orderForm: {
            name: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Your Name'
                },
                value: '',
                validation:{
                    requierd: true
                },
                valid:false,
                touched: false
            },
            street: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Street'
                },
                value: '',
                validation:{
                    requierd: true
                },
                valid:false,
                touched: false
            },
            zipcode: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'ZIP Code'
                },
                value: '',
                validation:{
                    requierd: true,
                    minLength: 5,
                    maxLength: 5
                },
                valid:false,
                touched: false
            },
            country: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Country'
                },
                value: '',
                validation:{
                    requierd: true
                },
                valid:false,
                touched: false
            },
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'email',
                    placeholder: 'Your Email'
                },
                value: '',
                validation:{
                    requierd: true,
                    isEmail: true
                },
                valid:false,
                touched: false
            },
            deliveryMethod: {
                elementType: 'select',
                elementConfig: {
                    type: 'email',
                    options:[
                        {value: 'fastest', displayValue:'Fastest'},
                        {value: 'cheapest', displayValue:'Cheapest'}
                    ]
                },
                value: 'fastest',
                validation:{},
                valid: true
            }
        },
        formIsValid: false
    }

    orderHandler = (event) => {
        event.preventDefault();
        const formData = {};
        for(let formElementIdentifier in this.state.orderForm){
            formData[formElementIdentifier] = this.state.orderForm[formElementIdentifier].value;
        }
        let price = +this.props.price;
        const order = {
            ingredients: this.props.ings,
            price: price.toFixed(2),
            orderData: formData,
            userId: this.props.userId
        }
        this.props.onOrderBurger(order, this.props.token);         

    }

    inputChangedHandler = (event, inputIdentifier) =>{

        const updatedFormElement = updateObject(this.state.orderForm[inputIdentifier], {
            value: event.target.value,
            valid: checkValidity(event.target.value, this.state.orderForm[inputIdentifier].validation),
            touched: true
        });
        const updatedOrderForm = updateObject(this.state.orderForm,{
            [inputIdentifier] : updatedFormElement
        });
        
        let formIsValid = true;
        for(let inputIdentifiers in updatedOrderForm){
            formIsValid = updatedOrderForm[inputIdentifiers].valid  && formIsValid;
        }
        this.setState({orderForm : updatedOrderForm, formIsValid : formIsValid});
    }

    render(){
        const formElementsArray = [];
        for(let key in this.state.orderForm){
            formElementsArray.push({
                id: key,
                config: this.state.orderForm[key]
            });
        }
        let form =(
            <form onSubmit={this.orderHandler}>
                {formElementsArray.map(formElement =>{
                    return <Input
                        key={formElement.id}
                        elementType={formElement.config.elementType}
                        elementConfig={formElement.config.elementConfig}
                        value={formElement.config.value}
                        invalid={!formElement.config.valid}
                        shouldValidate={formElement.config.validation}
                        touched={formElement.config.touched}
                        inputName={formElement.id}
                        changed={(event) => this.inputChangedHandler(event,formElement.id)}/>
                })}
                <Button disabled={!this.state.formIsValid} btnType="Success">ORDER NOW</Button>
            </form>
        );
        if(this.props.loading){
            form = <Spinner/>
        }
        
        return (
            <div className={classes.ContactData}>
                <h4>Enter Your Contact Data</h4>
                {form}
            </div>
        );
    }
}

const mapStateTopProps = state =>{
    return {
        ings: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        token: state.auth.token,
        userId: state.auth.userId
    } 
};

const mapDispatchTopProps = dispatch => {
    return {
        onOrderBurger: (orderData, token) => dispatch(actions.purchaseBurger(orderData,token))
    };
};

export default connect(mapStateTopProps, mapDispatchTopProps) (withErrorHandler(ContactData, axios));
