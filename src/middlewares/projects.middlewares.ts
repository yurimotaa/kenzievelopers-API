import { Request, Response } from "express";
import { NextFunction } from "express";
import { QueryConfig, QueryResult } from "pg";
import { client } from "../database";
import {
  INameTechnologie,
  IProject,
  TProjectRequest,
} from "../interfaces/projects.interfaces";

const checkDeveloperIdExists = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<Response | void> => {
  const requestBody: TProjectRequest = request.body;
  const id = requestBody.developerId;

  const queryString: string = `
      select * from developers 
      where id = $1;
    `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult: QueryResult<IProject> = await client.query(queryConfig);

  if (queryResult.rowCount === 0) {
    return response.status(404).json({
      message: "Developer not found.",
    });
  }

  return next();
};

const checkIdProjectExists = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<Response | void> => {
  const id = parseInt(request.params.id);

  const queryString: string = `
    select * from projects 
    where id = $1;
  `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult: QueryResult<IProject> = await client.query(queryConfig);

  if (queryResult.rowCount === 0) {
    return response.status(404).json({
      message: "Project not found.",
    });
  }

  return next();
};

const checkTechnologyName = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<Response | void> => {
  const requestBody: INameTechnologie = request.body;
  const techName: string = requestBody.name;

  const queryString: string = `
    SELECT id
    FROM technologies
    WHERE name = $1
  `;

  const queryResult: QueryResult = await client.query(queryString, [techName]);

  if (queryResult.rowCount === 0) {
    return response.status(400).json({
      message: "Technology not supported.",
      options: [
        "JavaScript",
        "Python",
        "React",
        "Express.js",
        "HTML",
        "CSS",
        "Django",
        "PostgreSQL",
        "MongoDB",
      ],
    });
  }

  response.locals.techId = queryResult.rows[0].id;

  return next();
};

export { checkDeveloperIdExists, checkIdProjectExists, checkTechnologyName };
