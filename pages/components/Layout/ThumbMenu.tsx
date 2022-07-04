import styles from "./Layout.module.css";
import {
  FloatingBubble,
  TabBar,
  Popup,
  AutoCenter,
  JumboTabs,
} from "antd-mobile";
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
import { Avatar } from "react-activity-feed";
import { useUserState } from "../../../context/user";

const ThumbMenu = () => {
  const { user } = useUserState();

  const router = useRouter();
  const { pathname } = location;
  const setRouteActive = (value: string) => {
    router.push(value);
  };

  const AvatarPic = () => {
    return <Avatar src="http://placekitten.com/200/300"></Avatar>;
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
            "--initial-position-right": "15px",
            "--edge-distance": "30px",
          }}
          onClick={onClick}
        >
          <AddCircleOutline fontSize={72} />
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
            badge={9}
          />

          <TabBar.Item
            key="/profile"
            icon={<UserCircleOutline />}
            title="profile"
          />
        </TabBar>
      </div>
    </>
  );
};

export default ThumbMenu;
