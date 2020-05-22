import { buildImageIndex } from "./image";
import { buildActorIndex } from "./actor";
import { buildStudioIndex } from "./studio";
import { buildMovieIndex } from "./movie";
import { buildSceneIndex } from "./scene";

export type CustomFieldFilter = {
  id: string;
  op: string;
  value: any;
};

export async function buildIndices() {
  await buildSceneIndex();
  await buildActorIndex();
  await buildMovieIndex();
  await buildStudioIndex();
  await buildImageIndex();
}
