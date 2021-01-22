import React, {Component} from 'react';
import axios from '../../../axios-orders';
import Spinner from '..//..//../components/UI/Spinner/Spinner';
import Button from '../../../components/UI/Button/Button';
import classes from './ContactData.css';

class ContactData extends Component{
    state={
        name: '',
        email: '',
        address: {
            strreet: '',
            postalCode: ''
        },
        loading: false,
    }

    orderHandler = (event) => {
        event.preventDefault();
        this.setState({ loading:true });
        const order = {
            ingredients: this.props.ingredients,
            price: this.props.price,
            customer: {
                name:'Haim',
                address:{
                    street: 'Teststreet 1',
                    zipcode: '23515',
                    country: 'Israel',
                },
                email: 'haim.hddd@gmail.com'
            },
            deliveryMethod: 'fastest'
        }
        axios.post('orders.json', order)
            .then(response => {
                this.setState({loading:false});
                this.props.history.push('/');
            })
            .catch(error => {
                this.setState({loading:false});
            }); 

    }

    render(){
        let form =(
            <form>
                <input className={classes.Burger} type="text" name="name" placeholder="Your Name"/>
                <input className={classes.Burger} type="email" name="email" placeholder="Your Email"/>
                <input className={classes.Burger} type="text" name="street" placeholder="Your Aaddress"/>
                <input className={classes.Burger} type="text" name="postal" placeholder="Your Postal Code"/>
                <Button btnType="Success" clicked={this.orderHandler}>ORDER NOW</Button>
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
