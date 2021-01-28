import supertest from "supertest";
import app from "../../../src/components/app";
import { UserDocument } from "../../../src/components/users/model";
import { WorkspaceDocument } from "../../../src/components/workspaces/model";
import {
  clearDB,
  createWorkspace,
  createUser,
  teardown,
} from "../../test_utils";

let token: string;
let workspace: WorkspaceDocument;
let user: UserDocument;

beforeAll(async (done) => {
  try {
    await clearDB();
    // clear db, create test user and get auth
    const test_data = await createUser();
    user = test_data.user;
    token = test_data.token;
    workspace = await createWorkspace(user.id);
    done();
  } catch (error) {
    console.error(error.name, error.message);
  }
});

afterAll(teardown);

describe("GET: /api/workspaces", () => {
  test("Returns 200 and an array of workspaces user is part of", async (done) => {
    const response = await supertest(app)
      .get("/api/workspaces/")
      .set("Authorization", token);
    expect(response.body).toEqual([
      { _id: workspace._id.toHexString(), name: workspace.name },
    ]);
    expect(response.status).toBe(200);
    done();
  });
});

describe("GET: /api/workspaces/:id", () => {
  test("Returns a single workspace with corresponding id", async () => {
    workspace = await createWorkspace(user.id);
    const response = await supertest(app)
      .get(`/api/workspaces/${workspace._id.toHexString()}`)
      .set("Authorization", token);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("name", "testworkspace7");
  });
});
