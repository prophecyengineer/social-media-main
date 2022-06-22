import type { NextPage } from "next";
import Head from "next/head";
import styles from "./Home.module.css";
import * as React from "react";
import { useState } from "react";
import { PrismaClient } from "@prisma/client";
import "react-activity-feed/dist/index.css";
import { connect } from "getstream";
import {
  StreamApp,
  NotificationDropdown,
  FlatFeed,
  LikeButton,
  Activity,
  CommentList,
  CommentField,
  StatusUpdateForm,
  FollowButton,
} from "react-activity-feed";
import stream from "getstream";
import { signOut, useSession } from "next-auth/react";
import { Form, Input, Button, Dialog, Card } from "antd-mobile";

const Home = () => {
  const session = useSession();
  const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY as string;
  const appId = process.env.NEXT_PUBLIC_STREAM_APP_ID as string;
  const userToken = session.data?.user?.userToken;
  const username = session.data?.user?.username;
  const [followingListState, setFollowingListState] = useState([]);

  // Connection to client for getStream.io
  // const client = stream.connect(apiKey, userToken, appId);

  // function pulling following data from getStream.io

  console.log("userToken", userToken);

  //   const currentUser = client.feed(
  //     "user",
  //     "globalUser",
  //     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiZ2xvYmFsVXNlciJ9.eiHWrONEGfoYxVDsSCNONfX7xqlar6QRbY0_ZCC6tc0"
  //   );

  const followingList = [
    {
      username: username.tiya,
    },
    { username: username.alex },
  ];

  return (
    <>
      <main className={styles.main}>
        <h1 className={styles.title}> Home </h1>
        <StreamApp apiKey={apiKey} appId={appId} token={userToken}>
          {/* <StatusUpdateForm/> */}
          <FlatFeed
            notify
            feedGroup="home"
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
                  HeaderRight={() => (
                    <>
                      <FollowButton />
                      {followingList.includes(username) ? (
                        <FollowButton
                          followed
                          onClick={() => {
                            const currentUser = client.feed(
                              "home",
                              username,
                              userToken
                            );
                            currentUser.follow(
                              "user",
                              props.activity.actor.id,
                              userToken
                            );
                          }}
                        />
                      ) : (
                        <FollowButton
                          onClick={() => {
                            const currentUser = client.feed(
                              "home",
                              username,
                              userToken
                            );
                            currentUser.unfollow(
                              "user",
                              props.activity.actor.id,
                              userToken
                            );
                          }}
                        />
                      )}
                    </>
                    // <Card>
                    //
                    //   >
                    //     follow {props.activity.actor.id}
                    //   </Button>
                    //   <Button
                    //
                    //   >
                    //     unfollow {props.activity.actor.id}
                    //   </Button>
                    // </Card>
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
              );
            }}
          />
        </StreamApp>
      </main>
    </>
  );
};

export default Home;
