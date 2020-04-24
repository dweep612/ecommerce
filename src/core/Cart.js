import React, { useState, useEffect } from "react";
import Base from "./Base";
import Card from "./Card";
import { loadCart } from "./helper/cartHelper";
import StripeCheckout from "../paymentgateways/StripeCheckout";
import BraintreeCheckout from "../paymentgateways/BraintreeCheckout";

const Cart = () => {
  const [products, setProducts] = useState([]);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    setProducts(loadCart());
  }, [reload]);

  const loadAllProducts = () => {
    return (
      <div>
        {products.map((product, index) => (
          <Card
            key={index}
            product={product}
            addToCart={false}
            removeFromCart={true}
            setReload={setReload}
            reload={reload}
          />
        ))}
      </div>
    );
  };

  return (
    <Base title="Your Cart" description="Ready to checkout ?">
      <div className="row text-center">
        <div className="col-6">{loadAllProducts()}</div>
        <div className="col-6">
          <StripeCheckout
            products={products}
            setReload={setReload}
            reload={reload}
          />
          <BraintreeCheckout
            products={products}
            setReload={setReload}
            reload={reload}
          />
        </div>
      </div>
    </Base>
  );
};

export default Cart;
