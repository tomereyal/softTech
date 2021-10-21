import React from "react";
import { Link } from "react-router-dom";
import { mainPages } from "../../pages";
import { Menu, Layout, Row, Col } from "antd";
const { Header } = Layout;

export default function NavHeader() {
  return (
    <Header style={{ color: "whitesmoke" }}>
      {/* <div className="logo" /> */}
      <Row justify="space-between">
        <Col>SoftTech HR</Col>
        <Col>
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["2"]}>
            {mainPages.map((page) => (
              <Menu.Item key={page.path}>
                <Link to={page.path}>{page.title}</Link>
              </Menu.Item>
            ))}
          </Menu>
        </Col>
      </Row>
    </Header>
  );
}
