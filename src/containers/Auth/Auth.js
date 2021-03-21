import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom';

import classses from './Auth.css';
import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import Spinner from '../../components/UI/Spinner/Spinner';
import * as actions from '../../store/actions/index';

class Auth extends Component{

    state = {
        controls:{
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'email',
                    placeholder: 'Your Email Address'
                },
                value: '',
                validation:{
                    requierd: true,
                    isEmail: true
                },
                valid:false,
                touched: false
            },
            password: {
                elementType: 'input',
                elementConfig: {
                    type: 'password',
                    placeholder: 'Your Password'
                },
                value: '',
                validation:{
                    requierd: true,
                    minLength: 6
                },
                valid:false,
                touched: false
            }
        },
        isSignUp: true
    }

    componentDidMount(){
        if(!this.props.buildingBurger && this.props.authRedirectPath !== '/'){
            this.props.onSetAuthRedirectPath();
        }
    }

    checkValidity = (value, rules) =>{
        let isValid = true;
        if(!rules){
            return isValid;
        }
        if(rules.requierd){
            isValid = value.trim() !== '' && isValid;
        }

        if(rules.minLength){
            isValid = value.length >= rules.minLength && isValid;
        }

        if(rules.maxLength){
            isValid = value.length <= rules.maxLength && isValid;
        }

        if(rules.isEmail){
            const pattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
            isValid = pattern.test(value);
        }
        return isValid;
    }

    inputChangedHandler = (event, controlName) =>{
        const updatedOrderForm = {
            ...this.state.controls,
            [controlName]:{
                ...this.state.controls[controlName],
                value: event.target.value,
                valid: this.checkValidity(event.target.value, this.state.controls[controlName].validation),
                touched: true
            }  
        };
        this.setState({controls: updatedOrderForm});
    }

    submitHandler = (event) => {
        event.preventDefault();
        this.props.onAuth(
            this.state.controls.email.value, 
            this.state.controls.password.value,
            this.state.isSignUp
        );
    }

    switchAuthModeHandler = () => {
        this.setState(prevState =>{
            return {isSignUp: !prevState.isSignUp}
        });
    }

    render(){
        const formElementsArray = [];
        for(let key in this.state.controls){
            formElementsArray.push({
                id: key,
                config: this.state.controls[key]
            });
        }

        let form = formElementsArray.map(formElement => (
            <Input 
                key={formElement.id}
                elementType={formElement.config.elementType}
                elementConfig={formElement.config.elementConfig}
                value={formElement.config.value}
                invalid={!formElement.config.valid}
                shouldValidate={formElement.config.validation}
                touched={formElement.config.touched}
                inputName={formElement.id}
                changed={(event) => this.inputChangedHandler(event,formElement.id)}
            />           
        ));

        if(this.props.loading){
            form = <Spinner/>;
        }

        let errorMessage = null;
        if(this.props.error){
            let errorMsg = this.props.error.message.split('_').join(' ');
            errorMessage = <p className={classses.error}>{errorMsg}</p>;
        }
        
        let authRedirect = null;
        if(this.props.isAuthenticated){
            authRedirect = <Redirect to={this.props.authRedirectPath} />
        }
        return (
            <div className={classses.Auth}>
                {authRedirect}
                {errorMessage}
                <form onSubmit={this.submitHandler}>
                    {form}
                    <Button
                        btnType="Success">
                            {this.state.isSignUp ? 'SIGN-UP': 'SIGN-IN'}
                    </Button>
                    <Button
                        type="button" 
                        clicked={this.switchAuthModeHandler} 
                        btnType="Danger">
                            SWITCH TO {this.state.isSignUp ? 'SIGN-IN': 'SIGN-UP'} 
                    </Button>
                </form>
            </div>
        );
    }
}


const mapStateToProps = state => {
    return {
        loading: state.auth.loading,
        error: state.auth.error,
        isAuthenticated: state.auth.token !== null,
        buildingBurger: state.burgerBuilder.building,
        authRedirectPath: state.auth.authRedirectPath
    };
}

const mapDispatchToProps = dispatch =>{
    return {
        onAuth: (email, password, isSignUp) => dispatch(actions.auth(email, password, isSignUp)),
        onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath('/'))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Auth);