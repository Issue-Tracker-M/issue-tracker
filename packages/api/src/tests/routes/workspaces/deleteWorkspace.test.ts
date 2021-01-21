import supertest from "supertest";
import app from "../../../api/app";
import { createWorkspace } from "../../test_utils";
import { UserDocument } from "../../../models/User";
import { WorkspaceDocument } from "../../../models/Workspace";
import { clearDB, createUser } from "../../test_utils";

let workspace: WorkspaceDocument;
let user: UserDocument;
let token: string;

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

describe("DELETE: /api/workspaces/:id", () => {
  it("Returns 404 on wrong id", async (done) => {
    const res = await supertest(app)
      .delete(`/api/workspaces/5f903d3c7c5c078dc905366c`)
      .set("Authorization", token);
    expect(res.body).toEqual({
      message: "No workspace associated with this id",
    });
    expect(res.status).toBe(404);
    done();
  });
  it("Removes the workspace given correct id", async (done) => {
    const res = await supertest(app)
      .delete(`/api/workspaces/${workspace.id}`)
      .set("Authorization", token);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "workspace deleted" });
    done();
  });
});
