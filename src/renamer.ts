import express from "express";
import Scene from "./types/scene";
import Handlebars from "handlebars";
import Studio from "./types/studio";
import moment from "moment";
import { basename, dirname, join } from "path";

export function useRenamerRoutes(app: express.Application) {
  app.get("/rename/:scene", async (req, res) => {
    const template = req.query.template as string | undefined;
    if (!template) {
      return res.sendStatus(400);
    }

    const scene = await Scene.getById(req.params.scene);
    if (!scene || !scene.path) {
      return res.sendStatus(404);
    }

    const newFileName = Handlebars.compile(template)({
      name: scene.name,
      title: scene.name,
      actors: (await Scene.getActors(scene))
        .map((ac) => ac.name)
        .sort()
        .join(req.query.actorJoiner || ", "),
      labels: (await Scene.getLabels(scene))
        .map((la) => la.name)
        .sort()
        .join(req.query.labelJoiner || ", "),
      studio: scene.studio ? (await Studio.getById(scene.studio))?.name : null,
      releaseDateISO: scene.releaseDate ? new Date(scene.releaseDate).toISOString() : null,
      releaseDate: scene.releaseDate,
      releaseDateYYYYMMDD: moment(scene.releaseDate).format("YYYY-MM-DD"),
      releaseDateDDMMYYYY: moment(scene.releaseDate).format("DD-MM-YYYY"),
      releaseDateMMDDYYYY: moment(scene.releaseDate).format("MM-DD-YYYY"),
      fps: scene.meta.fps,
      ...scene.meta.dimensions,
    });

    res.json({
      oldFileName: basename(scene.path),
      newFileName,
      oldPath: scene.path,
      newPath: join(dirname(scene.path), newFileName),
    });
  });
}
