import axios from "axios";
import React, { useContext, useEffect } from "react";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import { Link } from "react-router-dom";
import { EmployeeModel } from "../../models/employee.model";
import AppContext from "../../app-context";
import { fetchEmployees } from "../../api";

export default function EmployeeListPage() {
  const { appState, setAppState } = useContext(AppContext);
  const { employees } = appState;

  // static contextType = StateContext;
  // context!: React.ContextType<typeof StateContext>;

  useEffect(() => {
    fetchEmployees().then(
      (employees) => {
        setAppState({ ...appState, employees });
      },
      (err) => {
        alert(err);
      }
    );
  }, []);
  
  if (!employees.length) {
    return <div>There are no employees yet!</div>;
  }

  return (
    <ListGroup>
      {employees.map((employee) => (
        <ListGroupItem key={employee.id}>
          <Link to={`/employees/${employee.id}`}>Employee #{employee.id}</Link>
        </ListGroupItem>
      ))}
      <ListGroupItem>
        <Link to={`employees/nope`}>
          Employee that doesn't exist redirects to /employees!
        </Link>
      </ListGroupItem>
    </ListGroup>
  );
}
