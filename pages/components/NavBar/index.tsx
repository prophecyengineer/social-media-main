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
  Row,
  Card,
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

const { Header, Footer, Sider, Content } = Layout;

export default function NavBar() {
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
      <Layout className={styles.navbar}>
        <Card color="gradient" bordered size="lg">
          <Link href="/home">
            <Button>
              <IconHome />
            </Button>
          </Link>
          <Link href="/explore">
            <Button>
              <IconGlobe />{" "}
            </Button>
          </Link>

          <Link href="/profile">
            <Button>
              <IconUserCircle />{" "}
            </Button>
          </Link>
          <Link href="/notification">
            <Button>
              <IconBell />{" "}
            </Button>
          </Link>
          <Link href="/">
            <Button>
              <IconWrench />{" "}
            </Button>
          </Link>
        </Card>
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
