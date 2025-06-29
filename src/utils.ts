// utils.ts

import { ConditionGroup } from "./types";

// Generate unique ID
export const generateId = () => Math.random().toString(36).substring(2, 9);

// Recursive group updater
export const updateGroup = (
  group: ConditionGroup,
  path: string[],
  update: Partial<ConditionGroup> | ((group: ConditionGroup) => ConditionGroup)
): ConditionGroup => {
  if (path.length === 0) {
    return typeof update === "function"
      ? update(group)
      : { ...group, ...update };
  }

  const [id, ...restPath] = path;
  const newConditions = group.conditions.map((item) => {
    if (item.id !== id) return item;
    if ("logic" in item) {
      return updateGroup(item as ConditionGroup, restPath, update);
    }
    return item;
  });

  return { ...group, conditions: newConditions };
};

export const findGroup = (
  group: ConditionGroup,
  path: string[]
): ConditionGroup | null => {
  if (path.length === 0) return group;
  const [id, ...restPath] = path;
  const found = group.conditions.find((item) => item.id === id);
  if (!found || !("logic" in found)) return null;
  return findGroup(found as ConditionGroup, restPath);
};
