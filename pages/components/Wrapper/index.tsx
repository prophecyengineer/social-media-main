import * as React from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import Layout from "../Layout";
import { UserProvider } from "../../../context/user";
import { AutoCenter, Space } from "antd-mobile";

export default function Wrapper(props) {
  const session = useSession();
  const router = useRouter();

  if (
    session === null ||
    router.pathname === "/" ||
    router.pathname === "/signin" ||
    router.pathname === "/signup" ||
    router.pathname === "/signup/Username" ||
    router.pathname === "/signup/Profile"
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
        <AutoCenter>
          <Space direction="vertical">
            <h1>You are not authenticated</h1>
            <h2>
              <Link href="/">Back to safety</Link>
            </h2>
          </Space>
        </AutoCenter>
      </>
    );
  }
}
