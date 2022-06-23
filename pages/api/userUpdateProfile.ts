import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
import { connect } from "getstream";



//take in form data of edit profile
//send up here, 
//update the getstream user also prisma 
//make prisma update work first



const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY as string;
const apiSecret = process.env.REACT_APP_STREAM_APP_SECRET as string;
const appId = process.env.NEXT_PUBLIC_STREAM_APP_ID as string;

// const client = connect(apiKey, appId, apiSecret);

// let stream = require("getstream");

// connect to the us-east region
// const client = stream.connect(apiKey, apiSecret, { location: "dublin" });

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {
    // const session = useSession();
    // const idHere = session.data?.user?.id

    if (req.method === "POST") {
        //send username automatically to use here
        const { username, name, bio, image } = req.body;

        try {


            //     process.env.REACT_APP_STREAM_APP_SECRET,
            //     process.env.REACT_APP_STREAM_APP_ID,
            //     { location: 'us-east' },

            // const client = connect(apiKey, appId, apiSecret);

            let stream = require("getstream");

            // connect to the us-east region
            const client = stream.connect(apiKey, apiSecret, { location: "dublin" });

            // fuck yeah this one worked

            // client.user('jerry').update({ name: "Jane Doe", occupation: "Software Engineer", gender: "female" });
            client.user('peach').update({ name: name, bio: bio, image: image });

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
