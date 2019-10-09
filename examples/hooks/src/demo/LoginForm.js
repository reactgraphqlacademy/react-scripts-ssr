import React from "react";
import { useForm } from "./hooks";

function LoginForm({
  initialValues = {
    password: "",
    username: ""
  }
}) {
  const form = useForm({
    initialValues: initialValues,
    onSubmit: async values => {
      alert(JSON.stringify(values, null, 2));
    },
    validate: values => {
      let errors = {};
      if (!values.password) {
        errors.password = "Password is required";
      }
      if (!values.username) {
        errors.username = "Username is required";
      }
      return errors;
    }
  });

  const { handleSubmit, getFieldProps, errors = {} } = form;
  return (
    <form onSubmit={handleSubmit}>
      <label>
        Username:
        <br />
        <input type="text" {...getFieldProps("username")} />
        {errors.username && (
          <div style={{ color: "red" }}>{errors.username}</div>
        )}
      </label>
      <br />
      <label>
        Password:
        <br />
        <input type="text" {...getFieldProps("password")} />
        {errors.password && (
          <div style={{ color: "red" }}>{errors.password}</div>
        )}
      </label>
      <br />
      <button type="submit">Submit</button>
    </form>
  );
}

export default LoginForm;
