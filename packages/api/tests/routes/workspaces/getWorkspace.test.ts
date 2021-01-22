import supertest from "supertest";
import app from "../../../api/app";
import { UserDocument } from "../../../models/User";
import { WorkspaceDocument } from "../../../models/Workspace";
import { clearDB, createWorkspace, createUser } from "../../test_utils";

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
    done();
  } catch (error) {
    console.error(error.name, error.message);
  }
});

afterAll(async (done) => {
  await clearDB();
  done();
});

describe("GET: /api/workspaces", () => {
  test("Returns 404 if user has no workspaces", async (done) => {
    const response = await supertest(app)
      .get("/api/workspaces/")
      .set("Authorization", token);
    console.log(response.body);
    expect(response.status).toBe(404);
    done();
  });
});

describe("GET: /api/workspaces/:id", () => {
  test("Returns a single workspace with corresponding id", async () => {
    workspace = await createWorkspace(user.id);
    const response = await supertest(app)
      .get(`/api/workspaces/${workspace.id}`)
      .set("Authorization", token);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("name", "testworkspace7");
  });
});
