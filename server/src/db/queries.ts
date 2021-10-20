import { db } from "./db";
import { RowDataPacket } from "mysql2";
import { EmployeeModel } from "../models/employee.model";
import { DepartmentModel } from "./../models/department.model";

// this is the type we use for db.query
type DbQueryResult<TableRecord> = (TableRecord & RowDataPacket)[];

export async function getEmployees(): Promise<EmployeeModel[]> {
  const [employees] = await db.query<DbQueryResult<EmployeeModel>>(
    "SELECT emp_no id, first_name firstName FROM Employees LIMIT 10"
  );
  // we need to cast the result to be without RowDataPacket
  return employees as EmployeeModel[];
}

// List all employees with a specific job title (using a drop-down list populated dynamically from the datbase)

export async function getEmployeesByJob(job: string): Promise<EmployeeModel[]> {
  const [employees] = await db.query<DbQueryResult<EmployeeModel>>(
    "SELECT a.emp_no id ,first_name firstName, last_name lastName, title FROM employees.employees a inner join employees.titles b on a.emp_no = b.emp_no where title=? limit 10;",
    [job]
  );

  // we need to cast the result to be without RowDataPacket
  return employees as EmployeeModel[];
}
// List all employees in a specific department, and the department's manager
//(using a drop - down list populated dynamically from the database)

export async function getDepartments(): Promise<string[]> {
  const [[departments]] = await db.query<DbQueryResult<string[]>>(
    "Select distinct dept_name from employees.departments"
  );
  return departments as string[];
}

export async function getEmployeesByDep(
  departmentName: string
): Promise<DepartmentModel> {
  console.log(`departmentName`, departmentName);
  const [employees] = await db.query<DbQueryResult<EmployeeModel>>(
    `SELECT b.emp_no id,first_name firstName, last_name lastName
     From (((select dept_no from employees.departments where dept_name =? ) a
     Left Join employees.dept_emp b on a.dept_no = b.dept_no)
     Left Join employees.employees c on b.emp_no = c.emp_no) limit 20`,
    [departmentName]
  );
  console.log(`employees`, employees);
  const [managers] = await db.query<DbQueryResult<EmployeeModel>>(
    `SELECT b.emp_no managerId, first_name,last_name ,a.dept_name
     FROM ((select dept_no,dept_name from employees.departments where dept_name = ?) a
     left join employees.dept_manager b on a.dept_no = b.dept_no)
     left join employees.employees c on b.emp_no = c.emp_no limit 20;
     `,
    [departmentName]
  );
  // we need to cast the result to be without RowDataPacket

  const department = { name: departmentName, managers, employees };
  return department as DepartmentModel;
}

// List the highest top X paid employees (where X is provided by the user's input)

export async function getHighestPaid(
  numOfEmp: number
): Promise<EmployeeModel[]> {
  const [employees] = await db.query<DbQueryResult<EmployeeModel>>(
    `Select a.emp_no id, first_name firstName ,last_name lastName,salary from
(SELECT * FROM employees.salaries where YEAR(to_date) > Year(current_date()) order by salary desc limit ?)
a inner join employees.employees b on a.emp_no = b.emp_no `,
    [numOfEmp]
  );
  return employees as EmployeeModel[];
}

// Search employees across the entire company by their first name, last name and gender - 3 combined filters.
// The name inputs can be part of the full names.
export async function getEmployeeByNameAndGender(props: {
  firstName: string;
  lastName: string;
  gender: "M" | "F";
}): Promise<EmployeeModel[]> {
  const { firstName, lastName, gender } = props;
  const [employees] = await db.query<DbQueryResult<EmployeeModel>>(
    `Select emp_no id, first_name firstName ,last_name lastName from employees.employees 
    where gender=? AND first_name like ? And last_name like ? `,
    [gender, firstName.concat("%"), lastName.concat("%")]
  );
  return employees as EmployeeModel[];
}

//DETAILS PAGE

// All of the lists will show the first and last names of the relevant employees in table rows, where each row would also be a link to a fully detailed record page of the employee
//- employee #, birth date, first name, last name, gender, hire date, title, department and salary.
//An employee's details page should also have deep link (URL) which is accessible directly
// by specifying the employee number, e.g. / employees / 345

export async function getEmployeeDetails(id: number): Promise<EmployeeModel> {
  const [[employee]] = await db.query<DbQueryResult<EmployeeModel>>(
    `Select a.emp_no id, first_name firstName ,last_name lastName, birth_date birthDate, gender,hire_date hireDate, salary,dept_name department,title from
(((Select emp_no, first_name ,last_name, birth_date , gender,hire_date from employees.employees where emp_no = ?) a
 left join employees.salaries b on a.emp_no = b.emp_no and YEAR(to_date) > Year(current_date())) 
 left join employees.dept_emp c on a.emp_no = c.emp_no )
 left join employees.departments d on c.dept_no = d.dept_no
 left join employees.titles e on a.emp_no = e.emp_no  and YEAR(e.to_date) > Year(current_date())`,
    [id]
  );

  return employee as EmployeeModel;
}

// change the salary of the employee (using a user's input)

export async function updateEmployeesSalary(
  id: number,
  newSalary: number
): Promise<{ affectedRows: number }> {
  const [[result]] = await db.query<DbQueryResult<{ affectedRows: number }>>(
    `UPDATE employees.salaries a
    SET to_date =current_date() 
    WHERE emp_no = ?;

    INSERT INTO employees.salaries (emp_no, salary, from_date, to_date)
    VALUES (?, ?, current_date(),date(9999-01-01));
    `,

    [id, id, newSalary]
  );
  console.log(result);
  return result as { affectedRows: number };
}

// change the title of the employee (using a drop-down list populated dynamically with already existing titles in the database)
export async function getJobTitles(): Promise<string[]> {
  const [[titles]] = await db.query<DbQueryResult<string[]>>(
    "Select distinct title from employees.titles"
  );
  return titles as string[];
}

export async function updateEmployeesJobTitle(
  title: string,
  id: number
): Promise<{ affectedRows: number }> {
  const [[result]] = await db.query<DbQueryResult<{ affectedRows: number }>>(
    `UPDATE employees.titles a
    SET title =? 
    WHERE emp_no = ?;
    `,

    [title, id]
  );
  console.log(result);
  return result as { affectedRows: number };
}

// fire the employee

export async function deleteEmployee(id: number): Promise<boolean> {
  const [affectedRows] = await db.query<
    DbQueryResult<[{ affectedRows: number }]>
  >(
    `
    DELETE FROM employees.employees t1 WHERE t1.emp_no=?;
    DELETE FROM employees.dept_emp t1 WHERE t1.emp_no=?;
    DELETE FROM employees.dept_manager t1 WHERE t1.emp_no=?;
    DELETE FROM employees.salaries t1 WHERE t1.emp_no=?;
    DELETE FROM employees.titles t1 WHERE t1.emp_no=?;
    `,

    [id, id, id, id, id]
  );
  let wasDeleted = false;
  if (typeof affectedRows === "number") wasDeleted = affectedRows > 0;

  return wasDeleted;
}
