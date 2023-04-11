import customCommands from './commands'

export const commands = customCommands
export const baseUrl = 'http://localhost:3000/'
export const graphQlUrl = 'http://localhost:5000/graphql'

export const testMovie = {
    title: "test",
    description: "test",
    poster: "poster",
    release_date: "2022-02-02",
    category_id: "570d66a7-449e-4d28-b61a-bcff1fc4dfdc",
  };

export const adminCredentials = {
    email:"cypress.admin@example.com",
    password:"admin"
}

export const editorCredentials = {
    email:"editor@example.com",
    password:"editor"
}

export const viewerCredentials = {
    email:"viewer@example.com",
    password:"viewer"
}