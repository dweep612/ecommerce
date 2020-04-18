import React from "react";
import Base from "./Base";
import "../style.css";

const Home = () => {
  return (
    <Base title="Home Page" description="A home page for products">
      <div className="row text-center">
        <div className="col-4">
          <button className="btn btn-success">Test</button>
        </div>
        <div className="col-4">
          <button className="btn btn-success">Test</button>
        </div>
        <div className="col-4">
          <button className="btn btn-success">Test</button>
        </div>
      </div>
    </Base>
  );
};

export default Home;
