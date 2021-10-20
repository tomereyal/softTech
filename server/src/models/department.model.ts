import { EmployeeModel } from "./employee.model";

export interface DepartmentModel {
  //   id: string;
  name: string;
  managers?: EmployeeModel[];
  employees: EmployeeModel[];
}
