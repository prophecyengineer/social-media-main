import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import Link from "next/link";
import {
  Layout,
  Nav,
  Button,
  Breadcrumb,
  Skeleton,
  Avatar,
  Col,
  Select,
  Dropdown,
  Row,
  Card,
  ButtonGroup,
} from "@douyinfe/semi-ui";
import { useRouter } from "next/router";

import {
  IconSemiLogo,
  IconHelpCircle,
  IconUserCircle,
  IconHome,
  IconGlobe,
  IconWrench,
  IconBell,
  IconSetting,
  IconHistogram,
} from "@douyinfe/semi-icons";
import styles from "./Navbar.module.css";
import { signOut, useSession } from "next-auth/react";

const { Header, Footer, Sider, Content } = Layout;

export default function NavBar(props) {
  const session = useSession();

  const name = session.data?.user?.name;
  const image = session.data?.user?.image;
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {mounted && (
        <div>
          <Desktop>
            <h1>is a desktop</h1>
          </Desktop>
        </div>
      )}
      <Layout>
        <Nav
          className={styles.Nav}
          mode={"horizontal"}
          onSelect={(key) => console.log(key)}
          header={{
            logo: (
              <img src="https://sf6-cdn-tos.douyinstatic.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/webcast_logo.svg" />
            ),
            text: "audit.law",
          }}
          footer={
            <>
              <Dropdown
                position="bottomRight"
                render={
                  <Dropdown.Menu>
                    <Dropdown.Item>
                      <Button onClick={signOut}>Sign out</Button>
                    </Dropdown.Item>
                  </Dropdown.Menu>
                }
              >
                <span>{name}</span>
                <Avatar
                  size="small"
                  color="light-blue"
                  style={{ margin: 4, marginLeft: 6 }}
                  src={image}
                ></Avatar>
              </Dropdown>
            </>
          }
        />
        {props.children}
        <Layout className={styles.navbar}>
          <ButtonGroup
            className="thumbButton"
            size="large"
            aria-label="Operate button group"
          >
            <Link href="/home">
              <Button size="large">
                <IconHome size="large" />
              </Button>
            </Link>
            <Link href="/explore">
              <Button size="large">
                <IconGlobe size="large" />
              </Button>
            </Link>

            <Link href="/profile">
              <Button size="large">
                <IconUserCircle size="large" />
              </Button>
            </Link>
            <Link href="/notification">
              <Button size="large">
                <IconBell size="large" />
              </Button>
            </Link>
            <Link href="/">
              <Button size="large">
                <IconWrench size="large" />
              </Button>
            </Link>
          </ButtonGroup>
        </Layout>
      </Layout>
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
