import React from 'react';
import NavigationItem from './NavigationItem/NavigationItem';

import classes from './NavigationItems.css'

const navigationItems = (props) =>(
    <ul className={classes.NavigationItems}>
        <NavigationItem link="/" exact>Burger Builder</NavigationItem>
        {props.isAuthenticated ?
            <NavigationItem link="/orders">Checkout</NavigationItem>       
        :
            null
        }
        {!props.isAuthenticated ? 
            <NavigationItem link="/auth" exact>Authenticate</NavigationItem>
            :
            <NavigationItem link="/logout" exact>Logout</NavigationItem>
        }
    </ul>
);

export default navigationItems;