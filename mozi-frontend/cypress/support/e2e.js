import customCommands from './commands'

export const commands = customCommands
export const baseUrl = 'http://localhost:3000/'
export const graphQlUrl = 'http://localhost:5000/graphql'

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