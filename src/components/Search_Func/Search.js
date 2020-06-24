import React, { useState, useContext, useEffect, Fragment } from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { storeContext, addSearch, getCategory, GET_ALL, DELETE_SEARCH, load, LOADING } from '../../STATES/Actions/Actions';
import Products from "../categories/Product/product";
import '../../CSS/search.css';

const initial = { search: "" }
const notMatched = "No Match Found"
const searchFunc = (data, store, dispatch, func) => {
    let result = []
    store.forEach(product => {
        if (product.brand.toLowerCase().indexOf(data.toLowerCase()) > -1
            || product.name.toLowerCase().indexOf(data.toLowerCase()) > -1) {
            result.push(product)
        }
    })
    if (result.length == 0) {
        result = notMatched
    }
    dispatch(func(result))

}

let style = {
    color: "red",
    backgroundColor: "white",
    width: "140px",
    textAlign: "center",
    padding: "2px",
    fontSize: "18px",
    margin: "0px auto",
}

const Search = (props) => {
    const { storestate, storedispatch } = useContext(storeContext)
    const { searchstore } = storestate
    const [searchstate, setSearch] = useState(initial)
    const { search } = searchstate;
    let searchResult = ""

    useEffect(() => {
        const data = { "data": "none", "search": "all" }
        getCategory(data, GET_ALL).then(res => storedispatch(res))
        storedispatch(load(LOADING))
        return () => {
            storedispatch({ type: DELETE_SEARCH })
        }
    }, []);

    if (storestate.searchResult != undefined && storestate.searchResult != "") {
        searchResult = storestate.searchResult != notMatched ?
            <Products products={storestate.searchResult} /> : <p style={style}>{notMatched}</p>
    }
    // else if (storestate.searchResult != undefined && storestate.searchResult == "") {
    //     searchResult = <p>No Match</p>
    //     console
    // }

    const onChange = (e) => {
        setSearch({ ...searchstate, [e.target.name]: e.target.value })
    }
    const onSubmit = e => {
        e.preventDefault();
        const { search } = searchstate;
        if (search.length > 0) {
            searchFunc(search, searchstore.products, storedispatch, addSearch)
        }

    }

    return (
        <Fragment>
        <div className="Mainsearch">
            <form action="" onSubmit={onSubmit}>
                <input onChange={onChange} type="text" name="search" value={search} id="search" placeholder="Search Products and Brands" />
                <button type="submit">SEARCH</button>
            </form>
        </div>
        <div className="SearchDisplayBox">
                 {searchResult}
            </div>
        </Fragment>
    );
};


Search.propTypes = {

};


export default Search;
