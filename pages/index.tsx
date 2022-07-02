import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { signIn, useSession } from "next-auth/react";
import React, { useState, useEffect, useRef } from "react";
import styles from "../styles/Home.module.css";
import {
  Form,
  Input,
  Button,
  Dialog,
  NavBar,
  AutoCenter,
  Space,
} from "antd-mobile";
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
      <AutoCenter>
        <Space align="center" direction="vertical">
          <div className="spacer-large" />
          <h1 className={styles.title}>Bunch</h1>

          <div className="spacer-large"></div>
          <Link href="/signup">
            <Button
              className={styles.button}
              size="large"
              color="primary"
              block
            >
              Sign up
            </Button>
          </Link>
          <div className="spacer-small" />
          <Link href="/signin">
            <Button
              className={styles.button}
              size="large"
              color="success"
              block
            >
              Log in
            </Button>
          </Link>
        </Space>
      </AutoCenter>
    </>
  );
};

export default Home;
