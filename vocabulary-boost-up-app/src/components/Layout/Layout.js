import "./Layout.css";
import { Layout as LayoutAntd, Image } from "antd";
import { Link } from "react-router-dom";
import Panel from "../Panel/Panel";

const { Header, Footer, Content } = LayoutAntd;

const Layout = () => {
  return (
    <>
      <LayoutAntd id="layout-container">
        <Header id="header">
          <Link to="/">
            <Image
              id="logo-img"
              src={
                "https://appassets.blob.core.windows.net/images/flashcard-img.png"
              }
              height={60}
              alt="Logo"
              preview={false}
            />
          </Link>
          <span id="app-header">English boost up</span>
        </Header>
        <Content id="content">
          <Panel />
        </Content>
        <Footer id="footer">
          @ 2023 RelativityxAGH Azure University Course Project
        </Footer>
      </LayoutAntd>
    </>
  );
};

export default Layout;
