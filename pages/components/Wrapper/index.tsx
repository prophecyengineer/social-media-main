import * as React from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import Layout from "../Layout";
import { UserProvider } from "../../../context/user";

export default function Wrapper(props) {
  const session = useSession();
  const router = useRouter();

  if (
    session === null ||
    router.pathname === "/" ||
    router.pathname === "/signin" ||
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
        <UserProvider>
          <Layout>{props.children}</Layout>
        </UserProvider>
      </>
    );
  }
  if (session === null)
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
