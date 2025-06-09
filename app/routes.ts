import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  layout("routes/layout.tsx", [
    index("routes/projects.tsx"),
    route("projects/:projectId/tasks/", "routes/tasks.tsx"),
  ]),
] satisfies RouteConfig;
