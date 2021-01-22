import React, {Component} from 'react';
import axios from '../../../axios-orders';
import Spinner from '..//..//../components/UI/Spinner/Spinner';
import Button from '../../../components/UI/Button/Button';
import classes from './ContactData.css';
import Input from '../../../components/UI/Input/Input';

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
                valid:false
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
                valid:false
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
                valid:false
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
                valid:false
            },
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'email',
                    placeholder: 'Your Email'
                },
                value: '',
                validation:{
                    requierd: true
                },
                valid:false
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
                value: ''
            }
        },
        loading: false,
    }

    orderHandler = (event) => {
        event.preventDefault();
        console.log('check!!!!!!!!!!!!!')
        this.setState({ loading:true });
        const formData = {};
        for(let formElementIdentifier in this.state.orderForm){
            formData[formElementIdentifier] = this.state.orderForm[formElementIdentifier].value;
        }
        let price = +this.props.price;
        const order = {
            ingredients: this.props.ingredients,
            price: price.toFixed(2),
            orderData: formData
        }
        console.log(order);
        
        axios.post('orders.json', order)
            .then(response => {
                this.setState({loading:false});
                this.props.history.push('/');
            })
            .catch(error => {
                this.setState({loading:false});
            }); 

    }

    checkValidity(value, rules){
        let isValid = true;

        if(rules.requierd){
            isValid = value.trim() !== '' && isValid;
        }

        if(rules.minLength){
            isValid = value.length >= rules.minLength && isValid;
        }

        if(rules.maxLength){
            isValid = value.length <= rules.maxLength && isValid;
        }
        return isValid;
    }

    inputChangedHandler = (event, inputIdentifier) =>{
        const updatedOrderForm = {...this.state.orderForm};
        const updatedFormElement = {...updatedOrderForm[inputIdentifier]}
        updatedFormElement.value = event.target.value;
        updatedFormElement.valid = this.checkValidity(updatedFormElement.value, updatedFormElement.validation);
        updatedOrderForm[inputIdentifier] = updatedFormElement;
        
        this.setState({orderForm : updatedOrderForm});
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
                        changed={(event) => this.inputChangedHandler(event,formElement.id)}/>
                })}
                {/* <Input inputtype="input" type="email" name="email" placeholder="Your Email"/>
                <Input inputtype="input" type="text" name="street" placeholder="Your Aaddress"/>
                <Input inputtype="input" type="text" name="postal" placeholder="Your Postal Code"/> */}
                <Button btnType="Success">ORDER NOW</Button>
            </form>
        );
        if(this.state.loading){
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

export default ContactData;
