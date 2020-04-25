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
    redirect: false,
  });

  const { success, error, redirect } = data;

  const userToken = isAuthenticated() && isAuthenticated().token;
  const userId = isAuthenticated() && isAuthenticated().user._id;
  const userRole = isAuthenticated() && isAuthenticated().user.role;

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
            // transaction_id: response.object.id,
            // amount: response.object.amount,
          };

          createOrder(userId, userToken, orderData);
          // .then((data) => console.log(data));
          // .catch((err) => console.log(err));

          cartEmpty(() => {
            // console.log("Cart Empty!");
          });

          setReload(!reload);
          setData({ ...data, success: "Payment Successful!", redirect: true });
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

  const performRedirect = () => {
    if (redirect) {
      if (userRole === 1) {
        setTimeout(() => {
          window.location = "/admin/dashboard";
        }, 2000);
      } else {
        setTimeout(() => {
          window.location = "/user/dashboard";
        }, 2000);
      }
    }
  };

  const showStripeButton = () => {
    return isAuthenticated() ? (
      <StripeCheckoutBtn
        stripeKey={process.env.REACT_APP_KEY}
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
      <h3 className="text-white mb-4">Total Amount: ${getFinalAmount()}</h3>
      {successMessage()}
      {errorMessage()}
      {performRedirect()}
      {showStripeButton()}
    </div>
  );
};

export default StripeCheckout;
