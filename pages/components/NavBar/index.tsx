import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import Link from "next/link";
import { useRouter } from "next/router";
import AuditLogo from "../../../styles/logo.svg";

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
      <svg
        version="1.0"
        xmlns="http://www.w3.org/2000/svg"
        width="50.000000pt"
        height="50.000000pt"
        viewBox="0 0 486.000000 513.000000"
        preserveAspectRatio="xMidYMid meet"
      >
        <metadata>
          Created by potrace 1.16, written by Peter Selinger 2001-2019
        </metadata>
        <g
          transform="translate(0.000000,513.000000) scale(0.100000,-0.100000)"
          fill="#4e4e4e"
          stroke="none"
        >
          <path
            d="M2080 4185 l0 -44 -517 -3 c-463 -3 -521 -5 -549 -20 -47 -26 -93
-79 -104 -120 -7 -24 -10 -268 -8 -677 l3 -639 30 -43 c17 -23 48 -52 70 -63
39 -20 55 -21 558 -24 l517 -3 0 -44 0 -45 140 0 140 0 0 -645 0 -645 70 0 70
0 0 645 0 645 140 0 140 0 0 45 0 44 518 3 c497 3 518 4 556 23 21 12 53 40
70 64 l31 43 3 640 c2 422 -1 652 -8 678 -11 42 -54 91 -104 118 -32 18 -196
22 -843 22 l-223 0 0 45 0 45 -350 0 -350 0 0 -45z m700 -80 l0 -35 -350 0
-350 0 0 35 0 35 350 0 350 0 0 -35z m780 -760 l0 -665 -1130 0 c-897 0 -1130
3 -1131 13 -1 6 -1 46 -1 87 0 41 1 335 1 653 l1 577 1130 0 1130 0 0 -665z
m225 0 c0 -163 -1 -170 -20 -170 -19 0 -20 8 -23 160 -1 87 0 165 3 173 3 7
13 12 22 10 16 -3 18 -19 18 -173z m-2627 89 c25 -17 52 -64 52 -89 0 -57 -55
-107 -116 -107 -102 0 -143 141 -56 195 34 21 91 22 120 1z m1622 -849 l0 -35
-350 0 -350 0 0 35 0 35 350 0 350 0 0 -35z"
          />
        </g>
      </svg>
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
