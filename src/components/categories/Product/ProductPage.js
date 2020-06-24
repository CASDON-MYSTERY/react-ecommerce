import React, { useContext, useEffect, useState, Fragment } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { storeContext, getCategory, GET_BRAND, addToCart, load, LOADING } from '../../../STATES/Actions/Actions';
import Products from './product';
import "../../../CSS/productpage.css"



const ProductPage = (props) => {
    const { brand, id, name } = useParams()
    const [DivDisplay, setDivdisplay] = useState({ display: false, check: false })
    const [priceState, setpriceState] = useState([])
    const { storestate, storedispatch } = useContext(storeContext)
    const { store, prices } = storestate
    let product = { image: "", name: "", brand: "", price: "", discription: "", multiprice: "" }
    let products = "";
    let catProducts = "";
    let Prices = []
    let checkBoxs = ""
    let check = false;
    const initial = { display: false, check: false }
    useEffect(() => {
        const data = { "data": brand, "search": "brand" }
        getCategory(data, GET_BRAND).then(res => storedispatch(res))
        storedispatch(load(LOADING))
        window.scrollTo("",0)
    }, [id])

    if (storestate.brand != undefined) {

        const stores = storestate.brand.products
        products = stores.filter(product => product.id != id)
        let [item] = stores.filter(product => product.id == id)
        if (item != undefined) {
            product = item
        }

        if (products == "") {
            const catId = product.category
            let [category] = store.filter(x => x.id == catId)
            catProducts = category.products.filter(product => product.id != id)
        }

    }
    const onChange = (e) => {
        let [price] = Prices.filter(x => x.id == e.target.id)
        price.checked = e.target.checked
        let [rest] = Prices.filter(x => x.id != e.target.id)
        setpriceState([price, rest])

    }

    if (product.multiprice != "" && product.multiprice.length > 0) {
        let array = product.multiprice

        for (const index of array) {
            let [price] = prices.filter(x => x.id == index)
            Prices.push(price)
        }
        checkBoxs = Prices.map(x => <Fragment key={x.id}>
            <input onClick={onChange} type="checkbox" name="" id={x.id} />
            <label htmlFor={`${x.id} ${x.size}`}>{`${x.size}:`} &#x20A6;{`${x.price}`}</label>
        </Fragment>)
    }

    const onClick = () => {
        // let check = false;
        if (product.multiprice.length > 0) {
            if (priceState.length > 0) {
                setDivdisplay({ display: true })
                let filtered = priceState.filter(x => x.checked == true)
                for (const index of filtered) {
                    const data = { id: parseInt(`${product.id}${index.id}`), Id: product.id, name: product.name, brand: product.brand, price: index.price, size: index.size, quantity: 1, image: product.image }
                    storestate.cart.forEach(x => {
                        if (x.id == data.id) {
                            check = true
                            setDivdisplay({ display: true, check: true })
                        }
                    })
                    if (check != true) {
                        storedispatch(addToCart(data))
                    }

                }
            }
        } else if (product.multiprice.length == 0) {
            setDivdisplay({ display: true })
            storestate.cart.forEach(x => {
                if (x.id == id) {
                    check = true
                    setDivdisplay({ display: true, check: true })
                }
            })
            if (check != true) {
                const data = { id: product.id, Id: product.id, name: product.name, brand: product.brand, price: product.price, quantity: 1, image: product.image }
                storedispatch(addToCart(data))
            }
        }
    }

    const decisionBox = <div className="decisionBox">
        <p>Choose either to continue shopping or to view your shopping cart by checking out</p>
        <button onClick={() => { setDivdisplay(initial) }}>Continue Shopping</button>
        <NavLink to="/ShoppingCart"><button>Check Out</button> </NavLink>
    </div>
    const alreadyInCart = <div className="decisionBox" >
        <p style={{ color: "red", marginLeft: "50px" }}>Item already in Cart</p>
        <button onClick={() => { setDivdisplay(initial) }}>Continue Shopping</button>
        <NavLink to="/ShoppingCart"><button>Check Out</button> </NavLink>
    </div>
    if (storestate.brand != undefined && product.image != "") {
        return (
            <div className="productPage">
                <div className="productDisplay">
                    <img src={product.image} alt="" />
                    <p >{product.name}</p>
                    <p >{product.brand}</p>
                    {Prices.length > 0 ? <div className="prices"><p>Sizes and Prices</p>{checkBoxs}</div> : <p > &#x20A6; {`${product.price}`}</p>}
                    <div dangerouslySetInnerHTML={{__html:product.discription}}></div>
                    <button onClick={onClick}>ADD TO CART</button>
                </div>
                {DivDisplay.check && DivDisplay.display ? alreadyInCart : DivDisplay.display ? decisionBox : ""}
                <div>

                    {products != "" ?
                        <div className="categoryDisplayBox">
                            <h3>Products of same brand</h3>
                            <Products products={products} />
                        </div> : catProducts != "" ? <div className="categoryDisplayBox">
                            <h3>Products of same category</h3>
                            <Products products={catProducts} />
                        </div> : ""
                    }
                </div>
            </div>
        );
    } else {
        return (<Fragment />)
    }

};

ProductPage.propTypes = {

};


export default ProductPage;
