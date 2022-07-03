import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");

function makeRandomString() {
  const length = 9;
  let text = "";
  const possible = "abcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < length; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}
// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {
  if (req.method === "POST") {
    const { email, password } = req.body;

    const randomUsername = `u` + makeRandomString();
    try {
      const hash = await bcrypt.hash(password, 0);

      await prisma.user.create({
        data: {
          email: email,
          password: hash,
          name: "Jane Doe",
          username: randomUsername,
          userToken: "not added yet",
          bio: "A bio about me",
          image: "http://placekitten.com/200/300",
          stripeToken: "",
        },
      });
      console.log("created in db");
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
