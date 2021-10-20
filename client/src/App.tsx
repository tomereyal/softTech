import React, { useState } from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import "./App.css";
import { NavHeader } from "./components/Header/Header";
import { mainPages } from "./pages";
import DetailsPage from "./pages/DetailsPage/DetailsPage";
import { AppContextProvider, IAppState, initialAppState } from "./app-context";
import { Layout } from "antd";
const { Footer, Content } = Layout;

export default function App() {
  const [appState, setAppState] = useState<IAppState>(initialAppState);

  const appContextValues = {
    appState,
    setAppState: (newAppState: Partial<IAppState>) => {
      setAppState(newAppState as any);
    },
  };
  return (
    <BrowserRouter>
      <AppContextProvider value={appContextValues}>
        <Layout>
          <NavHeader />
          <Layout>
            <Content style={{ padding: "0 5rem" }}>
              <Switch>
                {mainPages.map((page) => (
                  <Route
                    key={page.path}
                    exact
                    path={page.path}
                    component={page.component}
                  />
                ))}
                <Route path="/employees/:id">
                  {({ match }) => <DetailsPage id={match!.params.id} />}
                </Route>
                <Route path="*">
                  <Redirect to="/" />
                </Route>
              </Switch>
            </Content>
            <Footer style={{ textAlign: "center" }}>footer</Footer>
          </Layout>
        </Layout>
      </AppContextProvider>
    </BrowserRouter>
  );
}
