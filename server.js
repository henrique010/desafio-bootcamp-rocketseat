const express = require('express');

const server = express();

server.use(express.json());

let numberOfRequisitions = 0;
const projects = [];

function numberOfRequests(req, res, next) {
  numberOfRequisitions += 1;
  console.log(`Number of requests: ${numberOfRequisitions}`);

  return next();
}

server.use(numberOfRequests);

function projectExists(req, res, next) {
  const { id } = req.params;

  const index = projects.findIndex(project => project.id === id);

  if (index < 0) {
    return res.status(400).json({ error: 'Project not found' })
  }

  req.index = index;

  return next();
}

server.get('/projects', (req, res) => {
  return res.json(projects);
});

server.post('/projects', (req, res) => {
  const { id, title } = req.body;

  projects.push({ id, title, tasks: [] });

  return res.json(projects);
});

server.put('/projects/:id', projectExists, (req, res) => {
  const { title } = req.body;

  projects[req.index].title = title;

  return res.json(projects);
});

server.delete('/projects/:id', projectExists, (req, res) => {
  projects.splice(req.index, 1);

  return res.send();
});

server.post('/projects/:id/tasks', projectExists, (req, res) => {
  const { title } = req.body;

  project = projects[req.index];

  project.tasks.push(title);

  return res.json(project);
});


server.listen(3000);