import React, {useState} from 'react';

import Aux from '../Auxiliary/Auxiliary';
import classes from './Layout.css';
import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';
import {connect} from 'react-redux';

const layout = props =>{
    
    const [SideDrawerIsVisible, setSideDrawerIsVisible ] = useState(false)


    const sideDrawerToggleHandler = ()=>{
        setSideDrawerIsVisible(!SideDrawerIsVisible);
    }

    const sideDrawerClosedHandler = ()=>{
        setSideDrawerIsVisible(false);
    }

    return (
        <Aux>
            <Toolbar 
            drawerToggleClicked = {sideDrawerToggleHandler} 
            isAuth ={props.isAuthenticated}
            />
            <SideDrawer
                isAuth ={props.isAuthenticated}
                closed= {sideDrawerClosedHandler}
                open={SideDrawerIsVisible}/>
            <main className = {classes.Content}>
                {props.children}
            </main>
        </Aux>
    );
}

const mapStateToProps = state =>{
    return {
        isAuthenticated: state.auth.token !== null
    }
}

export default connect(mapStateToProps) (layout);