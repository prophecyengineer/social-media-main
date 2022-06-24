import * as React from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import Nav from "../NavBar";
import { useState, useEffect } from "react";
const stream = require("getstream");

export default function Wrapper(props) {
  const session = useSession();
  const [user, setUser] = useState([]);
  const userToken = session.data?.user?.userToken;
  const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY as string;
  const appId = process.env.NEXT_PUBLIC_STREAM_APP_ID as string;
  const client = stream.connect(apiKey, userToken, appId);
  // console.log('session',session.data?.user?.username)
  const router = useRouter();

  useEffect(() => {
    getstreamUser();
  }, []);

  //run this once and save as object
  async function getstreamUser(userName = "peach") {
    const { full } = await client.user(userName).get();
    setUser(full);
  }

  console.log("user here", user.id);
  console.log("user name", user.data.name);

  // const currentUserUsername = user?.data?.name;

  if (
    session === null ||
    router.pathname === "/" ||
    router.pathname === "/register"
  ) {
    return <>{props.children}</>;
  }
  if (
    (session !== null && session?.status === "authenticated") ||
    router.pathname === "/"
  ) {
    return (
      <>
        <Nav>
          <h2>{user.data.name}</h2>
          {props.children}
        </Nav>
      </>
    );
  }
  if (session === null && session?.status !== "authenticated")
    router.pathname === "/home" ||
      router.pathname === "/profile" ||
      router.pathname === "/explore";
  {
    return (
      <>
        <h1>You are not authenticated</h1>

        <Link href="/">Back to Login</Link>
      </>
    );
  }
}
