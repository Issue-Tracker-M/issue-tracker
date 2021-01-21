import supertest from "supertest";
import app from "../../../api/app";
import { UserDocument } from "../../../models/User";
import { WorkspaceDocument } from "../../../models/Workspace";
import { clearDB, createUser, createWorkspace } from "../../test_utils";

let token: string;
let workspace: WorkspaceDocument;
let user: UserDocument;

beforeAll(async (done) => {
  try {
    await clearDB();

    const test_data = await createUser();
    user = test_data.user;
    token = test_data.token;
    workspace = await createWorkspace(user._id);
    done();
  } catch (error) {
    console.error(error.name, error.message);
  }
});

afterAll(async (done) => {
  await clearDB();
  done();
});

describe("PUT: /api/workspaces/:id", () => {
  it("Sends 404 on non existent id", async () => {
    const fake_workspace_id = "5f7f4800a552e6ec677a2766";
    const res = await supertest(app)
      .put("/api/workspaces/" + fake_workspace_id)
      .send({
        name: "testworkspace8",
        labels: [],
        admin: "5f7f4800a552e6ec677a2766",
        users: ["5f7f4800a552e6ec677a2766"],
        history: [],
        tasks: [],
      })
      .set("Authorization", token);
    expect(res.body).toEqual({ message: "Workspace with id doesn't exist" });
    expect(res.status).toBe(404);
  });
  it("returns workspace has been updated", async () => {
    const res = await supertest(app)
      .put(`/api/workspaces/${workspace.id}`)
      .send({
        name: "testworkspace8",
        labels: [],
        admin: user.id,
        users: [user.id],
        history: [],
        tasks: [],
      })
      .set("Authorization", token);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "Workspace updated" });
  });
});
