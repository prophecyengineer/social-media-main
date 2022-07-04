import { NextPage } from "next";
import {
  Modal,
  Button,
  NavBar,
  Space,
  AutoCenter,
  Form,
  Input,
  Popover,
  TextArea,
  Toast,
  FloatingBubble,
  Avatar,
} from "antd-mobile";
import ImageUploader, {
  ImageUploadItem,
} from "antd-mobile/es/components/image-uploader";
import { EditFill } from "antd-mobile-icons";
import { sleep } from "antd-mobile/es/utils/sleep";
import styles from "../../styles/Home.module.css";
import router from "next/router";
import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";

import debounce from "lodash.debounce";
import { Web3Storage } from "web3.storage";
const axios = require("axios").default;

export default function Profile() {
  const [username, setUsername] = useState("");

  useEffect(() => {
    // Perform localStorage action
    const username = localStorage.getItem("username");
    if (username !== null) {
      setUsername(username);
    }
  }, []);
  console.log("username at profile", username);
  const apiToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDdiREVlNjRmQWY5RmJGOEQ3QTM2MzAyNjY5QkY0OTE0MEJmMDFlZTkiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NTY0NjI3MDg5ODEsIm5hbWUiOiJidW5jaCJ9.OwG3jsLnWHWRR_FtnUEwQHyHzzBr1KRo1HVbikiyrb8";
  const client = new Web3Storage({ token: apiToken });
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const session = useSession();
  const email = session?.data?.user?.email;
  const [file, setFile] = useState("");
  const [image, setImage] = useState("");

  const handleNameChange = (value) => {
    setName(value);
  };
  const handleBioChange = (value) => {
    setBio(value);
  };

  async function handleUpload(file: File) {
    const imageData = document.getElementById("input").files[0].name;

    await sleep(3000);

    console.log("first part", imageData.name);
    var fileInput = document.getElementById("input");

    const rootCid = await client.put(fileInput.files, {
      name: "avatar",
      maxRetries: 3,
    });

    setFile(rootCid);
    console.log("rootCID", rootCid);

    await setImage(
      "https://" + `${rootCid}` + ".ipfs.dweb.link/" + `${imageData}`
    );

    console.log("full res");
    console.log("full image", image);

    return { image };
  }
  const handleUploaded = (cid: any, ret: any) => {
    console.log(cid, "handle uploaded:", ret);
  };

  const handleLoading = (val: boolean) => {
    console.log("handle loading:", val);
  };

  const back = () => {
    router.push("/signup");
  };

  const onFinish = async () => {
    const data = {
      username: username,
      name: name,
      bio: bio,
      image: image,
    };

    if (data !== null) {
      try {
        await axios.post("/api/auth/signup/signup-profile", data);
        console.log("data", data);
      } finally {
        router.push("/profile");
      }
    }
  };

  return (
    <>
      <NavBar onBack={back}></NavBar>

      <div className={styles.userDetails} block justify="center">
        <Form name="form" onFinish={onFinish}>
          <div>
            <div className="spacer-medium"></div>
            <AutoCenter>
              <Avatar
                className={styles.avatar}
                src={image}
                onClick={() => {}}
                style={{ "--size": "120px" }}
              ></Avatar>
            </AutoCenter>
            <div>
              <AutoCenter>
                <input
                  className="inputimage"
                  type="file"
                  id="input"
                  name="file"
                  multiple
                />
              </AutoCenter>
            </div>
          </div>
          <div className="spacer-medium"></div>

          <Button
            size="large"
            block
            onClick={() => {
              handleUpload();
            }}
          >
            upload image
          </Button>
          <div className="spacer-medium"></div>

          <Form.Item
            rules={[{ required: true }]}
            label="name"
            help="please type your name : John Doe "
          >
            <Input
              type="text"
              value={name}
              onChange={handleNameChange}
              placeholder="Elon Musk"
            />
          </Form.Item>
          <Form.Item
            rules={[{ required: true }]}
            label="bio"
            help="write a cool bio about you "
          >
            <TextArea
              value={bio}
              onChange={handleBioChange}
              placeholder="I am a human I like to do human things 🌍 👽"
            />
          </Form.Item>

          <></>

          <Button block type="submit" color="primary" size="large">
            Submit
          </Button>
        </Form>
      </div>
    </>
  );
}
