import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {
  if (req.method === "POST") {
    const { email, username } = req.body;

    try {
      await prisma.user.update({
        where: {
          email: email,
        },
        data: {
          username: username,
        },
      });

      console.log("updated user");
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
