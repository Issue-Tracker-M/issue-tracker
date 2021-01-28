import supertest from "supertest";
import app from "../../../src/components/app";
import { UserDocument } from "../../../src/components/users/model";
import { WorkspaceDocument } from "../../../src/components/workspaces/model";
import {
  clearDB,
  createUser,
  createWorkspace,
  teardown,
} from "../../test_utils";

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

afterAll(teardown);

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
      .patch(`/api/workspaces/${workspace._id.toHexString()}`)
      .send({
        name: "testworkspace9",
      })
      .set("Authorization", token);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "Workspace updated" });
  });
});
