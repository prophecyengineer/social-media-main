/* eslint-disable react/jsx-key */
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "./Profile.module.css";
import * as React from "react";
import { signOut, useSession } from "next-auth/react";

import { Modal, Button, Dialog, Grid, Input, Space, Form } from "antd-mobile";

import { prisma, PrismaClient } from "@prisma/client";
import "react-activity-feed/dist/index.css";
import { connect, EnrichedUser } from "getstream";
import {
  StreamApp,
  NotificationDropdown,
  FlatFeed,
  LikeButton,
  Activity,
  CommentList,
  CommentField,
  StatusUpdateForm,
  UserBar,
  FollowButton,
  DefaultUT,
  ActivityProps,
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
    // const { setVisible, bindings } = useModal();
    return (
      <div>
        <Button>Followers {followerListState.length}</Button>

        {/* <Modal scroll width="600px" aria-describedby="modal-description">
          Users Following you
          <Grid>
            <Grid>
              <Grid></Grid>
            </Grid>
            <Grid>
              <Grid>
                <Grid>
                  <Grid>
                    {followerListState.slice(0, 10).map((follower) => (
                      <UserBar
                        key={follower}
                        username={follower}
                        // onClickUser={console.log}
                        avatar="https://i.pinimg.com/originals/4f/a1/41/4fa141173a1b04470bb2f850bc5da13b.png"
                        timestamp="2022-04-19T07:44:11+00:00"
                        subtitle="a user following you"
                      />
                      //  <Button
                      //   size="xs"
                      //   onClick={() => unfollowerUser(follower)}
                      // >
                      //   unfollow?
                      // </Button>
                    ))}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Button>Close</Button>
        </Modal> */}
      </div>
    );
  };
  const FollowingComponent = () => {
    return (
      <div>
        <Button auto shadow color="secondary" onClick={() => setVisible(true)}>
          Following {followingListState.length}
        </Button>
        {/* <Modal
          scroll
          width="600px"
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
          {...bindings}
        >
          <Modal.Header>
            <Text id="modal-title" size={18}>
              Users you are Following
            </Text>
          </Modal.Header>
          <Modal.Body>
            <Grid>
              <Grid>
                <Grid></Grid>
              </Grid>
              <Grid>
                {followingListState.slice(0, 10).map((follower) => (
                  <UserBar
                    key={follower}
                    username={follower}
                    // onClickUser={console.log}
                    avatar="https://i.pinimg.com/originals/4f/a1/41/4fa141173a1b04470bb2f850bc5da13b.png"
                    timestamp="2022-04-19T07:44:11+00:00"
                    subtitle="a user you're following"
                  />
                  // needing a custom component here
                  // <Button
                  //   size="xs"
                  //   onClick={() => unfollowerUser(follower)}
                  // >
                  //   unfollow?
                  // </Button>
                ))}
              </Grid>
            </Grid>
          </Modal.Body>
          <Modal.Footer>
            <Button auto flat color="error" onClick={() => setVisible(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal> */}
      </div>
    );
  };

  async function getstreamUser() {
    await client
      .user("peach")
      .get()
      .then((res: { data: any }) => {
        // use the result in here
        console.log(res.data.name);
        return res.data.name;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <>
      <div className={styles.container}>
        <main className={styles.main}>
          <h1 className={styles.title}> </h1>
          <h1 className={styles.title}> BIO {session.data?.user?.name}</h1>

          {readOnlyEditState ? (
            client.userId
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

          {/* {readOnlyEditState ? (
            session.data?.user?.bio
          ) : (
            <Input
              required
              fullWidth
              id="bio"
              value={bio}
              label="Bio"
              name="bio"
              autoComplete="bio"
              onChange={(e) => setBio(e.target.value)}
            />
          )} */}

          {readOnlyEditState ? (
            <Button
              color="primary"
              onClick={() => {
                editProfile();
              }}
            >
              Edit
            </Button>
          ) : (
            <Button block type="submit" color="primary" size="large">
              update profile other buttoon
            </Button>
          )}

          <FollowingComponent />
          <FollowersComponent />
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
