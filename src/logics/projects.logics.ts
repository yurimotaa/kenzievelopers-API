import { Request, Response } from "express";
import {
  INameTechnologie,
  IProject,
  IProject_technologyResponse,
  TProjectRequest,
} from "../interfaces/projects.interfaces";
import format from "pg-format";
import { QueryConfig, QueryResult } from "pg";
import { client } from "../database";

const createProject = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const requestBody: TProjectRequest = request.body;
  const id = requestBody.developerId;

  let endDate: Date | null;
  if (requestBody.endDate !== undefined) {
    endDate = requestBody.endDate;
  } else {
    endDate = null;
  }

  const queryString: string = format(
    `
        insert into 
        projects (%I)
        values 
            (%L)
        returning *;
    `,
    Object.keys(requestBody),
    Object.values(requestBody)
  );

  const queryResult: QueryResult<IProject> = await client.query(queryString);

  return response.status(201).json(queryResult.rows[0]);
};

const getProjectById = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const id = parseInt(request.params.id);

  const queryString: string = `
  SELECT 
    projects.id AS "projectId",
    projects.name AS "projectName",
    projects.description  AS "projectDescription",
    projects."estimatedTime"  AS "projectEstimatedTime",
    projects.repository  AS "projectRepository",
    projects."startDate"  AS "projectStartDate",
    projects."endDate"  AS "projectEndDate",
    projects."developerId"  AS "projectDeveloperId",
    projects_technologies."technologyId" AS "technologyId",
    technologies.name AS "technologyName"
  FROM 
    projects
  LEFT JOIN 
    projects_technologies ON projects.id = projects_technologies."projectId"
  LEFT JOIN
    technologies ON projects_technologies."technologyId" = technologies.id
  WHERE 
    projects.id = $1;
  `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult: QueryResult = await client.query(queryConfig);

  return response.status(200).json(queryResult.rows[0]);
};

const updateProject = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const requestBody: Partial<TProjectRequest> = request.body;
  const id = parseInt(request.params.id);

  const queryString: string = format(
    `
    update projects 
    SET(%I) = ROW(%L)
    where "id" = $1
    RETURNING *;
  `,
    Object.keys(requestBody),
    Object.values(requestBody)
  );

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult: QueryResult<IProject> = await client.query(queryConfig);

  return response.status(200).json(queryResult.rows);
};

const deleteProject = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const id = parseInt(request.params.id);

  const queryString: string = `
    delete from projects 
    where id = $1;
  `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult: QueryResult<IProject> = await client.query(queryConfig);

  return response.status(204).send();
};

const addTechnologieToProject = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const id: number = parseInt(request.params.id);
  const techId: number = response.locals.techId;

  const data = {
    addedIn: new Date(),
    technologyId: techId,
    projectId: id,
  };

  const queryString: string = format(
    `
    insert into 
      projects_technologies (%I)
    values 
      (%L)
    returning *;

  `,
    Object.keys(data),
    Object.values(data)
  );

  const queryResult: QueryResult = await client.query(queryString);

  const selectQueryString: string = `
  SELECT 
    projects_technologies."technologyId",
    technologies.name AS "technologyName",
    projects_technologies."projectId",
    projects.name AS "projectName",
    projects."description" AS "projectDescription",
    projects."estimatedTime" AS "projectEstimatedTime",
    projects."repository" AS "projectRepository",
    projects."startDate" AS "projectStartDate",
    projects."endDate" AS "projectEndDate"
  FROM 
    projects_technologies
  JOIN 
    projects ON projects.id = projects_technologies."projectId"
  JOIN 
    technologies ON technologies.id = projects_technologies."technologyId"
  WHERE 
    projects.id = $1 AND technologies.id = $2;
`;

  const selectQueryResult: QueryResult<IProject_technologyResponse> =
    await client.query(selectQueryString, [id, techId]);

  return response.status(201).json(selectQueryResult.rows[0]);
};

export {
  createProject,
  updateProject,
  deleteProject,
  getProjectById,
  addTechnologieToProject,
};
