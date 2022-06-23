import type { NextPage, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "./Explore.module.css";
import * as React from "react";

import Link from "next/link";
import { useState, useEffect } from "react";

import { PrismaClient } from "@prisma/client";
import "react-activity-feed/dist/index.css";
import {
  StreamApp,
  UserBar,
  NotificationDropdown,
  FlatFeed,
  LikeButton,
  Activity,
  CommentList,
  CommentField,
  StatusUpdateForm,
  FollowButton,
  Avatar,
} from "react-activity-feed";
import { Form, Input, Button, Dialog, Card, Divider } from "antd-mobile";

import stream from "getstream";
import { signOut, useSession } from "next-auth/react";
import { connect } from "getstream";

const Explore: NextPage = ({}) => {
  const stream = require("getstream");

  const session = useSession();
  const userToken = session.data?.user?.userToken;
  const username = session.data?.user?.username;
  const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY as string;
  const appId = process.env.NEXT_PUBLIC_STREAM_APP_ID as string;
  // const client = stream.connect(apiKey, userToken, appId);

  const client = stream.connect(apiKey, userToken, appId);
  const [followingListState, setFollowingListState] = useState([]);

  // const globalFeed = client.feed(
  //   "user",
  //   "globalUser",
  //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiZ2xvYmFsVXNlciJ9.eiHWrONEGfoYxVDsSCNONfX7xqlar6QRbY0_ZCC6tc0"
  // );
  // globalFeed.follow("user", username, userToken);

  // const client = connect(apiKey, appId);

  //what if we getUsers from getstream instead?

  //follow the current user, this is one massive feed
  const globalFeed = client.feed(
    "user",
    "globalUser",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiZ2xvYmFsVXNlciJ9.eiHWrONEGfoYxVDsSCNONfX7xqlar6QRbY0_ZCC6tc0"
  );
  globalFeed.follow("user", username, userToken);

  const UserFollowing = () => {
    const userOne = client.feed("home", username);
    userOne
      .following()
      .then((res) => {
        let List = [];
        for (let i = 0; i < res.results.length; i++) {
          const user = res.results[i].target_id.slice(5);
          List.push(user);
        }
        console.log("following list", List);

        setFollowingListState(List);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    // Activities();
    UserFollowing();
    // UserFollowers();
  }, []);

  // function to follow a user from the main activity in middle of page
  const followerUser = (userToFollow) => {
    const userOne = client.feed("home", client.userId);
    userOne.follow("user", userToFollow);
    UserFollowing();
    // UserFollowers();
  };

  const unfollowerUser = (userToUnFollow) => {
    const userOne = client.feed("home", client.userId);
    userOne.unfollow("user", userToUnFollow, { keepHistory: true });
    UserFollowing();
    // UserFollowers();
  };

  return (
    <>
      <div>
        {/* <ul>
            {users.map((user) => (
              <li className={styles.title} key={user.username}>
                {user.username} {user.userToken}
              </li>
            ))}
          </ul> */}

        <StreamApp
          apiKey={apiKey}
          appId={appId}
          token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiZ2xvYmFsVXNlciJ9.eiHWrONEGfoYxVDsSCNONfX7xqlar6QRbY0_ZCC6tc0"
        >
          {/* <StatusUpdateForm/> */}
          <FlatFeed
            notify
            feedGroup="user"
            Activity={(props) => {
              console.log("props", props);
              let activity;
              if (props.activity?.actor?.data) {
                activity = {
                  activity: {
                    //give
                    ...props.activity,
                    actor: {
                      data: {
                        name: props.activity.actor.id,

                        //need to assign the profileImage as user?.image in getstream
                        profileImage: props?.activity?.actor?.data?.image,
                      },
                    },
                  },
                } as ActivityProps;
              }

              return (
                <>
                  <Activity
                    className="userCard"
                    {...props}
                    // data={{ name: props.activity.actor.data.id }}
                    activity={activity?.activity || props.activity}
                    // Card={() => <Card>{activity.object}</Card>}
                    // Content={({ activity }) => <Card>{activity.object}</Card>}
                    // Header={() => (
                    //   <>
                    //     <Avatar src={props.activity.actor?.image} />
                    //     <
                    //   </>
                    // )}
                    HeaderRight={() => (
                      <>
                        {followingListState.includes(
                          props.activity.actor.id
                        ) ? (
                          <Button
                            onClick={() =>
                              unfollowerUser(props.activity.actor.id)
                            }
                          >
                            following
                          </Button>
                        ) : (
                          <Button
                            color="primary"
                            onClick={() =>
                              followerUser(props.activity.actor.id)
                            }
                          >
                            follow
                          </Button>
                        )}
                      </>
                    )}
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
                  <Divider />
                </>
              );
            }}
          />
        </StreamApp>
      </div>
    </>
  );
};

export default Explore;
