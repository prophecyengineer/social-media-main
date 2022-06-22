import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Link from "next/link";
import { useRouter } from "next/router";
import { signIn, useSession } from "next-auth/react";
import React, { useState, useEffect, useRef } from "react";
import { Form, Input, Button, Dialog } from "antd-mobile";
import { redirect } from "next/dist/server/api-utils";

const Home: NextPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const router = useRouter();
  const session = useSession();

  if (session !== null && session?.status === "authenticated") {
    router.push("/home");
  }

  const handleUsernameChange = (value) => {
    setUsername(value);
  };
  const handlePasswordChange = (value) => {
    setPassword(value);
  };

  const onFinish = (values: any) => {
    signIn("credentials", {
      username,
      password,
      callbackUrl: `${window.location.origin}/home`,
      redirect: false,
    }).then(function (result) {
      if (result.error !== null) {
        if (result.status === 401) {
          setLoginError(
            "Your username/password combination was incorrect. Please try again"
          );
        } else {
          setLoginError(result.error);
        }
      } else {
        router.push(result.url);
      }
    });
    Dialog.alert({
      content: <pre>{JSON.stringify(values, null, 2)}</pre>,
    });
  };

  // const onFinish = (values: any) => {
  //   Dialog.alert({
  //     content: <pre>{JSON.stringify(values, null)}</pre>,
  //   });
  // };
  return (
    <>
      <Form
        name="form"
        onFinish={onFinish}
        footer={
          <Button block type="submit" color="primary" size="large">
            Submit
          </Button>
        }
      >
        <Form.Header>Sign In</Form.Header>

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
      <Link href="/register">New here? Register</Link>
    </>
  );
};

export default Home;
