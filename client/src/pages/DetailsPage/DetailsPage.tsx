import React, { useContext, useEffect, useState } from "react";
import { Redirect, useHistory } from "react-router";
import { Link } from "react-router-dom";
import { fetchEmployee } from "../../api";
import AppContext from "../../app-context";
import { EmployeeModel } from "../../models/employee.model";

interface Props {
  id: string;
}

export default function DetailsPage(props: Props) {
  const { appState, setAppState } = useContext(AppContext);
  const [employee, setEmployee] = useState<EmployeeModel>();
  const { id } = props;
  const idAsNumber = Number(id);

  const { employees } = appState;
  // const employee = employees.find((e) => e.id === idAsNumber);
  let history = useHistory();
  useEffect(() => {
    fetchEmployee(idAsNumber).then(
      (employee) => {
        setEmployee(employee);
      },
      (err) => {
        alert(`Sorry an error has occured. ${err}`);

        history.push("/employees");
      }
    );
  }, [employees]);

  if (!employee) {
    return <div>loading</div>;
  }

  return (
    <div>
      <Link to="/employees">Back to Employee List</Link>
      <h6>Showing details for ID #{id}</h6>
      <p>{employee.firstName}</p>
      <p>{employee.lastName}</p>
      <p>{employee.salary}</p>
    </div>
  );
}
