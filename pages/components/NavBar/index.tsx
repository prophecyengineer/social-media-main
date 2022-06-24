import { useEffect, useState, useRef } from "react";
import { useMediaQuery } from "react-responsive";
import Link from "next/link";
import router, { useRouter } from "next/router";
import AuditLogo from "../../../styles/logo.svg";
import logoSVG from "../../../styles/logo.svg";
import Image from "next/image";
import {
  AppOutline,
  MessageOutline,
  UnorderedListOutline,
  UserOutline,
  MoreOutline,
  FrownOutline,
} from "antd-mobile-icons";
import styles from "./Navbar.module.css";
import { signOut, useSession } from "next-auth/react";
import {
  NavBar,
  TabBar,
  Toast,
  Space,
  Avatar,
  Grid,
  Button,
  Card,
  Tabs,
  Dropdown,
  ActionSheet,
} from "antd-mobile";
import {
  LocationOutline,
  GlobalOutline,
  BellOutline,
  UserCircleOutline,
} from "antd-mobile-icons";
import type {
  Action,
  ActionSheetShowHandler,
} from "antd-mobile/es/components/action-sheet";

const Bottom = () => {
  const router = useRouter();

  const { pathname } = location;
  const setRouteActive = (value: string) => {
    router.push(value);
  };
  const tabs = [
    {
      key: "/home",
      title: "home",
      icon: <LocationOutline />,
    },
    {
      key: "/explore",
      title: "explore",
      icon: <GlobalOutline />,
    },

    {
      key: "/",
      title: "post",
      icon: <AppOutline />,
    },

    {
      key: "/notification",
      title: "notifications",
      icon: <BellOutline />,
      badge: "99",
    },
    {
      key: "/profile",
      title: "profile",
      icon: <UserCircleOutline />,
    },
  ];
  return (
    <Card>
      <TabBar activeKey={pathname} onChange={(value) => setRouteActive(value)}>
        {tabs.map((item) => (
          <TabBar.Item key={item.key} icon={item.icon} title={item.title} />
        ))}
      </TabBar>
    </Card>
  );
};

export default function Nav(props) {
  const stream = require("getstream");
  const session = useSession();
  const name = session.data?.user?.name;
  const image = session.data?.user?.image;
  const userToken = session.data?.user?.userToken;
  const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY as string;
  const appId = process.env.NEXT_PUBLIC_STREAM_APP_ID as string;
  const client = stream.connect(apiKey, userToken, appId);

  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState([]);

  useEffect(() => {
    setMounted(true);
    getstreamUser();
  }, []);

  //run this once and save as object
  async function getstreamUser(userName = "peach") {
    const { full } = await client.user(userName).get();
    setUser(full);
  }

  // console.log("user here", user?.id);
  // console.log("user name", user?.data?.name);
  const currentUserName = user?.data?.name;
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

  const left = (
    <>
      <Avatar onClick={() => setVisible(true)} src={user?.data?.image}></Avatar>
      {/* <h5>{user?.data?.name}</h5> */}
      <ActionSheet
        visible={visible}
        actions={actions}
        onClose={() => setVisible(false)}
      />
    </>
  );

  //button to open slider

  const right = (
    <div style={{ fontSize: 24 }}>
      <Space style={{ "--gap": "16px" }}></Space>
    </div>
  );

  return (
    <>
      {mounted && (
        <div>
          <Desktop>
            <h1>is a desktop</h1>
          </Desktop>
        </div>
      )}

      <NavBar
        className={styles.top}
        right={right}
        back={left}
        backArrow={false}
      >
        audit.law
      </NavBar>

      {props.children}
      <div className={styles.thumb}>
        <Bottom />
      </div>
    </>
  );
}

function Desktop({ children }) {
  const useDesktopMediaQuery = () =>
    useMediaQuery({
      minWidth: 869,
    });

  return <>{useDesktopMediaQuery() ? children : null}</>;
}
