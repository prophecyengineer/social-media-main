import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
import { connect } from "getstream";



const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY as string;
const apiSecret = process.env.REACT_APP_STREAM_APP_SECRET as string;
const appId = process.env.NEXT_PUBLIC_STREAM_APP_ID as string;



// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {
    // const session = useSession();
    // const username = session?.data?.user?.username;

    if (req.method === "POST") {
        //send username automatically to use here
        const { username, name, bio, image } = req.body;

        try {

            console.log('came from form', username, name, bio, image)


            let stream = require("getstream");

            const client = stream.connect(apiKey, apiSecret, { location: "dublin" });


            client.user(username).update({ name: name, bio: bio, image: image });



            console.log('did the getstream bit')

            await prisma.user.update({
                data: {

                    name: name,
                    bio: bio,
                    image: image,
                },
                where: { username: username }
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
