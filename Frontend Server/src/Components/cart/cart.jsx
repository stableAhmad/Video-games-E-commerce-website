import React, { useContext, useEffect, useState } from 'react';
import { CartContext } from '../../Context/CartContext';
import styles from '../cart/cart.module.css';
import { Slide, ToastContainer, toast } from 'react-toastify';
import { Helmet } from "react-helmet";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons'; // Replace 'faIconName' with the specific icon you want to use
import axios from 'axios';

export default function Cart() {
  const { cartGames, userData, gameData, cartList, displayCart, setCartGames, countDecrease, cartItemsCount, setCartItemsCount } = useContext(CartContext);

  let [cart, setCart] = useState([]);
  let [cartDetails, setCartDetails] = useState(null);
  let [showForm, setShowForm] = useState(false);

  async function getData() {
    const data = await displayCart(() => {
      setCartDetails(data.data.cart)
    });
    console.log(data.data.cart);

    console.log(cartDetails);
  }

  useEffect(() => {
    axios.get(`http://localhost:4000/app1/get/relation/${userData}`).then((response) => {
      setCart(response.data.cart);
      setCartItemsCount(response.data.cart.length);
    });
  }, [userData]);

  useEffect(() => {

  }, [cartItemsCount])

  { console.log(cart) }

  async function handleDecrement(gameID, index) {
    console.log(gameID);
    let { data } = await axios.delete(`http://localhost:4000/app1/delete/relation/cart/${userData}/${gameID}`);
    console.log(data);

    let updatedCart = [...cart];
    updatedCart.splice(index, 1);
    setCart(updatedCart);
    console.log(updatedCart);

    let deletedCard = updatedCart;
    setCartGames(deletedCard);
    console.log(cartGames, "som3a");
  }

  async function checkOut() {
    try {
      const orders = await axios.post(`http://localhost:4000/app1/add/relation/order/${userData}`, cart);
      console.log(orders);
      setCart([]);
      setCartGames([]);
      setShowForm(true);
      toast.success("Order placed successfully!");
    } catch (error) {
      toast.error("Failed to place order. Please try again.");
    }
  }

  useEffect(() => {

  }, [cart]);

  return (
    <>
      {/* Helmet */}
      <Helmet>
        <meta charSet="utf-8" />
        <title>CART🛒</title>
        <link rel="canonical" href="http://mysite.com/example" />
      </Helmet>
      {/* ToastContainer */}
      <ToastContainer />

      <h1 className="text-white">Cart</h1>

      <div className="container">
        <div className="row">
          {cart && cart.length > 0 ? (
            <div className={`${styles.Cart} col-12 text-white p-5`}>
              {cart.map((game, index) => (
                <div key={game.id} className="row border-bottom px-2 py-3">
                  <div className="col-sm-4 col-md-2 col-lg-1">
                    <img src={game.imageURL} alt="" className={`${styles.smallImg} w-100 rounded`} />
                  </div>
                  <div className="col-sm-8 col-md-10 col-lg-11 d-flex justify-content-between align-items-center ">
                    <div>
                      <h4>{game.title}</h4>
                      <p className="text-success fs-4">{game.price}</p>
                    </div>
                    <div className="d-flex align-items-center">
                      <p className="text-white mx-2 mb-0">{game.count}</p>
                      <button
                        className="btn btn-danger mx-1"
                        onClick={() => {
                          countDecrease();
                          handleDecrement(game, index);
                        }}
                      >
                        <FontAwesomeIcon icon={faTrash} style={{ color: "#222" }} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {/* Checkout button */}
              {cart.length > 0 && (
                <div className="text-center mt-4">
                  <button className="btn w-100" onClick={checkOut}>Checkout</button>
                </div>
              )}
            </div>
          ) : (
            <h3 className="text-center">No Cart Found</h3>
          )}
          {/* Form */}
          {showForm && (
            <div className={`${styles.Cart} col-12 text-white p-5`}>
              <h3>Order Form</h3>
              <form>
                {/* Add form fields here */}
              </form>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
