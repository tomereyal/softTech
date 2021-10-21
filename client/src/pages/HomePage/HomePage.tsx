import { Layout, Typography, Row, Col, Button } from "antd";
import React, { useContext } from "react";
import AppContext from "../../app-context";
import { UserOutlined } from "@ant-design/icons";
import "./HomePage.css";
const { Sider, Content, Footer, Header } = Layout;

export default function HomePage() {
  const { appState, setAppState } = useContext(AppContext);
  return (
    <Layout className={"home-page"}>
      <Content style={{ padding: "5rem 0" }}>
        <Row justify="space-between">
          <Col>
            <Typography.Title>Welcome to softTech</Typography.Title>
            <p>
              Our HR database includes the company's employees, the departments
              and management hierarchy, and most importantly - salaries!
              {appState.error}
            </p>
            <Button
              onClick={() => setAppState({ ...appState, error: "Goodbye!" })}
            >
              Change Message
            </Button>
          </Col>
          <Col
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            flex="auto"
          >
            <div>
              <UserOutlined style={{ fontSize: "12rem" }} />
            </div>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
}
