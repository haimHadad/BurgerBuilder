import React from 'react';
import classes from './DrawerToggle.css';

const drawerToggle = (props) =>(
    <button className= {classes.DrawerToggle} onClick={props.drawerToggleClicked}>
                <span className={classes.DrawerToggle__Bar}></span>
                <span className={classes.DrawerToggle__Bar}></span>
                <span className={classes.DrawerToggle__Bar}></span>
    </button>
);

export default drawerToggle;