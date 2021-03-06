import React, { useState } from "react";
import Base from "../core/Base";
import { isAuthenticated } from "../auth/helper/auth";
import { Link } from "react-router-dom";
import { createCategory } from "./helper/adminapicall";

const CreateCategory = () => {
  const [name, setName] = useState("");
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [redirect, setRedirect] = useState(false);

  const { user, token } = isAuthenticated();

  const goBack = () => (
    // <div className="mt-5">
    <Link className="btn btn-md btn-info mb-3" to="/admin/dashboard">
      Admin Dashboard
    </Link>
    // </div>
  );

  const handleChange = (event) => {
    setError("");
    setName(event.target.value);
  };

  const onSubmit = (event) => {
    event.preventDefault();
    setError("");
    setSuccess(false);

    createCategory(user._id, token, { name }).then((data) => {
      if (data.error) {
        setError(true);
      } else {
        setError("");
        setSuccess(true);
        setName("");
        setRedirect(true);
      }
    });
  };

  const performRedirect = () => {
    if (redirect) {
      setTimeout(() => {
        window.location = "/admin/dashboard";
      }, 1000);
    }
  };

  const successMessage = () => {
    if (success) {
      return <h4 className="text-success">Category Created Successfully</h4>;
    }
  };

  const errorMessage = () => {
    if (error) {
      return <h4 className="text-success">Failed to Create Category</h4>;
    }
  };

  const categoryForm = () => (
    <form>
      <div className="form-group">
        <p className="lead">Enter the category</p>
        <input
          type="text"
          className="form-control my-3"
          onChange={handleChange}
          value={name}
          autoFocus
          required
          placeholder="For Ex. Summer"
        />
        <button onClick={onSubmit} className="btn btn-outline-success">
          Create Category
        </button>
      </div>
    </form>
  );

  return (
    <Base
      title="Create Category"
      description="Add new category for products"
      className="container bg-success p-4 rounded"
    >
      {goBack()}
      <div className="row bg-dark text-white rounded">
        <div className="col-md-8 offset-md-2">
          {successMessage()}
          {errorMessage()}
          {performRedirect()}
          {categoryForm()}
        </div>
      </div>
    </Base>
  );
};

export default CreateCategory;
