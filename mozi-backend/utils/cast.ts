import { GraphQLError } from "graphql";
import { MyContext } from "../server";
import { v4 as uuidv4 } from "uuid";
import { Cast, MovieCast } from "./types";

export async function getCast(movie_id:any,context:MyContext): Promise<Cast[]>{
    const sql = `SELECT * FROM cast c JOIN movie_cast mc ON c.id = mc.cast_id WHERE mc.movie_id = ?`
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

export async function createCast(input:any,context:MyContext):Promise<Cast & Omit<MovieCast,"cast_id">>{
    let id = ""
    const cast = await checkForCast(input.name,context)
    if(cast) id = cast.id;
    else{
        id = uuidv4()
        const sqlCast = `INSERT INTO cast(id,name,photo) VALUES (?,?,?)`
        const res = await context.db.run(sqlCast,[id,input.name,input.photo])
        if(!res) throw new GraphQLError('CAST INSERT ERROR',{extensions:{code:"INSERT_ERROR"}})   
    }
    const sqlConn = `INSERT INTO movie_cast(movie_id,cast_id) VALUES(?,?)`
    await context.db.run(sqlConn,[input.movie_id,id])
    return {
        id:id,
        name:input.name,
        photo:input.photo,
        movie_id:input.movie_id
    };
}

export async function updateCast(input:any,context:MyContext):Promise<Cast> {
    const cast = await getCastById(input.id,context)
    if(!cast) throw new GraphQLError("No cast member found",{extensions:{code:"NOT_FOUND"}})
    const sql = `UPDATE cast SET name = ? WHERE id = ?`
    await context.db.run(sql,[input.name,input.id])
    return {
        id:input.id,
        name:input.name,
        photo:cast.photo,
    };
}

export async function deleteCast(input:any,context:MyContext): Promise<Cast & Omit<MovieCast,"cast_id">>{
    const cast = await getCastById(input.id,context);
    if(!cast) throw new GraphQLError("No cast member found",{extensions:{code:"NOT_FOUND"}})
    const sql = `DELETE FROM cast WHERE id = ?`
    await context.db.run(sql,[input.id])
    return {
        id:cast.id,
        name:cast.name,
        photo:cast.photo,
        movie_id:input.movie_id || "",
    };
}