import yargs from "yargs";

import * as logger from "./utils/logger";

const argv = yargs
  .boolean("process-queue")
  .boolean("commit-import")
  .boolean("ignore-integrity")
  .boolean("skip-compaction")
  .boolean("update-izzy")
  .boolean("update-gianna")
  .boolean("hard-restart")
  .number("index-slice-size").argv;
logger.log(argv);
export default argv;
