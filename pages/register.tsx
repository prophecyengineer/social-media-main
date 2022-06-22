import * as React from "react";
import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import {
  Form,
  Input,
  Button,
  Dialog,
  Space,
  Card,
  Grid,
  Divider,
} from "antd-mobile";
const axios = require("axios").default;

export default function Register(props) {
  const router = useRouter();

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleNameChange = (value) => {
    setName(value);
  };
  const handleUsernameChange = (value) => {
    setUsername(value);
  };
  const handleEmailChange = (value) => {
    setEmail(value);
  };
  const handlePasswordChange = (value) => {
    setPassword(value);
  };

  const onFinish = async (values) => {
    // const data = {
    //   name: name,
    //   username: username,
    //   email: email,
    //   password: password,
    // };

    await axios.post("/api/register", values);
    signIn("credentials", {
      username,
      password,
      callbackUrl: `${window.location.origin}/home`,
      redirect: false,
    })
      .then(function (result) {
        router.push(result.url);
      })
      .catch((err) => {
        alert("Failed to register: " + err.toString());
      });
  };

  return (
    <>
      <Card>
        <Form
          name="form"
          onFinish={onFinish}
          footer={
            <Button block type="submit" color="primary" size="large">
              Submit
            </Button>
          }
        >
          <Form.Header>Register</Form.Header>

          <Form.Item
            rules={[{ required: true }]}
            name="name"
            label="name"
            help="please type your name : John Doe "
          >
            <Input
              type="text"
              value={name}
              onChange={handleNameChange}
              placeholder="name"
            />
          </Form.Item>
          <Form.Item
            rules={[{ required: true }]}
            name="username"
            label="username"
            help="please type "
          >
            <Input
              type="text"
              value={username}
              onChange={handleUsernameChange}
              placeholder="username"
            />
          </Form.Item>
          <Form.Item
            rules={[{ required: true }]}
            name="email"
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
            name="password"
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

        <Divider />
      </Card>
    </>
  );
}
