import { createContext } from "react";
import { EmployeeModel } from "./models/employee.model";

export interface IAppState {
  employees: EmployeeModel[];
  error: string;
}
export interface IAppContext {
  appState: IAppState;
  setAppState: (state: Partial<IAppState>) => void;
}

export const initialAppState = {
  employees: [],
  error: "An Error Has Occured, Please Try Again.",
};

export const initialAppContextValue: IAppContext = {
  appState: {
    employees: [],
    error: "An Error Has Occured, Please Try Again.",
  },
  setAppState: (state: Partial<IAppState>) => {},
};

const AppContext = createContext<IAppContext>(initialAppContextValue);

export const AppContextConsumer = AppContext.Consumer;
export const AppContextProvider = AppContext.Provider;

export default AppContext;
