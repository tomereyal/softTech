import { Router, Request, Response } from "express";
import { getJobTitles } from "../db/queries";

export const jobRouter = Router();

jobRouter.get("/", async (req: Request, res: Response<string[]>) => {
  const jobs = await getJobTitles();
  return jobs;
});
