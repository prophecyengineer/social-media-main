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
} from "antd-mobile";
import { sleep } from "antd-mobile/es/utils/sleep";
import styles from "../../styles/Home.module.css";
import router from "next/router";
import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";

import debounce from "lodash.debounce";
import { Web3Storage } from "web3.storage";
const axios = require("axios").default;

export default function Profile() {
  const username = localStorage.getItem("username");
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
    await sleep(3000);

    const imageData = document.getElementById("input").files[0].name;

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
    await axios.post("/api/auth/signup/signup-profile", data);
    console.log("data", data);
    router.push("/home");
  };

  return (
    <>
      <NavBar onBack={back}></NavBar>
      <Form name="form" onFinish={onFinish}>
        <Form.Item
          rules={[{ required: true }]}
          label="name"
          help="please type your name : John Doe "
        >
          <Input
            type="text"
            value={name}
            onChange={handleNameChange}
            placeholder="name"
          />
        </Form.Item>
        <Form.Item
          rules={[{ required: true }]}
          label="bio"
          help="write a cool bio about you "
        >
          <TextArea value={bio} onChange={handleBioChange} placeholder="name" />
        </Form.Item>

        <>
          <div>
            <img alt="image" src={image} />

            <div>
              <label>Choose file to upload</label>
              <input type="file" id="input" name="file" multiple />
            </div>
            <div>
              <Button onClick={handleUpload}>Upload</Button>
            </div>
          </div>
        </>

        <Button block type="submit" color="primary" size="large">
          Submit
        </Button>
      </Form>
    </>
  );
}
