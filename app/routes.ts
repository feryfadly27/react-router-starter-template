import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("consent", "routes/consent.tsx"),
  route("kuesioner/:step", "routes/kuesioner.$step.tsx"),
  route("submit", "routes/submit.tsx"),
  route("hasil/:id", "routes/hasil.$id.tsx"),
  route("admin", "routes/admin.tsx"),
  route("terima-kasih", "routes/terima-kasih.tsx"),
] satisfies RouteConfig;
