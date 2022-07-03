/// where we arrange steps of forms

import { NextPage } from "next";
import Username from "./Username";
import {
  Modal,
  Button,
  NavBar,
  Space,
  AutoCenter,
  Form,
  Input,
} from "antd-mobile";
import styles from "../../styles/Home.module.css";
import router from "next/router";
import { useState } from "react";
import { signIn } from "next-auth/react";
const axios = require("axios").default;

//here we take the username, auth the user and send them off to next steps to building their profile, adding the info to db as we go.

const Signup: NextPage = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleEmailChange = (value) => {
    setEmail(value);
  };
  const handlePasswordChange = (value) => {
    setPassword(value);
  };

  const onFinish = async () => {
    // const onFinish = async () => {
    //   const data = {
    //     name: name,
    //     bio: bio,
    //     image: image,
    //     username: username,
    //     email: email,
    //     password: password,
    //   };

    const data = {
      email: email,
      password: password,
    };

    function createItem() {
      localStorage.setItem("email", data.email);
    }
    createItem();

    await axios.post("/api/signup-email", data);
    console.log("data", data);

    signIn("credentials", {
      email,
      password,
      callbackUrl: `${window.location.origin}/signup/Username`,
      redirect: false,
    })
      .then(function (result) {
        router.push(result.url);
      })
      .catch((err) => {
        alert("Failed to register: " + err.toString());
      });
  };

  const back = () => {
    router.push("/");
  };
  return (
    <>
      <NavBar onBack={back}></NavBar>
      <h2 className={styles.title}>sign up with...</h2>
      <div className="spacer-medium"></div>
      <Form
        name="form"
        onFinish={onFinish}
        footer={
          <>
            <div />
            <div className="spacer-small" />
            <Button block type="submit" color="primary" size="large">
              sumbit
            </Button>
          </>
        }
      >
        <Form.Item
          rules={[{ required: true }]}
          label="email"
          help="please type your email address "
        >
          <Input
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="email"
          />
        </Form.Item>
        <Form.Item
          rules={[{ required: true }]}
          label="password"
          help="please type "
        >
          <Input
            type="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="password"
          />
        </Form.Item>
      </Form>
    </>
  );
};

export default Signup;
