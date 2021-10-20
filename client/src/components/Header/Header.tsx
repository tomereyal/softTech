import React from "react";
import { Link } from "react-router-dom";
import { mainPages } from "../../pages";
import { Menu, Layout } from "antd";
const { Header } = Layout;
export class NavHeader extends React.Component {
  render() {
    return (
      <Header>
        <div className="logo" />
        SoftTech HR
        <Menu theme="light" mode="horizontal" defaultSelectedKeys={["2"]}>
          {mainPages.map((page) => (
            <Menu.Item key={page.path}>
              <Link to={page.path}>{page.title}</Link>
            </Menu.Item>
          ))}
        </Menu>
      </Header>
    );
  }
}
