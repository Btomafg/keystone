import { APP_ROUTES } from "@/constants/routes";

export const useRouteEntries = () => {
  const flattenRoutes = (obj: any): { path: string; title: string }[] => {
    return Object.values(obj).flatMap((entry) => {
      if (entry?.path && entry?.title) return [entry];
      if (typeof entry === 'object') return flattenRoutes(entry);
      return [];
    });
  };
  return flattenRoutes(APP_ROUTES);
}