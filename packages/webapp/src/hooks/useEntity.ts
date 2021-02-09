import { useSelector } from "react-redux";
import { commentSelectors } from "../store/entities/comments";
import { listSelectors } from "../store/entities/lists";
import { taskSelectors } from "../store/entities/tasks";
import { userSelectors } from "../store/entities/users";
import { workspaceSelectors } from "../store/entities/workspaces";
import { EntityNames } from "../store/types";

const selectors = {
  ["comments" as const]: commentSelectors.selectById,
  ["lists" as const]: listSelectors.selectById,
  ["tasks" as const]: taskSelectors.selectById,
  ["users" as const]: userSelectors.selectById,
  ["workspaces" as const]: workspaceSelectors.selectById,
};


type PossibleEntities = `${EntityNames}`

export const useEntity = <EntityType extends PossibleEntities>(
  entityType: EntityType,
  entityId: string
):ReturnType<( typeof selectors[EntityType])> => {
  const entity = useSelector((state) => selectors[entityType](state, entityId));
  return entity as ReturnType<( typeof selectors[EntityType])>;
};

export const useEntities = <EntityType extends PossibleEntities>(
  entityType: EntityType,
  idArray: string[]
):ReturnType<( typeof selectors[EntityType])>[] => {
  const entities = useSelector((state) => idArray.map(id=>selectors[entityType](state, id)));
  return entities as ReturnType<( typeof selectors[EntityType])>[];
};