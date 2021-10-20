import { Router, Request, Response } from "express";
import {
  deleteEmployee,
  getEmployeeByNameAndGender,
  getEmployeeDetails,
  getEmployees,
  getEmployeesByDep,
  getEmployeesByJob,
  getHighestPaid,
  updateEmployeesJobTitle,
  updateEmployeesSalary,
} from "../db/queries";
import { EmployeeModel } from "../models/employee.model";
import { DepartmentModel } from "./../models/department.model";

export const employeeRouter = Router();

employeeRouter.get(
  "/job/:job",
  async (
    req: Request<{ job: string }, any, any, any>,
    res: Response<EmployeeModel[]>
  ) => {
    const job = req.params.job;

    if (typeof job !== "string") {
      return res.sendStatus(400);
    }
    const employees = await getEmployeesByJob(job);
    res.send(employees);
  }
);
employeeRouter.get(
  "/department/:department",
  async (
    req: Request<{ department: string }, any, any, any>,
    res: Response<DepartmentModel>
  ) => {
    const departmentName = req.params.department;

    if (typeof departmentName !== "string") {
      return res.sendStatus(400);
    }
    const department = await getEmployeesByDep(departmentName);
    res.send(department);
  }
);
employeeRouter.get(
  "/highestPaid/:amountOfEmployees",
  async (
    req: Request<{ amountOfEmployees: string }, any, any, any>,
    res: Response<EmployeeModel[]>
  ) => {
    const amountOfEmployees = req.params.amountOfEmployees;

    const numOfEmployees = Number(amountOfEmployees);
    if (isNaN(numOfEmployees)) {
      return res.sendStatus(400);
    }

    const employees = await getHighestPaid(numOfEmployees);
    res.send(employees);
  }
);
employeeRouter.get(
  "/search",
  async (
    req: Request<
      any,
      any,
      any,
      { firstName: string; lastName: string; gender: "M" | "F" }
    >,
    res: Response<EmployeeModel[]>
  ) => {
    const searchParam = req.query;

    if (
      searchParam.firstName.length === 0 &&
      searchParam.lastName.length === 0
    ) {
      return res.sendStatus(400);
    }

    const employees = await getEmployeeByNameAndGender(searchParam);
    res.send(employees);
  }
);

employeeRouter.get(
  "/:id",
  async (req: Request<{ id: string }>, res: Response<EmployeeModel>) => {
    const { id } = req.params;

    const idAsNumber = Number(id);
    if (isNaN(idAsNumber)) {
      return res.sendStatus(400);
    }
    const employee = await getEmployeeDetails(idAsNumber);

    res.send(employee);
  }
);

employeeRouter.get(
  "/",
  async (req: Request, res: Response<EmployeeModel[]>) => {
    const employees = await getEmployees();
    res.send(employees);
  }
);

employeeRouter.put(
  "/job/:employeeId",
  async (
    req: Request<{ employeeId: string }, any, { newJob: string }, any>,
    res: Response<{ affectedRows: number }>
  ) => {
    const { employeeId: id } = req.params;
    const { newJob } = req.body;
    const numId = Number(id);
    if (isNaN(numId)) return res.sendStatus(400);
    const affectedRows = await updateEmployeesJobTitle(newJob, numId);

    res.send(affectedRows);
  }
);
employeeRouter.put(
  "/salary/:employeeId",
  async (
    req: Request<{ employeeId: string }, any, { newSalary: number }, any>,
    res: Response<{ affectedRows: number }>
  ) => {
    const { employeeId: id } = req.params;
    const { newSalary } = req.body;
    const numId = Number(id);
    if (isNaN(numId)) return res.sendStatus(400);
    const affectedRows = await updateEmployeesSalary(newSalary, numId);
    res.send(affectedRows);
  }
);
employeeRouter.delete(
  "/:employeeId",
  async (
    req: Request<{ employeeId: string }, any, any, any>,
    res: Response<boolean>
  ) => {
    const { employeeId: id } = req.params;
    const numId = Number(id);
    if (isNaN(numId)) return res.sendStatus(400);
    const wasDeleted = await deleteEmployee(numId);
    res.send(wasDeleted);
  }
);
