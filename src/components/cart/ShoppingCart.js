import React, { useContext, useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Redirect, NavLink } from 'react-router-dom';
import { storeContext, CLEAR_SUCCESS } from '../../STATES/Actions/Actions';
import CartItem from './CartItem';
import OrderedList from './OrderedList';


const ShoppingCart = (props) => {
    const { storestate, storedispatch } = useContext(storeContext)
    const { cart, User, Ordered } = storestate;
    useEffect(() => {
        storedispatch({ type: CLEAR_SUCCESS })
    }, []);
    let orderedlist = <OrderedList products={Ordered} />
    const itemDisplay = cart.map((product) => <Fragment key={product.id}><CartItem product={product} /></Fragment>)
    let total = 0
    for (const product of cart) {
        let amount = product.price * product.quantity
        total += amount
    }
    const directions = total > 0 && User == "" ? <NavLink to="/login">
        <button>Place Order</button></NavLink> : total > 0 && User != "" ? <NavLink to="/confirmOrder"><button>CONFIRM ORDER</button></NavLink> : ""
    const order = { "product": cart, total }

    return (
        <Fragment>
            {User.user != undefined && User.user != "" ? <div className="userNameDiv">
                <p className="userName">Welcome, {`${User.user.first_name.toUpperCase()} ${User.user.last_name.toUpperCase()}`} </p>
            </div> : ""}
            <div className="orderList" >
                {Ordered.length > 0 ? orderedlist : ""}
            </div>
            <div className="orderListDisplay">
                <h3>CART</h3>
                {itemDisplay}
                < p className="amount">Total Amount: &#x20A6; {`${total}`}</p>
                <p className="directions"> {directions}</p>
            </div>


        </Fragment >
    );
};


ShoppingCart.propTypes = {

};


export default ShoppingCart;
