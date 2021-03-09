import supertest from "supertest";
import app from "../src/components/app";
import { UserDocument } from "../src/components/users/model";
import { clearDB, createUser, createWorkspace, teardown } from "./test_utils";
import { WorkspaceDocument } from "../src/components/workspaces/model";

let token: string;
let user: UserDocument;
let workspace: WorkspaceDocument;

const setup = async () => {
  try {
    await clearDB();
    const test_data = await createUser();
    token = test_data.token;
    user = test_data.user;
    workspace = await createWorkspace(user._id);
  } catch (error) {
    console.error(error.name, error.message);
  }
};

afterAll(teardown);

beforeEach(setup);

describe("/api/workspaces", () => {
  it("Is protected", async () => {
    const res = await supertest(app).post("/api/workspaces");
    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      message: "Missing credentials",
    });
  });
});

describe("create new workspace", () => {
  it("successfully creates a workspace", async () => {
    const res = await supertest(app)
      .post("/api/workspaces/")
      .send({
        name: "Brave new world",
      })
      .set("Authorization", token);
    expect(res.status).toBe(201);
    expect(res.body).toBeDefined();
    expect(res.body.name).toBe("Brave new world");
    expect(res.body.labels).toStrictEqual([]);
    expect(res.body.users).toStrictEqual([user.id]);
  });

  it("Name is required", async () => {
    const response = await supertest(app)
      .post("/api/workspaces/")
      .send({
        labels: [],
      })
      .set("Authorization", token);
    expect(response.status).toBe(400);
    expect(response.body).toBeDefined();
  });
});

describe("DELETE: /api/workspaces/:id", () => {
  it("Returns 404 on wrong id", async () => {
    const res = await supertest(app)
      .delete(`/api/workspaces/5f903d3c7c5c078dc905366c`)
      .set("Authorization", token);
    expect(res.body).toEqual({
      message: "Not found",
    });
    expect(res.status).toBe(404);
  });
  it("Removes the workspace given correct id", async () => {
    const res = await supertest(app)
      .delete(`/api/workspaces/${workspace._id.toHexString()}`)
      .set("Authorization", token);

    expect(res.status).toBe(200);
  });
});

describe("PATCH: /api/workspaces/:id", () => {
  it("Sends 404 on non existent id", async () => {
    const fake_workspace_id = "5f7f4800a552e6ec677a2766";
    const res = await supertest(app)
      .patch("/api/workspaces/" + fake_workspace_id)
      .send({
        name: "testworkspace8",
        admin: "5f7f4800a552e6ec677a2766",
        users: ["5f7f4800a552e6ec677a2766"],
      })
      .set("Authorization", token);
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ message: "Not found" });
  });
  it("returns workspace has been updated", async () => {
    const res = await supertest(app)
      .patch(`/api/workspaces/${workspace.id}`)
      .send({
        name: "testworkspace9",
      })
      .set("Authorization", token);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "Workspace updated" });
  });
});

describe("GET: /api/workspaces", () => {
  test("Returns 200 and an array of workspaces user is part of", async (done) => {
    const response = await supertest(app)
      .get("/api/workspaces/")
      .set("Authorization", token);
    expect(response.body).toEqual([JSON.parse(JSON.stringify(workspace))]);
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
