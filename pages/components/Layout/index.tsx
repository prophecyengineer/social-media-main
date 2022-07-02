import ThumbMenu from "./ThumbMenu";
import { useMediaQuery } from "react-responsive";
import router, { useRouter } from "next/router";
import styles from "./Layout.module.css";
import { signOut, useSession } from "next-auth/react";
import {
  NavBar,
  TabBar,
  Toast,
  Space,
  Avatar,
  Grid,
  ActionSheet,
  FloatingBubble,
  Button,
  Popup,
  AutoCenter,
} from "antd-mobile";
import {
  AddCircleOutline,
  SearchOutline,
  MessageOutline,
} from "antd-mobile-icons";
import type {
  Action,
  ActionSheetShowHandler,
} from "antd-mobile/es/components/action-sheet";
import { useState, useEffect } from "react";
import Head from "next/head";

export default function Layout(props) {
  const session = useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const stream = require("getstream");
  const userToken = session.data?.user?.userToken;
  const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY as string;
  const appId = process.env.NEXT_PUBLIC_STREAM_APP_ID as string;
  // const client = stream.connect(apiKey, userToken, appId);
  useEffect(() => {
    setMounted(true);
  }, []);

  const actions: Action[] = [
    {
      text: "Profile",
      key: "/profile",
      onClick: () => {
        router.push("/profile");
      },
    },
    {
      text: "Sign Out",
      key: "signout",
      onClick: () => {
        signOut();
      },
    },
  ];
  const [visible, setVisible] = useState(false);

  //button to open slider

  const back = () =>
    Toast.show({
      content: "go back a page",
      duration: 1000,
    });
  const right = (
    <div style={{ fontSize: 24 }}>
      <Space style={{ "--gap": "16px" }}>
        {" "}
        <MessageOutline />
      </Space>
    </div>
  );

  return (
    <div>
      <Head>
        <title>My page title</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <script src="https://unpkg.com/input-knob"></script>
      </Head>
      {mounted && (
        <div>
          <Desktop>
            <h1>is a desktop</h1>
          </Desktop>
        </div>
      )}

      <NavBar right={right} onBack={back} className={styles.top}>
        <>
          <Button size="small" onClick={() => setVisible(true)} src="">
            {session?.data?.user?.username}
          </Button>

          <ActionSheet
            visible={visible}
            actions={actions}
            onClose={() => setVisible(false)}
          />
        </>
      </NavBar>

      {props.children}
      <ThumbMenu />
    </div>
  );
}

function Desktop({ children }) {
  const useDesktopMediaQuery = () =>
    useMediaQuery({
      minWidth: 869,
    });

  return <>{useDesktopMediaQuery() ? children : null}</>;
}
