import { createContext, useContext, useState, useEffect } from "react";

const UserStateContext = createContext({
  name: "Bob",
  username: "bobberson",
  bio: "heyhye bio made by me",
  isActive: 1,
  email: "bobbobberson@example.com",
});

export function UserProvider({ children }) {
  //   const session = useSession();
  const stream = require("getstream");
  const userToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoicGVhY2gifQ.o_kibyAOhWH-FHLalIy3RAreRvH7KvE2_IEVGPpJqFI";
  const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY as string;
  const appId = process.env.NEXT_PUBLIC_STREAM_APP_ID as string;
  const client = stream.connect(apiKey, userToken, appId);

  const [user, setUser] = useState();

  // async function getUser() {
  //     // TODO add SWR
  //     const result = await fetch('/api/get-user-info', {
  //         headers: {
  //             Authorization: `Bearer ${token}`,
  //         },
  //     }).then((response) => response.json());

  //     const userWithAvatarFallback = {
  //         ...result,
  //         avatar_url:
  //             result.avatar_url ??
  //             'https://res.cloudinary.com/netlify/image/upload/q_auto,f_auto,w_210/v1605632851/explorers/avatar.jpg',
  //     };

  //     setUser(userWithAvatarFallback);
  //     setStatus('loaded');
  //     cache[token] = userWithAvatarFallback;
  // }

  // if session get session and user details
  // React.useEffect(() => {
  //     if (!token) {
  //         return;
  //     }

  //     // use cached user data if we’ve already hit the API with this token
  //     if (cache[token]) {
  //         setUser(cache[token]);
  //         setStatus('loaded');
  //         return;
  //     }

  //     getUser();
  // }, [token]);
  //   const userState = useState({
  //     name: "Angelina Jolie",
  //     username: "jolie",
  //     isActive: 1,
  //     email: "angie@actor",
  //     bio: "heyhye bio made by me",
  //   });

  const [streamUser, setStreamUser] = useState();

  //get user from stream

  async function getUser(userName = "peach") {
    try {
      const userFallback = await client.user(userName).get();
      setUser(userFallback);

      //   const { full } = await client.user(userName).get();
      //   setStreamUser(full);
      console.log("user from stream", userFallback);
    } catch (err) {
      console.log(err);
    }

    //get user from stream

    //    const result = await fetch("/api/get-user-info", {
    //      headers: {
    //        Authorization: `Bearer ${token}`,
    //      },
    //    }).then((response) => response.json());
  }

  useEffect(() => {
    getUser();
  }, []);
  const state = {
    user,
    // token,
    // status,
    // redirectToOAuth,
    // activity,
    // logoutUser,
    // getUser,
  };

  return (
    <UserStateContext.Provider value={state}>
      {children}
    </UserStateContext.Provider>
  );
}

export function useUserState() {
  const state = useContext(UserStateContext);
  //   console.log("in context prov", state[0].name);
  if (state === undefined) {
    throw new Error("useUserState must be used within a UserProvider");
  }

  return state;
}

// const UserProvider = ({ children }) => {
//     const [status, setStatus] = useState('loading');
//     const [token, setToken] = useState();
//     const [user, setUser] = useState();
// const [activity, setActivity] = React.useState();

// async function getUser() {

// const state = {
//     user,
//     token,
//     status,
//     // redirectToOAuth,
//     // activity,
//     // logoutUser,
//     // getUser,
// };

// <UserStateContext.Provider value={ state } >
// { children }
// < /UserStateContext.Provider>

// export function useUserState() {
//     const state = React.useContext(UserStateContext);

//     if (state === undefined) {
//         throw new Error('useUserState must be used within a UserProvider');
//     }

//     return state;
// }

// ----

// import React, { useState, useContext, createContext } from "react";

// const UserContext = createContext([
//     {
//         firstName: "Bob",
//         lastName: "Bobberson",
//         suffix: 1,
//         email: "bobbobberson@example.com"
//     },
//     obj => obj
// ]);

// const LevelFive = () => {
//     const [user, setUser] = useContext(UserContext);

//     return (
//         <div>
//         <h5>{`${user.firstName} ${user.lastName} the ${user.suffix} born`}</h5>
//             < button
// onClick = {() => {
//     setUser(Object.assign({}, user, { suffix: user.suffix + 1 }));
// }}
//       >
//     Increment
//     < /button>
//     < /div>
//   );
// };

// const LevelFour = () => (
//     <div>
//     <h4>fourth level</h4>
//         < LevelFive />
//         </div>
// );

// const LevelThree = () => (
//     <div>
//     <h3>third level</h3>
//         < LevelFour />
//         </div>
// );

// const LevelTwo = () => (
//     <div>
//     <h2>second level</h2>
//         < LevelThree />
//         </div>
// );

// const ContextComponent = () => {
//     const userState = useState({
//         firstName: "James",
//         lastName: "Jameson",
//         suffix: 1,
//         email: "jamesjameson@example.com"
//     });

//     return (

//   );
// };

// export default ContextComponent;
