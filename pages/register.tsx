import * as React from "react";
import Link from "next/link";
import { useState, useRef } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import {
  Form,
  Input,
  Button,
  Dialog,
  Space,
  Card,
  Grid,
  Divider,
  ImageUploader,
  Popover,
  Swiper,
  Steps,
  Toast,
  TextArea,
} from "antd-mobile";
import { ImageUploadItem } from "antd-mobile/es/components/image-uploader";
import { prisma, PrismaClient } from "@prisma/client";
import { PictureOutline } from "antd-mobile-icons";
import { SwiperRef } from "antd-mobile/es/components/swiper";
const axios = require("axios").default;
const { Step } = Steps;
import { sleep } from "antd-mobile/es/utils/sleep";
import { Web3Storage } from "web3.storage";

export async function mockUploadFail() {
  await sleep(3000);
  throw new Error("Fail to upload");
}

export default function Register(props) {
  const router = useRouter();
  const ref = useRef<SwiperRef>(null);

  const [step, setStep] = useState("");
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [username, setUsername] = useState("");
  const [usernameChecker, setUsernameChecker] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // const web3ApiToken = process.env.NEXT_PUBLIC_WEB3_API_TOKEN as string;

  const apiToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDdiREVlNjRmQWY5RmJGOEQ3QTM2MzAyNjY5QkY0OTE0MEJmMDFlZTkiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NTY0NjI3MDg5ODEsIm5hbWUiOiJidW5jaCJ9.OwG3jsLnWHWRR_FtnUEwQHyHzzBr1KRo1HVbikiyrb8";

  const client = new Web3Storage({ token: apiToken });
  const [file, setFile] = useState("");
  const [image, setImage] = useState("");

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
    // const files = await res.files();
    // console.log("files", files);
    // const url = URL.createObjectURL(files[0]);
    // console.log("url", url);
    // setFile(url);
    console.log("full res");
    console.log("full image", image);

    return { image };
  }

  // console.log("FULL iMG URL", `https://${file}.ipfs.dweb.link/${imageData}`);

  console.log("outside image", image);
  const handleNameChange = (value) => {
    setName(value);
  };
  const handleBioChange = (value) => {
    setBio(value);
  };

  const handleUsernameChange = (value) => {
    setUsername(value);
  };

  const handleEmailChange = (value) => {
    setEmail(value);
  };
  const handlePasswordChange = (value) => {
    setPassword(value);
  };

  const onFinish = async () => {
    const data = {
      name: name,
      bio: bio,
      image: image,
      username: username,
      email: email,
      password: password,
    };

    await axios.post("/api/register", data);
    signIn("credentials", {
      username,
      password,
      callbackUrl: `${window.location.origin}/home`,
      redirect: false,
    })
      .then(function (result) {
        router.push(result.url);
      })
      .catch((err) => {
        alert("Failed to register: " + err.toString());
      });
  };

  const handleUploaded = (cid: any, ret: any) => {
    console.log(cid, "handle uploaded:", ret);
  };

  const handleLoading = (val: boolean) => {
    console.log("handle loading:", val);
  };
  const checkExisting = async () => {
    const isTrue = await axios.post("/api/checkExisting", {
      query: { username },
    });

    if (isTrue?.data?.result !== null) {
      console.log("i found a user");

      setUsernameChecker("this username in use");
      // do login stuff
    } else {
      setUsernameChecker("this username is free to use");
    }
    console.log(isTrue?.data?.result);
  };

  return (
    <>
      <Card>
        <Steps current={step}>
          <Step title="1" description="username" />

          <Step title="2" description="account " />
          <Step title="3" description="profile" />
        </Steps>
        <Space direction="vertical" block>
          <Form name="form" onFinish={onFinish}>
            <Swiper allowTouchMove={false} ref={ref}>
              <Swiper.Item key={1}>
                <Form.Header>Register</Form.Header>

                <Form.Item
                  extra={
                    <Popover
                      content={usernameChecker}
                      trigger="click"
                      placement="top"
                      defaultVisible
                    >
                      <Button onClick={checkExisting}>
                        {" "}
                        Check Availability{" "}
                      </Button>
                    </Popover>
                  }
                >
                  <Input
                    type="text"
                    name="username"
                    value={username}
                    onChange={handleUsernameChange}
                    placeholder="username"
                  />
                </Form.Item>
              </Swiper.Item>
              <Swiper.Item key={2}>
                <div
                  onClick={() => {
                    Toast.show(`你点击了卡片 `);
                  }}
                >
                  <Form.Item
                    rules={[{ required: true }]}
                    label="email"
                    help="please type your email address "
                  >
                    <Input
                      type="email"
                      value={email}
                      onChange={handleEmailChange}
                      placeholder="email"
                    />
                  </Form.Item>
                  <Form.Item
                    rules={[{ required: true }]}
                    label="password"
                    help="please type "
                  >
                    <Input
                      type="password"
                      value={password}
                      onChange={handlePasswordChange}
                      placeholder="password"
                    />
                  </Form.Item>
                </div>
              </Swiper.Item>
              <Swiper.Item key={3}>
                <div
                  onClick={() => {
                    Toast.show(`你点击了卡片 `);
                  }}
                >
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
                    <TextArea
                      value={bio}
                      onChange={handleBioChange}
                      placeholder="name"
                    />
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
                  <Space />

                  <Button block type="submit" color="primary" size="large">
                    Submit
                  </Button>
                </div>
              </Swiper.Item>
            </Swiper>
          </Form>
          <Space>
            <Button
              onClick={() => {
                ref.current?.swipePrev();
                setStep(step - 1);
              }}
            >
              back
            </Button>
            <Button
              onClick={() => {
                ref.current?.swipeNext();
                setStep(step + 1);
              }}
            >
              Next
            </Button>
          </Space>
        </Space>

        <Divider />
      </Card>
    </>
  );
}
