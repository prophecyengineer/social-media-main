///make this page work then move over to /[user]
//fetch data using the params for that user!
//maybe fetch from prisma for the streamString
import { useRouter } from "next/router";

import { useEffect, useState } from "react";

export default function User() {
  const router = useRouter();
  const { pid } = router.query;
  const stream = require("getstream");

  const userToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoicGVhY2gifQ.o_kibyAOhWH-FHLalIy3RAreRvH7KvE2_IEVGPpJqFI";
  const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY as string;
  const appId = process.env.NEXT_PUBLIC_STREAM_APP_ID as string;
  const client = stream.connect(apiKey, userToken, appId);
  const [user, setUser] = useState();
  const [fetchedData, setFetchedData] = useState([]);

  //takes a few refreshes to load in
  useEffect(() => {
    const getData = async () => {
      const data = await client.user(pid).get();
      setFetchedData(data);
    };
    getData();
  }, []);
  //load once only

  console.log(fetchedData);
  return (
    <>
      <h2>{pid}</h2>
      {/* <h1> {fetchedData.data.name}</h1> */}
      {/* <h2> {userData.token}</h2>  */}
    </>
  );
}
