import styles from "./Layout.module.css";
import { FloatingBubble, TabBar, Popup, AutoCenter } from "antd-mobile";
import {
  LocationOutline,
  GlobalOutline,
  BellOutline,
  UserCircleOutline,
  AddCircleOutline,
  MessageOutline,
  SearchOutline,
} from "antd-mobile-icons";
import { useRouter } from "next/router";
import MakePost from "../MakePost";
import { useState } from "react";

const ThumbMenu = () => {
  const router = useRouter();
  const { pathname } = location;
  const setRouteActive = (value: string) => {
    router.push(value);
  };

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
            "--initial-position-right": "20px",
            "--edge-distance": "30px",
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

  return (
    <>
      <MakePostBubble />

      <AutoCenter>
        <div className={styles.thumbar}>
          <TabBar
            className={styles.thumb}
            activeKey={pathname}
            onChange={(value) => setRouteActive(value)}
          >
            <TabBar.Item key="/home" icon={<LocationOutline />} title="home" />
            <TabBar.Item
              key="/explore"
              icon={<SearchOutline />}
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
        </div>
      </AutoCenter>
    </>
  );
};

export default ThumbMenu;
