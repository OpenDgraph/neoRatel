# neoRatel

UI tool for Dgraph Developers.
It is inspired by the existing functionalities of Ratel.

# Get started

- clone the repository
- `npm install` to install dependencies
- `npm run dev` to start a local server 

# Debugging

- `npm run debug` to start a local server in debug mode
- Go to Debug tab in VsCode and run the debug tool

# Use cases

**Application Developers** can 
- connect to Dgraph cluster on-prem or in Cloud
  - [x] providing an API key (cloud only)
  - [x] providing a user/password (on-prem or cloud with ACL)
  - [ ] providing a security token (on-prem with --security option)

- execute a DQL query and 
  - [x] see the result as JSON
  - [ ] see the result as Graph
  - [ ] see the result as Chart
  - [x] see the result as markers on a map
- [x] execute a DQL mutation
- [x] build a DQL query using an graphical editor

- execute a GraphQL query and 
  - [x] see the result as JSON
  - [ ] see the result as Graph
  - [ ] see the result as Chart
  - [ ] see the result as markers on a map
- [ ] execute a GraphQL mutation
- [ ] build a GraphQL query or mutation using an graphical editor

- Manage DQL Schema: 
  - [ ] create a DQL Schema
  - [ ] update DQL predicate definition (type and indexes)
  - [ ] Drop the DQL schema and all data
  - [ ] remove a predicate and drop associated data
  

- Manage Dgraph data: 
  - [ ] see the number of nodes having a specific predicate
  - [ ] Drop all data 
  - [ ] Drop data related to a predicate
   
  
# Technical stack
One of the motivation for this project is to have a UI tool for Application developers interacting with Dgraph, based on a recent technology stack, with few dependencies and easy to maintain.

The current stack is using
- zustand
- Vite 


# Technical tasks
- [x] Create a new project from scratch
- [x] Use Vite instead of create react app
- [x] Use zustand instead of Redux
- [ ] Organize the project in a better way
- [ ] Create charts - Export results from Zustand to the chart.
- [ ] Create a Proxy to handle cluster the requests
- [ ] Create a binary to run the build
- [ ] Create a Docker compose
- [ ] Create a CI/CD
- [ ] Create an exporter handler (RDF, JSON, CSV, etc)
- [ ] Create a schema builder
- [ ] Create a schema editor
- [ ] Create a schema viewer (As graphs, maybe it should be a builder, editor and viewer in one)
- [ ] Create a GraphQL handler/helper
- [ ] Create a Admin UI
- [ ] Create a Query builder with UI(in blocks)
