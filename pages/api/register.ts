import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
import { connect } from "getstream";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY as string;
const apiSecret = process.env.REACT_APP_STREAM_APP_SECRET as string;
const appId = process.env.NEXT_PUBLIC_STREAM_APP_ID as string;
//     process.env.REACT_APP_STREAM_APP_SECRET,
//     process.env.REACT_APP_STREAM_APP_ID,
//     { location: 'us-east' },

// const client = connect(apiKey, appId, apiSecret);

let stream = require("getstream");

// connect to the us-east region
const client = stream.connect(apiKey, apiSecret, { location: "dublin" });

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {
  if (req.method === "POST") {
    const { name, username, email, password } = req.body;

    try {
      // makes a user in getstream
      let userToken = client.createUserToken(username);
      console.log("make a stream token with", username, userToken);
      const hash = await bcrypt.hash(password, 0);



      await prisma.user.create({
        data: {
          name: name,
          username: username,
          email: email,
          password: hash,
          userToken: userToken,
          bio: "something about me",
          image: "http://placekitten.com/200/300",
          stripeToken: "",
        },
      });

      return res.status(200).end();
    } catch (err) {
      return res.status(503).json({ err: err.toString() });
    }
  } else {
    return res
      .status(405)
      .json({ error: "This request only supports POST requests" });
  }
};
