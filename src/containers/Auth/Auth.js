import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom';

import classses from './Auth.css';
import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import Spinner from '../../components/UI/Spinner/Spinner';
import * as actions from '../../store/actions/index';
import {updateObject, checkValidity} from '../../shared/utility';

const auth = props => {

    const [authForm, setAuthForm] = useState({    
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
        });
    const [isSignUp, setIsSignup] = useState(true);

    const {buildingBurger, authRedirectPath, onSetAuthRedirectPath} = props;
    
    useEffect(() => {
        if(!buildingBurger && authRedirectPath !== '/'){
            onSetAuthRedirectPath();
        }

    },[buildingBurger, authRedirectPath, onSetAuthRedirectPath]);    




    const inputChangedHandler = (event, controlName) =>{
        const updatedControls = updateObject(authForm, {
            [controlName]: updateObject(authForm[controlName], {
                value: event.target.value,
                valid: checkValidity(event.target.value, authForm[controlName].validation),
                touched: true
            })  
        });
        setAuthForm(updatedControls);
    }

    const submitHandler = event => {
        event.preventDefault();
        props.onAuth(
            authForm.email.value, 
            authForm.password.value,
            isSignUp
        );
    }

    const switchAuthModeHandler = () => {
        setIsSignup(!isSignUp);
    }

    
    const formElementsArray = [];
    for(let key in authForm){
        formElementsArray.push({
            id: key,
            config: authForm[key]
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
            changed={(event) => inputChangedHandler(event,formElement.id)}
        />           
    ));

    if(props.loading){
        form = <Spinner/>;
    }

    let errorMessage = null;
    if(props.error){
        let errorMsg = props.error.message.split('_').join(' ');
        errorMessage = <p className={classses.error}>{errorMsg}</p>;
    }
        
    let authRedirect = null;
    if(props.isAuthenticated){
        authRedirect = <Redirect to={props.authRedirectPath} />
    }
    return (
        <div className={classses.Auth}>
            {authRedirect}
            {errorMessage}
             <form onSubmit={submitHandler}>
                {form}
                <Button
                    btnType="Success">
                        {isSignUp ? 'SIGN-UP': 'SIGN-IN'}
                </Button>
                <Button
                    type="button" 
                    clicked={switchAuthModeHandler} 
                    btnType="Danger">
                        SWITCH TO {isSignUp ? 'SIGN-IN': 'SIGN-UP'} 
                </Button>
            </form>
        </div>
    );
    
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
        onAuth: (email, password, isisSignUp) => dispatch(actions.auth(email, password, isisSignUp)),
        onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath('/'))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(auth);