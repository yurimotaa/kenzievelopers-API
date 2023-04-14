import { Request, Response } from "express";
import {
  ICompleteDeveloper,
  IDeveloper,
  IDeveloperInfo,
  TDeveloperInfoRequest,
  TDeveloperRequest,
} from "../interfaces/developers.interfaces";
import format from "pg-format";
import { QueryConfig, QueryResult } from "pg";
import { client } from "../database";

const createDeveloper = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const requestBody: TDeveloperRequest = request.body;

  const queryString: string = format(
    `
        insert into 
        developers (%I)
        values 
            (%L)
        returning *;
    `,
    Object.keys(requestBody),
    Object.values(requestBody)
  );

  const queryResult: QueryResult<IDeveloper> = await client.query(queryString);

  return response.status(201).json(queryResult.rows[0]);
};

const createDeveloperInfo = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const id = parseInt(request.params.id);
  const requestBody: TDeveloperInfoRequest = request.body;

  if (!["Windows", "Linux", "MacOS"].includes(requestBody.preferredOS)) {
    return response.status(400).json({
      message: "Invalid OS option.",
      options: ["Windows", "Linux", "MacOS"],
    });
  }

  const info = {
    ...requestBody,
    developerId: id,
  };

  const queryString: string = format(
    `
    insert into 
    developer_infos (%I)
    values 
        (%L)
    returning *;
  `,
    Object.keys(info),
    Object.values(info)
  );

  const queryResult: QueryResult<IDeveloperInfo> = await client.query(
    queryString
  );

  return response.status(201).json(queryResult.rows[0]);
};

const getDeveloperById = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const id: number = parseInt(request.params.id);

  const queryString: string = `
  SELECT 
    developers.id AS "developerId",
    developers.name AS "developerName",
    developers.email AS "developerEmail",
    developer_infos."developerSince" AS "developerInfoDeveloperSince",
    developer_infos."preferredOS" AS "developerInfoPreferredOS"
  FROM 
    developers
  LEFT JOIN 
    developer_infos ON developers.id = developer_infos."developerId"
  WHERE 
    developers.id = $1;
  `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult: QueryResult<ICompleteDeveloper> = await client.query(
    queryConfig
  );

  return response.status(200).json(queryResult.rows[0]);
};

const updateDeveloper = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const requestBody: TDeveloperRequest = request.body;
  const id = parseInt(request.params.id);

  const queryString: string = format(
    `
      update developers 
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

  const queryResult: QueryResult<IDeveloper> = await client.query(queryConfig);

  return response.status(200).json(queryResult.rows[0]);
};

const deleteDeveloper = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const id = parseInt(request.params.id);

  const queryString: string = `
    delete from developers 
    where id = $1;
  `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult: QueryResult<IDeveloper> = await client.query(queryConfig);

  return response.status(204).send();
};

export {
  createDeveloper,
  createDeveloperInfo,
  getDeveloperById,
  deleteDeveloper,
  updateDeveloper,
};
