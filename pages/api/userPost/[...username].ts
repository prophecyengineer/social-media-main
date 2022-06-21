import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const router = express.Router();
const stream = require('getstream');
const client = stream.connect(process.env.STREAM_API_KEY, process.env.STREAM_KEY_SECRET, process.env.STREAM_router_ID);

// Create user post
router.post("/userPost/:username", function (req, res) {
    const currentUser = client.feed('user', req.params.username);
    const globalUser = client.feed('user', "globalUser")
    const userId = currentUser.userId
    prisma.user.findFirst({
        where: {
            username: req.params.username,
        },
    }).then((userInfo) => {
        prisma.post.create({
            name: `${userInfo.first_name} ${userInfo.last_name}`,
            description: req.body.description,
            image: req.body.image,
            title: req.body.title,
            UserId: userInfo.id,
        })
        activity = {
            actor: userId,
            user: userId,
            name: `${userInfo.first_name} ${userInfo.last_name}`,
            profileImage: userInfo.image,
            verb: 'post',
            object: `${req.body.title}\n${req.body.description}`,
            image: req.body.image,
            foreign_id: `post:${req.body.image}`,
            started_at: new Date(),
        };
        globalUser.addActivity(activity);

    }).then(function (data) {
        res.status(200).json(data);
    })
        .catch((err) => {
            res.status(500).json(err);
        });
});

// Get 20 user posts from getstream.io
router.get("/userPosts", function (req, res) {
    const globalUser = client.feed('user', "globalUser")

    globalUser.get({
        limit: 20, enrich: true,
        reactions: { own: true, counts: true, recent: true },
    })
        .then((data) => {
            res.status(200).json(data.results);
        })
        .catch((err) => {
            res.status(500).json(err);
        });


})

module.exports = router