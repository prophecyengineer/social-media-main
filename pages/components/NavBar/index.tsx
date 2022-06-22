import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import Link from "next/link";
import { useRouter } from "next/router";
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
} from "antd-mobile";
import {
  LocationOutline,
  GlobalOutline,
  BellOutline,
  UserCircleOutline,
} from "antd-mobile-icons";

const Bottom: FC = () => {
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
      key: "/profile",
      title: "profile",
      icon: <UserCircleOutline />,
    },
    {
      key: "/notification",
      title: "notifications",
      icon: <BellOutline />,
      badge: "99",
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
  const session = useSession();

  const name = session.data?.user?.name;
  const image = session.data?.user?.image;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const left = (
    <>
      <Grid columns={2}>
        <Avatar style={{ "--size": "32px" }} src={image}></Avatar>
      </Grid>
    </>
  );

  const right = (
    <div style={{ fontSize: 24 }}>
      <Space style={{ "--gap": "16px" }}>
        <FrownOutline onClick={signOut} />
        <MoreOutline />
      </Space>
    </div>
  );

  const back = () =>
    Toast.show({
      content: "Go back?",
      duration: 1000,
    });

  return (
    <>
      {mounted && (
        <div>
          <Desktop>
            <h1>is a desktop</h1>
          </Desktop>
        </div>
      )}

      <Card className={styles.top}>
        <NavBar right={right} back={left} backArrow={false}>
          audit.law
        </NavBar>
      </Card>

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
