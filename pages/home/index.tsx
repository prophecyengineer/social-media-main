import type { NextPage } from "next";
import Head from "next/head";
import styles from "./Home.module.css";
import * as React from "react";
// import {} from "@douyinfe/semi-ui";
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
import { Button, Container, Grid } from "@nextui-org/react";

const Home = () => {
  const session = useSession();
  const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY as string;
  const appId = process.env.NEXT_PUBLIC_STREAM_APP_ID as string;
  const userToken = session.data?.user?.userToken;
  const username = session.data?.user?.username;

  // const globalFeed = client.feed('user', 'globalUser', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiZ2xvYmFsVXNlciJ9.eiHWrONEGfoYxVDsSCNONfX7xqlar6QRbY0_ZCC6tc0')
  // globalFeed.follow('user', username, userToken)
  //   const client = stream.connect(
  //     apiKey,
  //     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiZ2xvYmFsVXNlciJ9.eiHWrONEGfoYxVDsSCNONfX7xqlar6QRbY0_ZCC6tc0",
  //     appId
  //   );

  //   const currentUser = client.feed(
  //     "user",
  //     "globalUser",
  //     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiZ2xvYmFsVXNlciJ9.eiHWrONEGfoYxVDsSCNONfX7xqlar6QRbY0_ZCC6tc0"
  //   );
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
                    <Grid>
                      <Button
                        size="xs"
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
                      >
                        follow {props.activity.actor.id}
                      </Button>
                      <Button
                        size="xs"
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
                      >
                        unfollow {props.activity.actor.id}
                      </Button>
                    </Grid>
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
        ;
      </main>
    </>
  );
};

export default Home;
