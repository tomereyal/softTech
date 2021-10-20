import axios from "axios";
import { EmployeeModel } from "./models/employee.model";

export const fetchEmployees = async () => {
  const { data: employees } = await axios.get<EmployeeModel[]>(
    "http://localhost:4000/api/employees"
  );
  return employees;
};
export const fetchEmployee = async (id: number) => {
  const { data: employee } = await axios.get<EmployeeModel>(
    `http://localhost:4000/api/employees/${id}`
  );
  return employee;
};
