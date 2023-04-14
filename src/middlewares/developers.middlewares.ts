import { NextFunction, Request, Response } from "express";
import { client } from "../database";
import { TDeveloperRequest } from "../interfaces/developers.interfaces";
import { QueryConfig, QueryResult } from "pg";
import { IDeveloper } from "../interfaces/developers.interfaces";

const checkEmailExists = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<Response | void> => {
  const bodyRequest: TDeveloperRequest = request.body;

  const queryString: string = `
    select * from developers 
    where email = $1;
  `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [bodyRequest.email],
  };

  const queryResult: QueryResult<IDeveloper> = await client.query(queryConfig);

  if (queryResult.rowCount > 0) {
    return response.status(409).json({
      message: "Email already exists.",
    });
  }

  return next();
};

const checkIdExists = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<Response | void> => {
  const id = parseInt(request.params.id);

  const queryString: string = `
    select * from developers 
    where id = $1;
  `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult: QueryResult<IDeveloper> = await client.query(queryConfig);

  if (queryResult.rowCount === 0) {
    return response.status(404).json({
      message: "Developer not found.",
    });
  }

  return next();
};

const checkDeveloperHaveInfo = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<Response | void> => {
  const id = parseInt(request.params.id);

  const queryString: string = `
    select * from developer_infos
    where "developerId" = $1;
  `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult: QueryResult<IDeveloper> = await client.query(queryConfig);

  if (queryResult.rowCount > 0) {
    return response.status(409).json({
      message: "Developer infos already exists.",
    });
  }

  return next();
};

export { checkEmailExists, checkIdExists, checkDeveloperHaveInfo };
