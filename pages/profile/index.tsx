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
  CapsuleTabs,
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
import { useUserState } from "../../context/user";

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
  const { user } = useUserState();

  const session = useSession();
  const userName = session?.data?.user?.username;
  const handleNameChange = (value: React.SetStateAction<never[]>) => {
    setName(value);
  };

  const handleBioChange = (value: React.SetStateAction<never[]>) => {
    setBio(value);
  };

  const handleImageChange = (value: React.SetStateAction<never[]>) => {
    setImage(value);
  };
  // function to to change fields to be editable
  const editProfile = () => {
    setReadOnlyEditState(false);
  };

  // function to change state of save profile
  const saveProfile = () => {
    setReadOnlyEditState(true);
  };

  const onFinish = async (values: any) => {
    const username = user.id;

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
      .then((res: { results: string | any[] }) => {
        let List = [];
        for (let i = 0; i < res.results.length; i++) {
          const user = res.results[i].feed_id.slice(5);
          List.push(user);
        }
        setFollowerListState(List);
      })
      .catch((err: any) => {
        console.error(err);
      });
  };
  const UserFollowing = () => {
    //got the current user info from getstream
    // current user HOME feed follows these people
    const userOne = client.feed("home", client.userId);
    userOne
      .following()
      .then((res: { results: string | any[] }) => {
        let List = [];
        for (let i = 0; i < res.results.length; i++) {
          const user = res.results[i].target_id.slice(5);
          List.push(user);
        }

        setFollowingListState(List);
      })
      .catch((err: any) => {
        console.error(err);
      });
  };

  // function to follow a user from the main activity in middle of page
  const followerUser = (userToFollow: any) => {
    const userOne = client.feed("home", client.userId);
    userOne.follow("user", userToFollow);
    UserFollowing();
    UserFollowers();
  };

  const unfollowerUser = (userToUnFollow: any) => {
    const userOne = client.feed("home", client.userId);
    userOne.unfollow("user", userToUnFollow, { keepHistory: true });
    UserFollowing();
    UserFollowers();
  };

  const tabs = [
    {
      key: "home",
      title: "Followers",
      badge: Badge.dot,
    },
    {
      key: "todo",
      title: "following",
      badge: "5",
    },
    {
      key: "message",
      title: "posts",
      // icon: (active: boolean) =>
      // active ? <MessageFill /> : <MessageOutline />,
      badge: "99+",
    },
  ];

  const [followersVisible, setFollowersVisible] = useState(false);

  const [followingVisible, setFollowingVisible] = useState(false);
  const [visible, setVisible] = useState(false);

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
                  src={user?.data?.image}
                  style={{ "--size": "120px" }}
                ></Avatar>
              </Space>

              <Space block justify="center" className={styles.title}>
                <h1>{user?.data?.name}</h1>
              </Space>
              <Space block justify="center">
                <p>{user?.data?.bio}</p>
              </Space>
              <Grid columns={3} gap={2}>
                <Grid.Item>
                  <Button
                    className={styles.smallButton}
                    onClick={() => {
                      setFollowingVisible(true);
                    }}
                  >
                    followinssg {followingListState.length}
                  </Button>
                </Grid.Item>
                <Grid.Item>
                  {" "}
                  <div>
                    <>
                      <Button
                        className={styles.smallButton}
                        onClick={() => {
                          setFollowersVisible(true);
                        }}
                      >
                        followers {followerListState.length}
                      </Button>
                      <Popup
                        visible={followersVisible}
                        onMaskClick={() => {
                          setFollowersVisible(false);
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
                </Grid.Item>
                <Grid.Item>
                  <Button className={styles.smallButton}>
                    subscribers 423
                  </Button>
                </Grid.Item>
              </Grid>
              <>
                <Popup
                  visible={followingVisible}
                  onMaskClick={() => {
                    setFollowingVisible(false);
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

              <Card
                headerStyle={{
                  color: "#1677ff",
                }}
                bodyClassName={styles.customBody}
              >
                {readOnlyEditState ? (
                  <>
                    <Button
                      block
                      onClick={() => {
                        // editProfile();
                        setVisible(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Modal
                      visible={visible}
                      content={
                        <Form
                          name="form"
                          onFinish={onFinish}
                          footer={
                            <Button
                              block
                              type="submit"
                              color="primary"
                              size="large"
                            >
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

                          <Form.Item
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
                          <Form.Item
                            name="image"
                            label="image"
                            help="please paste your img"
                          >
                            <Input
                              type="text"
                              value={image}
                              onChange={handleImageChange}
                              placeholder="paste an image link"
                            />
                          </Form.Item>
                        </Form>
                      }
                      closeOnAction
                      onClose={() => {
                        setVisible(false);
                      }}
                      actions={[
                        {
                          key: "confirm",
                          text: "confirm",
                        },
                      ]}
                    />
                  </>
                ) : (
                  <Button block type="submit" color="primary" size="large">
                    update profile other buttoon
                  </Button>
                )}
              </Card>

              <Tabs defaultActiveKey="1">
                <Tabs.Tab title="Public Feed" key="1">
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
                                <CommentField activity={props.activity} />
                                <CommentList activityId={props.activity.id} />
                              </div>
                            )}
                          />
                        );
                      }}
                    />
                  </StreamApp>
                </Tabs.Tab>
                <Tabs.Tab title="Private Feed" key="2">
                  2
                </Tabs.Tab>
                <Tabs.Tab title="Videos" key="3">
                  3
                </Tabs.Tab>
              </Tabs>
            </>
          ) : (
            <h1>hi</h1>
          )}
        </main>
      </div>
    </>
  );
};

export default Profile;
