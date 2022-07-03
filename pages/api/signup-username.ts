import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {
  //   if (req.method === "POST") {
  //     const { userId, username } = req.body;
  //     try {
  //       await prisma.user.create({
  //         data: {
  //           email: email,
  //           password: hash,
  //           name: "Jane Doe",
  //           username: "demo",
  //           userToken: "not added yet",
  //           bio: "A bio about me",
  //           image: "http://placekitten.com/200/300",
  //           stripeToken: "",
  //         },
  //       });
  //       console.log("created in db");
  //       return res.status(200).end();
  //     } catch (err) {
  //       return res.status(503).json({ err: err.toString() });
  //     }
  //   } else {
  //     return res
  //       .status(405)
  //       .json({ error: "This request only supports POST requests" });
  //   }
};
