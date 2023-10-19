import app from "../app/index";
import loaders from "../loaders";
import { db } from "../services/db";
import sleep from "../utils/sleep";

import teardownApp from "../utils/teardown";

let teardownHappened = false;

export async function setup() {
  console.log("Setting up tests");

  console.log("DB BEFORE ->", db) ;
  await loaders(app);

  console.log("DB AFTER ->", db);
}

export async function teardown() {
  console.log("Tearing down tests");

  if (teardownHappened) throw new Error("teardown called twice");
  teardownHappened = true;

  await teardownApp();
}
