import { GraphQLError } from "graphql";
import { MyContext } from "../server";
import { v4 as uuidv4 } from "uuid";
import { Cast, Movie, MovieCast } from "./types";
import { INSERT_CAST_ERROR, NO_CAST_MESSAGE } from "../common/errorMessages";

export async function getCast(
  movie_id: any,
  context: MyContext
): Promise<Cast[]> {
  const sql = `SELECT c.id,c.name,c.photo,c.description FROM cast c JOIN movie_cast mc ON c.id = mc.cast_id WHERE mc.movie_id = ?`;
  return new Promise((resolve, reject) => {
    context.db.query(sql, [movie_id], (err: any, res: any) => {
      if (err) {
        reject(err);
      }
      if(res) resolve(res);
    });
  });
}

export async function getCastById(
  id: any,
  context: MyContext
): Promise<Cast | null> {
  const sql = `SELECT * FROM cast WHERE id = ?`;
  return new Promise((resolve, reject) => {
    context.db.query(sql, [id], (err: any, res: any) => {
      if (err) {
        reject(err);
      }
      if(res) resolve(res[0]);
    });
  });
}

export async function checkForCast(
  name: any,
  context: MyContext
): Promise<Cast | undefined> {
  const sql = `SELECT * FROM cast WHERE name = ?`;
  return new Promise((resolve, reject) => {
    context.db.query(sql, [name], (err: any, res: any) => {
      if (err) {
        reject(err);
      }
      if(res) resolve(res[0]);
    });
  });
}

export async function getMoviesOfCast(
  id: any,
  context: MyContext
): Promise<Movie[]> {
  const sql = `SELECT m.* FROM movie m JOIN movie_cast mc ON m.id = mc.movie_id JOIN cast c ON mc.cast_id = c.id WHERE c.id = ?`;
  return new Promise((resolve, reject) => {
    context.db.query(sql, [id], (err: any, res: any) => {
      if (err) {
        reject(err);
      }
      if(res) resolve(res);
    });
  });
}

export async function createCast(
  input: any,
  context: MyContext
): Promise<Cast & Omit<MovieCast, "cast_id">> {
  let id = "";
  const cast = await checkForCast(input.name, context);
  if (cast !== undefined) id = cast.id;
  else {
    id = uuidv4();
    const sqlCast = "INSERT INTO `cast` (id,name,photo,description) VALUES (?,?,?,?)";
    const res = context.db.query(sqlCast, [
      id,
      input.name,
      input.photo,
      input.description,
    ]);
    context.db.database.commit()
  }
  const sqlConn = `INSERT INTO movie_cast (movie_id,cast_id) VALUES(?,?)`;
  context.db.query(sqlConn, [input.movie_id,id]);
  return {
    id: id,
    name: input.name,
    photo: input.photo,
    description: input.description,
    movie_id: input.movie_id,
  };
}

export async function updateCast(
  input: any,
  context: MyContext
): Promise<Cast> {
  const cast = await getCastById(input.id, context);
  if (!cast)
    throw new GraphQLError(NO_CAST_MESSAGE, {
      extensions: { code: "NOT_FOUND" },
    });
  const sql = `UPDATE cast SET name = ?, description = ? WHERE id = ?`;
  context.db.query(sql, [input.name, input.description, input.id]);
  return {
    id: input.id,
    name: input.name,
    photo: cast.photo,
    description: input.description,
  };
}

export async function deleteCast(
  input: any,
  context: MyContext
): Promise<Cast & Omit<MovieCast, "cast_id">> {
  const cast = await getCastById(input.id, context);
  if (!cast)
    throw new GraphQLError(NO_CAST_MESSAGE, {
      extensions: { code: "NOT_FOUND" },
    });
  const sqlConn = `DELETE FROM movie_cast WHERE cast_id = ? AND movie_id = ?`;
  const res = context.db.query(sqlConn, [input.id, input.movie_id]);
  if (!res) throw new GraphQLError("delete rror");
  return {
    id: cast.id,
    name: cast.name,
    photo: cast.photo,
    description: cast.description,
    movie_id: input.movie_id || "",
  };
}
