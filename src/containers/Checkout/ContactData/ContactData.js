import React, {useState} from 'react';
import {connect} from 'react-redux';
import axios from '../../../axios-orders';
import Spinner from '..//..//../components/UI/Spinner/Spinner';
import Button from '../../../components/UI/Button/Button';
import classes from './ContactData.css';
import Input from '../../../components/UI/Input/Input';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../../store/actions/index';
import {updateObject, checkValidity} from '../../../shared/utility';

const contactData = props =>{
    const [orderForm, setOrderForm] = useState({
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
            });
         
    const [formIsValid, setFormIsValid] = useState(false)

    const orderHandler = (event) => {
            event.preventDefault();
            const formData = {};
            for(let formElementIdentifier in orderForm){
                formData[formElementIdentifier] = orderForm[formElementIdentifier].value;
            }
            let price = + props.price;
            const order = {
                ingredients: props.ings,
                price: price.toFixed(2),
                orderData: formData,
                userId: props.userId
            }
            props.onOrderBurger(order, props.token);         

        }

    const inputChangedHandler = (event, inputIdentifier) =>{

        const updatedFormElement = updateObject(orderForm[inputIdentifier], {
            value: event.target.value,
            valid: checkValidity(event.target.value, orderForm[inputIdentifier].validation),
            touched: true
        });
        const updatedOrderForm = updateObject(orderForm,{
            [inputIdentifier] : updatedFormElement
        });
        
        let formIsValid = true;
        for(let inputIdentifiers in updatedOrderForm){
            formIsValid = updatedOrderForm[inputIdentifiers].valid  && formIsValid;
        }
        /* this.setState({orderForm : updatedOrderForm, formIsValid : formIsValid}); */
        setOrderForm(updatedOrderForm);
        setFormIsValid(formIsValid);
    }

    
    const formElementsArray = [];
    for(let key in orderForm){
        formElementsArray.push({
            id: key,
            config: orderForm[key]
        });
    }
    let form =(
        <form onSubmit={orderHandler}>
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
                    changed={(event) => inputChangedHandler(event,formElement.id)}/>
            })}
            <Button disabled={!formIsValid} btnType="Success">ORDER NOW</Button>
        </form>
    );
    if(props.loading){
        form = <Spinner/>
    }
        
    return (
        <div className={classes.ContactData}>
            <h4>Enter Your Contact Data</h4>
            {form}
        </div>
    );
    
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

export default connect(mapStateTopProps, mapDispatchTopProps) (withErrorHandler(contactData, axios));
