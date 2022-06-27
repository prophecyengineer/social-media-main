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
import { prisma, PrismaClient } from "@prisma/client";
const axios = require("axios").default;

export default function Register(props) {
  const router = useRouter();

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [usernameChecker, setUsernameChecker] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleNameChange = (value) => {
    setName(value);
  };
  const handleUsernameChange = (value) => {
    setUsername(value);
  };

  const checkExisting = async () => {
    const isTrue = await axios.post("/api/checkExisting", {
      query: { username },
    });

    if (isTrue?.data?.result !== null) {
      console.log("i found a user");

      setUsernameChecker("this username in use");
      // do login stuff
    } else {
      setUsernameChecker("this username is free to use");
    }
    console.log(isTrue?.data?.result);
  };

  const handleEmailChange = (value) => {
    setEmail(value);
  };
  const handlePasswordChange = (value) => {
    setPassword(value);
  };

  const onFinish = async (values) => {
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
          onFinish={checkExisting}
          footer={
            <Button block type="submit" color="primary" size="large">
              Check Availability
            </Button>
          }
        >
          <Form.Item
            extra={
              <Button
                block
                type="submit"
                onClick={checkExisting}
                color="primary"
                size="small"
              >
                Check Availability
              </Button>
            }
          >
            <Input
              type="text"
              name="username"
              value={username}
              onChange={handleUsernameChange}
              placeholder="username"
            />
          </Form.Item>
          <p>{usernameChecker}</p>
        </Form>
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
            label="username"
            help="please type "
          >
            <Input
              type="text"
              name="username"
              value={username}
              onChange={handleUsernameChange}
              placeholder="username"
            />
          </Form.Item>
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

        <Divider />
      </Card>
    </>
  );
}
