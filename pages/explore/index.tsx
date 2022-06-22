import type { NextPage, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "./Explore.module.css";
import * as React from "react";

import Link from "next/link";
import { useRouter } from "next/router";

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
} from "react-activity-feed";
import { Form, Input, Button, Dialog, Card } from "antd-mobile";

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

  return (
    <>
      <div className={styles.container}>
        <h1 className={styles.title}> Explore </h1>

        {/* <ul>
            {users.map((user) => (
              <li className={styles.title} key={user.username}>
                {user.username} {user.userToken}
              </li>
            ))}
          </ul> */}
        <h2>Global Feed all users posts to go here</h2>

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
                        profileImage: session.data?.user?.image,
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
                    <Card>
                      <Button
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
                    </Card>
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
      </div>
    </>
  );
};

// export async function getServerSideProps() {
//   const prisma = new PrismaClient();

//   const users = await prisma.user.findMany();
//   // const users = await res.json()

//   let stream = require("getstream");

//   return {
//     props: {
//       users: users.map(
//         (user: user) =>
//           ({
//             ...user,
//             username: user.username.toString(),
//             name: user.name.toString(),
//             email: user.email.toString(),
//             registeredAt: user.registeredAt.toISOString(),
//           } as unknown as user)
//       ),
//     },
//   };
// }

export default Explore;
