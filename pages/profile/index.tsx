/* eslint-disable react/jsx-key */
import type { NextPage } from "next";
import styles from "./Profile.module.css";
import * as React from "react";
import { useSession } from "next-auth/react";
import {
  Modal,
  Button,
  Dialog,
  Grid,
  Input,
  Image,
  Space,
  Form,
  Card,
  Tabs,
  Avatar,
  List,
  Popup,
  Badge,
  TabBar,
  Divider,
  FloatingPanel,
} from "antd-mobile";
import "react-activity-feed/dist/index.css";
import {
  StreamApp,
  NotificationDropdown,
  FlatFeed,
  LikeButton,
  Activity,
  CommentList,
  CommentField,
  StatusUpdateForm,
  ActivityProps,
  UserBar,
} from "react-activity-feed";
import { useState, useEffect } from "react";
const axios = require("axios").default;

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY as string;
const appId = process.env.NEXT_PUBLIC_STREAM_APP_ID as string;
const Profile: NextPage = (props) => {
  const [followingListState, setFollowingListState] = useState([]);
  const [followerListState, setFollowerListState] = useState([]);
  const [readOnlyEditState, setReadOnlyEditState] = useState(true);
  const [viewPanelState, setViewPanelState] = useState("activityFeed");
  const [activitiesState, setActivitiesState] = useState([]);
  const [name, setName] = useState([]);
  const [bio, setBio] = useState([]);
  const [image, setImage] = useState([]);

  const session = useSession();
  const userName = session?.data?.user?.username;
  const handleNameChange = (value) => {
    setName(value);
  };

  const handleBioChange = (value) => {
    setBio(value);
  };

  // function to to change fields to be editable
  const editProfile = () => {
    setReadOnlyEditState(false);
  };

  // function to change state of save profile
  const saveProfile = () => {
    setReadOnlyEditState(true);
  };
  const onFinish = async (values: any, username: any) => {
    // const username = session?.data?.user?.username;

    // const username = username;
    const image = "https://picsum.photos/200/300";
    const data = {
      name: name,
      username: username,
      bio: bio,
      image: image,
    };

    // console.log("values from form", data);

    await axios.post("/api/userUpdateProfile", data);
    // signIn("credentials", {
    //   username,
    //   password,
    //   callbackUrl: `${window.location.origin}/home`,
    //   redirect: false,
    // })
  };

  // input change handler for the profile save form
  // const inputChange = (event) => {
  //   const { name, value } = event.target;
  //   props.setProfile({
  //     ...props.user,
  //     [name]: value,
  //   });
  // };

  // function for navigation butttons
  // const viewPanelChange = (panelName) => {
  //   setViewPanelState(panelName);
  //   if (panelName === "activityFeed") {
  //     Activities();
  //   }
  // };

  // function to call Cloudinary widget to upload profile photo
  // const beginUpload = (tag) => {
  //   const uploadOptions = {
  //     cloudName: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME,
  //     tags: [tag, "anImage"],
  //     uploadPreset: process.env.REACT_APP_CLOUDINARY_PRESET,
  //   };
  //   openUploadWidget(uploadOptions, (error, photos) => {
  //     if (!error) {
  //       if (photos.event === "success") {
  //         props.setProfile({
  //           ...props.profile,
  //           image: photos.info.public_id,
  //         });
  //       }
  //     } else {
  //       console.error(error);
  //     }
  //   });
  // };

  const stream = require("getstream");

  const userToken = session.data?.user?.userToken;
  const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY as string;
  const appId = process.env.NEXT_PUBLIC_STREAM_APP_ID as string;
  const client = stream.connect(apiKey, userToken, appId);

  // loading activities and following stats from getStream.io
  useEffect(() => {
    UserFollowing();
    UserFollowers();
  }, []);

  // const { user, setUser } = useUser();
  //when updating user, push data to getstream in userWrapper
  // form submit handler for saving the profile data

  // function pulling follower data from getStream.io
  const UserFollowers = () => {
    // people following the USER feed of currentUser
    const userOne = client.feed("user", client.userId);
    userOne
      .followers()
      .then((res) => {
        let List = [];
        for (let i = 0; i < res.results.length; i++) {
          const user = res.results[i].feed_id.slice(5);
          List.push(user);
        }
        setFollowerListState(List);
      })
      .catch((err) => {
        console.error(err);
      });
  };
  const UserFollowing = () => {
    //got the current user info from getstream
    // current user HOME feed follows these people
    const userOne = client.feed("home", client.userId);
    userOne
      .following()
      .then((res) => {
        let List = [];
        for (let i = 0; i < res.results.length; i++) {
          const user = res.results[i].target_id.slice(5);
          List.push(user);
        }

        setFollowingListState(List);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  // function to follow a user from the main activity in middle of page
  const followerUser = (userToFollow) => {
    const userOne = client.feed("home", client.userId);
    userOne.follow("user", userToFollow);
    UserFollowing();
    UserFollowers();
  };

  const unfollowerUser = (userToUnFollow) => {
    const userOne = client.feed("home", client.userId);
    userOne.unfollow("user", userToUnFollow, { keepHistory: true });
    UserFollowing();
    UserFollowers();
  };

  const FollowersComponent = () => {
    const [visible, setVisible] = useState(false);
    // const { setVisible, bindings } = useModal();
    return (
      <div>
        <>
          <Button
            onClick={() => {
              setVisible(true);
            }}
          >
            followers {followerListState.length}
          </Button>
          <Popup
            visible={visible}
            onMaskClick={() => {
              setVisible(false);
            }}
            bodyStyle={{
              borderTopLeftRadius: "8px",
              borderTopRightRadius: "8px",
              minHeight: "70vh",
            }}
          >
            {followerListState.slice(0, 10).map((follower) => (
              <Card>
                <UserBar
                  key={follower}
                  username={follower}
                  // onClickUser={console.log}
                  avatar="https://i.pinimg.com/originals/4f/a1/41/4fa141173a1b04470bb2f850bc5da13b.png"
                  timestamp="2022-04-19T07:44:11+00:00"
                  subtitle="a user following you"
                />
                {/* <Button size="xs" onClick={() => unfollowerUser(follower)}>
                  unfollow?
                </Button> */}
              </Card>
            ))}
          </Popup>
        </>
      </div>
    );
  };

  const tabs = [
    {
      key: "home",
      title: "首页",
      badge: Badge.dot,
    },
    {
      key: "todo",
      title: "我的待办",
      badge: "5",
    },
    {
      key: "message",
      title: "我的消息",
      // icon: (active: boolean) =>
      // active ? <MessageFill /> : <MessageOutline />,
      badge: "99+",
    },
    {
      key: "personalCenter",
      title: "个人中心",
    },
  ];
  const FollowingComponent = () => {
    const [visible, setVisible] = useState(false);
    // const { setVisible, bindings } = useModal();
    return (
      <div>
        <>
          <Button
            onClick={() => {
              setVisible(true);
            }}
          >
            following {followingListState.length}
          </Button>
          <Popup
            visible={visible}
            onMaskClick={() => {
              setVisible(false);
            }}
            bodyStyle={{
              borderTopLeftRadius: "8px",
              borderTopRightRadius: "8px",
              minHeight: "70vh",
            }}
          >
            {followingListState.slice(0, 10).map((following) => (
              <Card>
                <UserBar
                  key={following}
                  username={following}
                  // onClickUser={console.log}
                  avatar="https://i.pinimg.com/originals/4f/a1/41/4fa141173a1b04470bb2f850bc5da13b.png"
                  timestamp="2022-04-19T07:44:11+00:00"
                  subtitle="a user following you"
                />
                {/* <Button size="xs" onClick={() => unfollowerUser(follower)}>
                  unfollow?
                </Button> */}
              </Card>
            ))}
          </Popup>
        </>
      </div>
    );
  };

  return (
    <>
      <div className={styles.container}>
        <main className={styles.main}>
          {readOnlyEditState ? (
            <>
              <Space justify="center" block className={styles.heroWrapper} wrap>
                <Image
                  className={styles.hero}
                  src="https://picsum.photos/400/600"
                  fit="contain"
                  alt="hero"
                ></Image>
              </Space>
              <Space block justify="center">
                <Avatar
                  className={styles.avatar}
                  src="https://i.pinimg.com/736x/b6/87/2c/b6872cf7dc116ea08d58fd4e38990c01.jpg"
                  style={{ "--size": "120px" }}
                ></Avatar>
              </Space>

              <Space block justify="center" className={styles.title}>
                <h2>{session.data?.user?.name}</h2>
              </Space>
              <Space block justify="center">
                <p>{session.data?.user?.bio}</p>
              </Space>
              <TabBar>
                {tabs.map((item) => (
                  <TabBar.Item key={item.key} title={item.title} />
                ))}
              </TabBar>
              <Space block justify="center">
                <Grid columns={2}>
                  <Grid.Item>
                    <FollowingComponent />
                  </Grid.Item>
                  <Grid.Item>
                    <FollowersComponent />
                  </Grid.Item>
                </Grid>
              </Space>
              <Card
                headerStyle={{
                  color: "#1677ff",
                }}
                bodyClassName={styles.customBody}
              >
                <Space>{session.data?.user?.bio}</Space>{" "}
                {readOnlyEditState ? (
                  <Space>
                    <Button
                      color="primary"
                      onClick={() => {
                        editProfile();
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      color="primary"
                      onClick={() => {
                        editProfile();
                      }}
                    >
                      Subscribe
                    </Button>
                  </Space>
                ) : (
                  <Button block type="submit" color="primary" size="large">
                    update profile other buttoon
                  </Button>
                )}
              </Card>

              <Tabs defaultActiveKey="1">
                <Tabs.Tab title="Espresso" key="1">
                  1
                </Tabs.Tab>
                <Tabs.Tab title="Coffee Latte" key="2">
                  2
                </Tabs.Tab>
                <Tabs.Tab title="Cappuccino" key="3">
                  3
                </Tabs.Tab>
                <Tabs.Tab title="Americano" key="4">
                  4
                </Tabs.Tab>
                <Tabs.Tab title="Flat White" key="5">
                  5
                </Tabs.Tab>
                <Tabs.Tab title="Caramel Macchiato" key="6">
                  6
                </Tabs.Tab>
                <Tabs.Tab title="Cafe Mocha" key="7">
                  7
                </Tabs.Tab>
              </Tabs>
            </>
          ) : (
            <Form
              name="form"
              onFinish={onFinish}
              footer={
                <Button block type="submit" color="primary" size="large">
                  update profile
                </Button>
              }
            >
              <Form.Header>Edit Profile</Form.Header>

              <Form.Item
                name="name"
                label="name"
                help="please type your name : John Doe "
              >
                <Input
                  type="text"
                  value={name}
                  onChange={handleNameChange}
                  placeholder="name"
                />
              </Form.Item>
              <Form.Item name="username" label="username" help="please type ">
                <Input disabled type="text" placeholder="username" />
              </Form.Item>
              <Form.Item
                rules={[{ required: true }]}
                name="bio"
                label="bio"
                help="please type your bio"
              >
                <Input
                  type="text"
                  value={bio}
                  onChange={handleBioChange}
                  placeholder="bio"
                />
              </Form.Item>
            </Form>
          )}

          <StreamApp apiKey={apiKey} appId={appId} token={userToken}>
            <StatusUpdateForm />
            <FlatFeed
              notify
              feedGroup="user"
              Activity={(props) => {
                let activity;
                if (props.activity?.actor?.data) {
                  activity = {
                    activity: {
                      //give
                      ...props.activity,
                      actor: {
                        data: {
                          name: props.activity.actor.id,
                        },
                      },
                    },
                  } as ActivityProps;
                }

                return (
                  <Activity
                    {...props}
                    // data={{ name: props.activity.actor.data.id }}
                    activity={activity?.activity || props.activity}
                    Footer={() => (
                      <div style={{ padding: "8px 16px" }}>
                        <LikeButton {...props} />
                        <CommentField
                          activity={props.activity}
                          onAddReaction={props.onAddReaction}
                        />
                        <CommentList activityId={props.activity.id} />
                      </div>
                    )}
                  />
                );
              }}
            />
          </StreamApp>
        </main>
      </div>
    </>
  );
};

export default Profile;
