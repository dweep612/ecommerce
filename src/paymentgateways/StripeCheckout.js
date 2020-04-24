import React, { useState, useEffect } from "react";
import { isAuthenticated } from "../auth/helper/auth";
import { cartEmpty } from "../core/helper/cartHelper";
import { API } from "../backend";
import { createOrder } from "../core/helper/orderHelper";
import StripeCheckoutBtn from "react-stripe-checkout";
import { Link } from "react-router-dom";

const StripeCheckout = ({
  products,
  setReload = (f) => f,
  reload = undefined,
}) => {
  const [data, setData] = useState({
    loading: false,
    success: "",
    error: "",
    address: "",
  });

  const { success, error } = data;

  const userToken = isAuthenticated() && isAuthenticated().token;
  const userId = isAuthenticated() && isAuthenticated().user._id;

  const getFinalAmount = () => {
    let amount = 0;

    products.map((product) => {
      amount = amount + product.price;
    });
    return amount;
  };

  const makePayment = (token) => {
    const body = {
      token,
      products,
    };
    const headers = {
      "Content-Type": "application/json",
    };

    return fetch(`${API}/stripepayment`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    })
      .then((response) => {
        // console.log("RES: ", response);

        const { status } = response;
        // console.log("STATUS: ", status);

        if (status === 200) {
          const orderData = {
            products: products,
          };

          createOrder(userId, userToken, orderData);
          // .then((data) => console.log(data))
          // .catch((err) => console.log(err));

          cartEmpty(() => {
            // console.log("Cart Empty!");
          });

          setReload(!reload);
          setData({ ...data, success: "Payment Successful!" });
        } else {
          setData({ ...data, error: "Transaction failed! Try Again!" });
        }
      })
      .catch((err) => console.log(err));
  };

  const successMessage = () => {
    return (
      <div className="row">
        <div className="col-md-6 offset-sm-3 text-center">
          <div
            className="alert alert-success"
            style={{ display: success ? "" : "none" }}
          >
            {success}
          </div>
        </div>
      </div>
    );
  };

  const errorMessage = () => {
    return (
      <div className="row">
        <div className="col-md-6 offset-sm-3 text-center">
          <div
            className="alert alert-danger"
            style={{ display: error ? "" : "none" }}
          >
            {error}
          </div>
        </div>
      </div>
    );
  };

  const showStripeButton = () => {
    return isAuthenticated() ? (
      <StripeCheckoutBtn
        stripeKey="pk_test_publishable_key"
        token={makePayment}
        amount={getFinalAmount() * 100}
        name="Buy Tshirts"
        shippingAddress
        billingAddress
      >
        <button className="btn btn-success">Pay with Stripe</button>
      </StripeCheckoutBtn>
    ) : (
      <Link to="/signin">
        <button className="btn btn-warning">Signin</button>
      </Link>
    );
  };

  return (
    <div>
      {successMessage()}
      {errorMessage()}
      <h3 className="text-white">Total Amount: ${getFinalAmount()}</h3>
      {showStripeButton()}
    </div>
  );
};

export default StripeCheckout;
