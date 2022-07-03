import * as React from "react";
import Link from "next/link";
import { useState, useRef } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { ImageUploadItem } from "antd-mobile/es/components/image-uploader";
import { prisma, PrismaClient } from "@prisma/client";
import { PictureOutline } from "antd-mobile-icons";
import { SwiperRef } from "antd-mobile/es/components/swiper";
const { Step } = Steps;
import { sleep } from "antd-mobile/es/utils/sleep";
import { Web3Storage } from "web3.storage";
import { useStepsForm } from "sunflower-antd";
import styles from "../styles/Home.module.css";
import { CheckCircleFill } from "antd-mobile-icons";
import {
  Form,
  Input,
  Button,
  Result,
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
  AutoCenter,
  NavBar,
} from "antd-mobile";
import { NextPage } from "next";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const Signup: NextPage = () => {
  const {
    form,
    current,
    gotoStep,
    stepsProps,
    formProps,
    submit,
    formLoading,
  } = useStepsForm({
    async submit(values) {
      const { username, email, address } = values;
      console.log(username, email, address);
      await new Promise((r) => setTimeout(r, 1000));
      return "ok";
    },
    total: 3,
  });

  const router = useRouter();
  const ref = useRef<SwiperRef>(null);

  const [step, setStep] = useState("");
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [username, setUsername] = useState("");
  const [usernameChecker, setUsernameChecker] = useState("");

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

  const formList = [
    <>
      <Form.Item
        layout="horizontal"
        name="username"
        rules={[
          {
            required: true,
            message: "Please input a cool username",
          },
        ]}
        extra={
          <div>
            <a>check availability</a>
          </div>
        }
      >
        <Input placeholder="username" />
      </Form.Item>

      <Form.Item {...tailLayout}>
        <Button color="primary" block onClick={() => gotoStep(current + 1)}>
          Next
        </Button>
      </Form.Item>
    </>,
    <>
      <Form.Item
        label="email"
        name="email"
        rules={[
          {
            required: true,
            message: "Please input your email",
          },
        ]}
      >
        <Input placeholder="email" />
      </Form.Item>
      <Form.Item
        label="Password"
        name="password"
        rules={[
          {
            required: true,
            message: "Please input address",
          },
        ]}
      >
        <Input placeholder="Password" />
      </Form.Item>
      <Form.Item {...tailLayout}>
        <Button
          style={{ marginRight: 10 }}
          type="primary"
          loading={formLoading}
          onClick={() => {
            submit().then((result) => {
              if (result === "ok") {
                gotoStep(current + 1);
              }
            });
          }}
        >
          Submit
        </Button>
        <Button onClick={() => gotoStep(current - 1)}>Prev</Button>
      </Form.Item>
    </>,
  ];

  return (
    <div>
      <div style={{ marginTop: 60 }}>
        <AutoCenter>
          <h1 className={styles.title}>Choose a username</h1>
        </AutoCenter>
        <div className="spacer-medium"></div>
        <Form {...layout} {...formProps} style={{ maxWidth: 600 }}>
          {formList[current]}
        </Form>

        {current === 2 && (
          <Result
            status="success"
            title="Submit is succeed!"
            extra={
              <>
                <Button
                  type="primary"
                  onClick={() => {
                    router.push("./Oboarding");
                  }}
                >
                  Buy it again
                </Button>
                <Button>Check detail</Button>
              </>
            }
          />
        )}
      </div>
    </div>
  );
};

export default Signup;

//   const next1 = () => {};

//   return (
//     <>
//
//       <div className="spacer-small" />

{
  /* <Steps current={step}>
        <Step />
        <Step />
        <Step />
      </Steps> */
}

{
  /* <Form name="form" onFinish={onFinish}>
        <Swiper allowTouchMove={true} ref={ref}>
          <Swiper.Item key={1}>
            <AutoCenter>
              <div className="spacer-small" />

              <h2>Choose a username</h2>
            </AutoCenter>
            <AutoCenter>
              <p className={styles.description}> this is the name in the url</p>
            </AutoCenter>
            <Form.Item
              extra={
                <Popover
                  content={usernameChecker}
                  trigger="click"
                  placement="top"
                  defaultVisible
                >
                  <Button onClick={checkExisting}> Check Availability </Button>
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
                Toast.show(`this one's been taken`);
              }}
            >
            
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
      </Form> */
}

{
  /* <AutoCenter>
        <Button
          style={{
            marginBottom: "24px",
            fontSize: "15px",
            width: "60vw",
          }}
          block
          type="submit"
          color="primary"
          size="large"
          onClick={() => {
            ref.current?.swipeNext();
            setStep(step + 1);
          }}
        >
          Next
        </Button>
      </AutoCenter> */
}

//       <Divider />
//     </>
//   );
// }
