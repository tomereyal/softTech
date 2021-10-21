import axios from "axios";
import React, { useContext, useEffect } from "react";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import { Link } from "react-router-dom";
import { EmployeeModel } from "../../models/employee.model";
import AppContext from "../../app-context";
import { fetchEmployees } from "../../api";
import { Table } from "antd";

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

  const dataSource = employees.map((e: EmployeeModel) => {
    return { ...e, ["key"]: e.id };
  });
  //  [
  //   {
  //     key: '1',
  //     name: 'Mike',
  //     age: 32,
  //     address: '10 Downing Street',
  //   },
  //   {
  //     key: '2',
  //     name: 'John',
  //     age: 42,
  //     address: '10 Downing Street',
  //   },
  // ];

  const columns = [
    {
      title: "First Name",
      dataIndex: "firstName",
      key: "firstName",
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
      key: "lastName",
    },
    {
      title: "Get Details",
      dataIndex: "id",
      key: "id",
    },
  ];

  return (
    <>
      <ListGroup>
        {employees.map((employee) => (
          <ListGroupItem key={employee.id}>
            <Link to={`/employees/${employee.id}`}>
              Employee #{employee.id}
            </Link>
          </ListGroupItem>
        ))}
        <ListGroupItem>
          <Link to={`employees/nope`}>
            Employee that doesn't exist redirects to /employees!
          </Link>
        </ListGroupItem>
      </ListGroup>
      <Table dataSource={dataSource} columns={columns} />
    </>
  );
}
