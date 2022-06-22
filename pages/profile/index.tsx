/* eslint-disable react/jsx-key */
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "./Profile.module.css";
import * as React from "react";
import { signOut, useSession } from "next-auth/react";

import { Modal, Button, Dialog, Grid, Input, Space } from "antd-mobile";

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
import Nav from "../components/NavBar";

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

  // function to to change fields to be editable
  const editProfile = () => {
    setReadOnlyEditState(false);
  };

  // function to change state of save profile
  const saveProfile = () => {
    setReadOnlyEditState(true);
  };

  // input change handler for the profile save form
  // const inputChange = (event) => {
  //   const { name, value } = event.target;
  //   props.setProfile({
  //     ...props.user,
  //     [name]: value,
  //   });
  // };

  // form submit handler for saving the profile data
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const data = {
      name: name,
      bio: bio,
      image: image,
    };
    // first get right user lol
    console
      .log("info just written in", data.name, data.bio, data.image)
      .then(() => {
        saveProfile();
      });
  };

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

  return (
    <>
      <Nav>
        <div className={styles.container}>
          <Head>
            <title>Home for</title>
            <meta name="description" content="Generated by create next app" />
            <link rel="icon" href="/favicon.ico" />
          </Head>

          <main className={styles.main}>
            <h1 className={styles.title}>
              {" "}
              Profile of {session.data?.user?.name}{" "}
            </h1>

            {readOnlyEditState ? (
              <Image
                width="30px"
                height="30px"
                alt="cefr"
                src="http://placekitten.com/200/300"
                // src={`https://res.cloudinary.com/crowandrew/image/upload/w_500,h_500,c_crop,g_face,r_max/w_150/v1603932299/${props.profile.image}`}
              />
            ) : (
              <>
                <Space />

                <Image
                  src="http://placekitten.com/200/300"
                  width="30px"
                  height="30px"
                  fetch-format="auto"
                  quality="auto"
                ></Image>
                {/* </CloudinaryContext> */}
                <Space />
                <Button
                  color="secondary"
                  // onClick={() => beginUpload("image")}
                >
                  Upload Profile Pic
                </Button>

                <Input
                  id="image"
                  label="Image"
                  name="image"
                  placeholder="paste image link here"
                  autoComplete="image"
                  onChange={(e) => setImage(e.target.value)}
                />
              </>
            )}

            {readOnlyEditState ? (
              session.data?.user?.name
            ) : (
              <Input
                required
                fullWidth
                id="name"
                label="Your Name"
                name="name"
                autoComplete="name"
                onChange={(e) => setName(e.target.value)}
                value={name}
              />
            )}

            {readOnlyEditState ? (
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
            )}

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
              <Button color="secondary" onClick={handleFormSubmit}>
                Save
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
      </Nav>
    </>
  );
};

export default Profile;
