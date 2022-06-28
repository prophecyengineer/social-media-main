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

  const handleEmailChange = (value) => {
    setEmail(value);
  };
  const handlePasswordChange = (value) => {
    setPassword(value);
  };

  const onFinish = async () => {
    const data = {
      name: name,
      username: username,
      email: email,
      password: password,
    };
    console.log("values", data);
    await axios.post("/api/register", data);
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
          // extra={
          //   <a type="submit" onClick={checkExisting} color="primary">
          //     Check Availability
          //   </a>
          // }
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
      {/* <Card>
        <Steps current={step}>
          <Step title="1" description="username" />

          <Step title="2" description="account " />
          <Step title="3" description="profile" />
        </Steps>
        <Space direction="vertical" block>
          <Form
            name="form"
            onFinish={onFinish}
            footer={
              <Button block type="submit" color="primary" size="large">
                Submit
              </Button>
            }
          >
            <Swiper allowTouchMove={false} ref={ref}>
              <Swiper.Item key={1}>
                <Form.Header>Register</Form.Header>
                <Form.Item
                  extra={
                    <Popover
                      content={usernameChecker}
                      trigger="click"
                      placement="top"
                      defaultVisible
                    >
                      <Button onClick={checkExisting}>
                        {" "}
                        Check Availability{" "}
                      </Button>
                    </Popover>
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
              </Swiper.Item>
              <Swiper.Item key={2}>
                <div
                  onClick={() => {
                    Toast.show(`你点击了卡片 `);
                  }}
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
                </div>
              </Swiper.Item>
              <Swiper.Item key={3}>
                <div
                  onClick={() => {
                    Toast.show(`你点击了卡片 `);
                  }}
                >
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
                </div>
              </Swiper.Item>
            </Swiper>
          </Form>
          <Space>
            <Button
              onClick={() => {
                ref.current?.swipePrev();
                setStep(step - 1);
              }}
            >
              back
            </Button>
            <Button
              onClick={() => {
                ref.current?.swipeNext();
                setStep(step + 1);
              }}
            >
              Next
            </Button>
          </Space>
        </Space>

        <Divider />
      </Card> */}
    </>
  );
}
