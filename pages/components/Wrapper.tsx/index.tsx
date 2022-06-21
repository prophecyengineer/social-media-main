import {
  Layout,
  Nav,
  Button,
  Breadcrumb,
  Skeleton,
  Avatar,
  Col,
  Row,
} from "@douyinfe/semi-ui";
import {
  IconSemiLogo,
  IconBell,
  IconHelpCircle,
  IconBytedanceLogo,
  IconHome,
  IconLive,
  IconSetting,
  IconHistogram,
} from "@douyinfe/semi-icons";

// import NavBar from "../NavBar";

// const Wrapper = () => {
//   const { Header, Footer, Sider, Content } = Layout;
//   return (
//     <Layout style={{ border: "1px solid var(--semi-color-border)" }}>
//       <NavBar />

//       <Layout>
//         <Header style={{ backgroundColor: "var(--semi-color-bg-1)" }}>
//           <Nav
//             mode="horizontal"
//             footer={
//               <>
//                 <Button
//                   theme="borderless"
//                   icon={<IconBell size="large" />}
//                   style={{
//                     color: "var(--semi-color-text-2)",
//                     marginRight: "12px",
//                   }}
//                 />
//                 <Button
//                   theme="borderless"
//                   icon={<IconHelpCircle size="large" />}
//                   style={{
//                     color: "var(--semi-color-text-2)",
//                     marginRight: "12px",
//                   }}
//                 />
//                 <Avatar color="orange" size="small">
//                   YJ
//                 </Avatar>
//               </>
//             }
//           ></Nav>
//         </Header>
//         <Content
//           style={{
//             padding: "24px",
//             backgroundColor: "var(--semi-color-bg-0)",
//           }}
//         >
//           <Breadcrumb
//             style={{
//               marginBottom: "24px",
//             }}
//             routes={["Home", "Page Section", "Pagge Ssection", "Detail"]}
//           />
//           <div
//             style={{
//               borderRadius: "10px",
//               border: "1px solid var(--semi-color-border)",
//               height: "376px",
//               padding: "32px",
//             }}
//           >
//             <Skeleton
//               placeholder={<Skeleton.Paragraph rows={2} />}
//               loading={true}
//             >
//               <p>Hi, Bytedance dance dance.</p>
//               <p>Hi, Bytedance dance dance.</p>
//             </Skeleton>
//             <div className="grid">
//               <Row
//                 gutter={{
//                   xs: 8,
//                   sm: 12,
//                   md: 16,
//                   lg: 24,
//                   xl: 24,
//                   xxl: 24,
//                 }}
//               >
//                 <Col xs={2} sm={4} md={6} lg={8} xl={10}>
//                   <div className="col-content">Col</div>
//                 </Col>
//                 <Col xs={20} sm={16} md={12} lg={8} xl={4}>
//                   <div className="col-content">Col</div>
//                 </Col>
//                 <Col xs={2} sm={4} md={6} lg={8} xl={10}>
//                   <div className="col-content">Col</div>
//                 </Col>
//               </Row>
//               <br />
//               <Row>
//                 <Col xs={{ span: 5, offset: 1 }} lg={{ span: 6, offset: 2 }}>
//                   <div className="col-content">Col</div>
//                 </Col>
//                 <Col xs={{ span: 11, offset: 1 }} lg={{ span: 6, offset: 2 }}>
//                   <div className="col-content">Col</div>
//                 </Col>
//                 <Col xs={{ span: 5, offset: 1 }} lg={{ span: 6, offset: 2 }}>
//                   <div className="col-content">Col</div>
//                 </Col>
//               </Row>
//             </div>
//           </div>
//         </Content>
//         <Footer
//           style={{
//             display: "flex",
//             justifyContent: "space-between",
//             padding: "20px",
//             color: "var(--semi-color-text-2)",
//             backgroundColor: "rgba(var(--semi-grey-0), 1)",
//           }}
//         >
//           <span
//             style={{
//               display: "flex",
//               alignItems: "center",
//             }}
//           >
//             <IconBytedanceLogo size="large" style={{ marginRight: "8px" }} />
//             <span>Copyright © 2019 ByteDance. All Rights Reserved. </span>
//           </span>
//           <span>
//             <span style={{ marginRight: "24px" }}>Customer Service</span>
//             <span>Feedback</span>
//           </span>
//         </Footer>
//       </Layout>
//     </Layout>
//   );
// };

// export default Wrapper;

import * as React from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import NavBar from "../NavBar";

export default function Wrapper(props) {
  const session = useSession();
  // console.log('session',session.data?.user?.username)
  const router = useRouter();

  if (
    (session !== null && session?.status === "authenticated") ||
    router.pathname === "/" ||
    router.pathname === "/register"
  ) {
    return (
      <>
        <NavBar>
          <Layout>{props.children}</Layout>
        </NavBar>
      </>
    );
  } else {
    return (
      <>
        <h1>You are not authenticated</h1>

        <Link href="/">Back to Login</Link>
      </>
    );
  }
}
