import React from 'react';
import Backdrop from '../Backdrop/Backdrop';
import classes from './Modal.css';
import Aux from '../../../hoc/Auxiliary/Auxiliary';


const modal = props =>{
    return(
        <Aux>
        <Backdrop show={props.show} clicked={props.modalClosed} />
        <div 
            className={classes.Modal}
            style={{
                transform: props.show ? 'translateY(0)' : 'translateY(-100vh)',
                opacity: props.show? '1' : '0'
            }}
            >
            {props.children}
        </div>
    </Aux>
    );
    
    
}

export default React.memo(modal, 
    (prevProps, nextProps) => 
    nextProps.show === prevProps && 
    nextProps.children === prevProps.children); 
    
    //At shouldComponentUpdate we checked whether we want to continue  
    //with the update or not and we only wanted to continue if the props are not equal

    //Now