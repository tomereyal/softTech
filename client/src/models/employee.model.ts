export interface EmployeeModel {
  id: number;
  firstName: string;
  lastName: string;
  department?: string;
  salary?: number;
  gender?: "M" | "F";
  birthDate?: string;
  title?: string;
}
