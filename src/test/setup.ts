import app from "../app/index";
import loaders from "../loaders";

beforeAll(async () => {
  console.log("BEFOREALL TESTS");
  await loaders(app);
});

jest.setTimeout(30 * 1000);
