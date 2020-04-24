import React, { useState, useEffect } from "react";
import { cartEmpty } from "../core/helper/cartHelper";
import { Link } from "react-router-dom";
import { getToken, processPayment } from "./helper/braintreeapicalls";
import { createOrder } from "../core/helper/orderHelper";
import { isAuthenticated } from "../auth/helper/auth";
import DropIn from "braintree-web-drop-in-react";

const BraintreeCheckout = ({
  products,
  setReload = (f) => f,
  reload = undefined,
}) => {
  const [info, setInfo] = useState({
    loading: false,
    successPayment: false,
    clientToken: null,
    error: "",
    instance: {},
  });

  const { successPayment, error } = info;

  const userId = isAuthenticated() && isAuthenticated().user._id;
  const userToken = isAuthenticated() && isAuthenticated().token;

  const getFinalAmount = () => {
    let amount = 0;

    products.map((product) => {
      amount = amount + product.price;
    });
    return amount;
  };

  const getAToken = (userId, userToken) => {
    getToken(userId, userToken).then((info) => {
      // console.log("INFO: ", info);
      if (info.error) {
        setInfo({ ...info, error: "" });
      } else {
        const clientToken = info.clientToken;
        // console.log(clientToken);
        setInfo({ clientToken });
      }
    });
  };

  useEffect(() => {
    getAToken(userId, userToken);
  }, []);

  const showbtndropIn = () => {
    return isAuthenticated() ? (
      <div>
        {info.clientToken !== null ? (
          <div>
            <DropIn
              options={{ authorization: info.clientToken }}
              onInstance={(instance) => (info.instance = instance)}
            />
            <button className="btn btn-success" onClick={onPurchase}>
              Pay with Paypal
            </button>
          </div>
        ) : (
          <h3></h3>
        )}
      </div>
    ) : (
      <Link></Link>
    );
  };

  const onPurchase = () => {
    setInfo({ loading: true });

    let nonce;

    let getNonce = info.instance.requestPaymentMethod().then((data) => {
      nonce = data.nonce;
      const paymentData = {
        paymentMethodNonce: nonce,
        amount: getFinalAmount(),
      };
      processPayment(userId, userToken, paymentData)
        .then((response) => {
          const { success } = response;
          // console.log("SUCCESS: ", success);

          if (response.error) {
            setInfo({
              ...info,
              error: response.error,
              loading: false,
            });
          } else {
            // console.log(response);
            if (success) {
              // console.log("PAYMENT SUCCESS");

              const orderData = {
                products: products,
                transaction_id: response.transaction.id,
                amount: response.transaction.amount,
              };

              // console.log(orderData);

              createOrder(userId, userToken, orderData);
              // .then((data) => console.log(data))
              // .catch((err) => console.log(err));

              cartEmpty(() => {
                // console.log("Cart Empty!");
              });

              setInfo({
                ...info,
                successPayment: response.success,
                loading: false,
              });

              setReload(!reload);
            } else {
              setInfo({
                loading: false,
                successPayment: false,
                error: "Transaction failed! Try Again!",
              });
            }
          }
        })
        .catch((err) => {
          setInfo({ loading: false, successPayment: false, error: err });
          console.log("PAYMENT FAILED");
        });
    });
  };

  const successMessage = () => {
    return (
      <div className="row">
        <div className="col-md-6 offset-sm-3 text-center mt-4">
          <div
            className="alert alert-success"
            style={{ display: successPayment ? "" : "none" }}
          >
            Payment Successful!
          </div>
        </div>
      </div>
    );
  };

  const errorMessage = () => {
    return (
      <div className="row">
        <div className="col-md-6 offset-sm-3 text-center mt-4">
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

  const showBraintreeButton = () => {
    return isAuthenticated() ? (
      <button className="btn btn-success" onClick={showbtndropIn}>
        Pay with Paypal
      </button>
    ) : (
      //   <Link to="/signin">
      //     <button className="btn btn-warning">Signin</button>
      //   </Link>
      <Link></Link>
    );
  };

  return (
    <div>
      {successMessage()}
      {errorMessage()}
      {showbtndropIn()}
    </div>
  );
};

export default BraintreeCheckout;
