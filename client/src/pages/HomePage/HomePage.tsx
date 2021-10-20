import { Layout } from "antd";
import { Button } from "antd/lib/radio";
import React, { useContext } from "react";
import AppContext from "../../app-context";
const { Sider, Content, Footer, Header } = Layout;

export default function HomePage() {
  const { appState, setAppState } = useContext(AppContext);
  return (
    <Layout style={{ padding: "24px 0" }}>
      <Sider theme="light">left sidebar</Sider>
      <Content>
        main content
        <h6>This example shows how to use StateContext</h6>
        <p>Message: {appState.error}</p>
        <Button onClick={() => setAppState({ ...appState, error: "Goodbye!" })}>
          Change Message
        </Button>
      </Content>
    </Layout>
  );
}
