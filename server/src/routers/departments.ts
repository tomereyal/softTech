import { Router, Request, Response } from "express";
import { getDepartments } from "../db/queries";

export const departmentRouter = Router();

departmentRouter.get("/", async (req: Request, res: Response<string[]>) => {
  const departments = await getDepartments();
  return departments;
});
