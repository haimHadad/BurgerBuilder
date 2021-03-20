import React from 'react';
import NavigationItem from './NavigationItem/NavigationItem';

import classes from './NavigationItems.css'

const navigationItems = (props) =>(
    <ul className={classes.NavigationItems}>
        <NavigationItem link="/" exact>Burger Builder</NavigationItem>
        <NavigationItem link="/orders">Checkout</NavigationItem>
        {!props.isAuthenticated ? 
        <NavigationItem link="/auth" exact>Authenticte</NavigationItem>
        :
        <NavigationItem link="/logout" exact>Logout</NavigationItem>
        }
    </ul>
);

export default navigationItems;