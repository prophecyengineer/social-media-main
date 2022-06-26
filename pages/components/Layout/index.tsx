import { useMediaQuery } from "react-responsive";
import router, { useRouter } from "next/router";
import { AppOutline } from "antd-mobile-icons";
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
  FloatingBubble,
  Popup,
} from "antd-mobile";
import {
  LocationOutline,
  GlobalOutline,
  BellOutline,
  UserCircleOutline,
  AddCircleOutline,
} from "antd-mobile-icons";
import type {
  Action,
  ActionSheetShowHandler,
} from "antd-mobile/es/components/action-sheet";
import { useState, useEffect } from "react";
import MakePost from "../MakePost";

export default function Layout(props) {
  const session = useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const stream = require("getstream");
  const userToken = session.data?.user?.userToken;
  const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY as string;
  const appId = process.env.NEXT_PUBLIC_STREAM_APP_ID as string;
  // const client = stream.connect(apiKey, userToken, appId);

  const MakePostBubble = () => {
    const [visible, setVisible] = useState(false);
    const onClick = () => {
      setVisible(true);
    };
    return (
      <div>
        <FloatingBubble
          style={{
            "--initial-position-bottom": "94px",
            "--initial-position-right": "24px",
            "--edge-distance": "24px",
          }}
          onClick={onClick}
        >
          <AddCircleOutline font-size={72} />
        </FloatingBubble>
        <Popup
          visible={visible}
          onMaskClick={() => {
            setVisible(false);
          }}
          bodyStyle={{ height: "60vh" }}
        >
          <MakePost />
        </Popup>
      </div>
    );
  };

  const { pathname } = location;
  const setRouteActive = (value: string) => {
    router.push(value);
  };

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

  const left = (
    <>
      <Avatar onClick={() => setVisible(true)} src=""></Avatar>

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
    <div>
      {mounted && (
        <div>
          <Desktop>
            <h1>is a desktop</h1>
          </Desktop>
        </div>
      )}

      <MakePostBubble />
      <NavBar
        className={styles.top}
        right={right}
        back={left}
        backArrow={false}
      ></NavBar>

      {props.children}
      <div className={styles.thumb}>
        <Card>
          <TabBar
            activeKey={pathname}
            onChange={(value) => setRouteActive(value)}
          >
            <TabBar.Item key="/home" icon={<LocationOutline />} title="home" />
            <TabBar.Item
              key="/explore"
              icon={<GlobalOutline />}
              title="explore"
            />
            <TabBar.Item
              key="/notification"
              icon={<BellOutline />}
              title="notifications"
              badge={99}
            />
            <TabBar.Item
              key="/profile"
              icon={<UserCircleOutline />}
              title="profile"
            />
          </TabBar>
        </Card>
      </div>
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
