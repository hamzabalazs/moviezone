import { GraphQLError } from "graphql";
import { MyContext } from "../server";
import { v4 as uuidv4 } from "uuid";
import { Cast, Movie, MovieCast } from "./types";
import { INSERT_CAST_ERROR, NO_CAST_MESSAGE } from "../../mozi-frontend/src/common/errorMessages";

export async function getCast(movie_id:any,context:MyContext): Promise<Cast[]>{
    const sql = `SELECT c.id,c.name,c.photo,c.description FROM cast c JOIN movie_cast mc ON c.id = mc.cast_id WHERE mc.movie_id = ?`
    return context.db.all<Cast>(sql,[movie_id])
}

export async function getCastById(id:any,context:MyContext): Promise<Cast|null> {
    const sql = `SELECT * FROM cast WHERE id = ?`
    return context.db.get(sql,[id])
}

export async function checkForCast(name:any,context:MyContext): Promise<Cast | null>{
    const sql = `SELECT * FROM cast WHERE name = ?`
    return context.db.get<Cast>(sql,[name])
}

export async function getMoviesOfCast(id:any,context:MyContext):Promise<Movie[]> {
    const sql = `SELECT m.id,m.title,m.description,m.release_date,m.poster FROM movie m JOIN movie_cast mc ON m.id = mc.movie_id JOIN cast c ON mc.cast_id = c.id WHERE c.id = ?`
    return context.db.all<Movie>(sql,[id])
}

export async function createCast(input:any,context:MyContext):Promise<Cast & Omit<MovieCast,"cast_id">>{
    let id = ""
    const cast = await checkForCast(input.name,context)
    if(cast) id = cast.id;
    else{
        id = uuidv4()
        const sqlCast = `INSERT INTO cast(id,name,photo,description) VALUES (?,?,?,?)`
        const res = await context.db.run(sqlCast,[id,input.name,input.photo,input.description])
        if(!res) throw new GraphQLError(INSERT_CAST_ERROR,{extensions:{code:"INSERT_ERROR"}})   
    }
    const sqlConn = `INSERT INTO movie_cast(movie_id,cast_id) VALUES(?,?)`
    await context.db.run(sqlConn,[input.movie_id,id])
    return {
        id:id,
        name:input.name,
        photo:input.photo,
        description:input.description,
        movie_id:input.movie_id
    };
}

export async function updateCast(input:any,context:MyContext):Promise<Cast> {
    const cast = await getCastById(input.id,context)
    if(!cast) throw new GraphQLError(NO_CAST_MESSAGE,{extensions:{code:"NOT_FOUND"}})
    const sql = `UPDATE cast SET name = ?, description = ? WHERE id = ?`
    await context.db.run(sql,[input.name,input.description,input.id])
    return {
        id:input.id,
        name:input.name,
        photo:cast.photo,
        description:input.description
    };
}

export async function deleteCast(input:any,context:MyContext): Promise<Cast & Omit<MovieCast,"cast_id">>{
    const cast = await getCastById(input.id,context);
    if(!cast) throw new GraphQLError(NO_CAST_MESSAGE,{extensions:{code:"NOT_FOUND"}})
    const sqlConn = `DELETE FROM movie_cast WHERE cast_id = ? AND movie_id = ?`
    const res = await context.db.run(sqlConn,[input.id,input.movie_id])
    console.log("resut",res)
    if(!res) throw new GraphQLError("delete rror")
    return {
        id:cast.id,
        name:cast.name,
        photo:cast.photo,
        description:cast.description,
        movie_id:input.movie_id || "",
    };
}