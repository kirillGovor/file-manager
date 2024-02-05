import { join } from "path";

export const renderPath = (currentPath: string, alternativePath: string) => {
  if (currentPath.includes(alternativePath)) {
    return `${currentPath}`.trim();
  }
  return join(currentPath, alternativePath).trim();
};
