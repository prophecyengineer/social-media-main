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
} from "antd-mobile";
import {
  LocationOutline,
  GlobalOutline,
  BellOutline,
  UserCircleOutline,
} from "antd-mobile-icons";

export default function Nav(props) {
  const session = useSession();

  const name = session.data?.user?.name;
  const image = session.data?.user?.image;
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

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

      <div className={styles.top}>
        <NavBar right={right} back={left} backArrow={false}>
          audit.law
        </NavBar>
      </div>

      {props.children}

      <TabBar className={styles.thumb} aria-label="Operate button group">
        <TabBar.Item
          key="/home"
          title="home"
          icon={<LocationOutline />}
          badge={5}
        />

        <TabBar.Item key="/explore" title="explore" icon={<GlobalOutline />} />
        <TabBar.Item
          key="/profile"
          title="profile"
          icon={<UserCircleOutline />}
        />
        <TabBar.Item
          key="/notification"
          title="notification"
          icon={<BellOutline />}
          badge={99}
        />
        <Link href="/explore">
          <Button>Explore</Button>
        </Link>

        <Link href="/profile">
          <Button>Profile</Button>
        </Link>
        <Link href="/notification">
          <Button>Notification</Button>
        </Link>
        <Link href="/">
          <Button>Setting</Button>
        </Link>
      </TabBar>
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
