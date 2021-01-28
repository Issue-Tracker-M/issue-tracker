import supertest from "supertest";
import app from "../../../src/components/app";
import { UserDocument } from "../../../src/components/users/model";
import { clearDB, createUser, teardown } from "../../test_utils";

let token: string;
let user: UserDocument;

beforeAll(async (done) => {
  try {
    await clearDB();
    const test_data = await createUser();

    token = test_data.token;
    user = test_data.user;
    done();
  } catch (error) {
    console.error(error.name, error.message);
  }
});

afterAll(teardown);

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
        name: "testworkspace7",
      })
      .set("Authorization", token);
    expect(res.status).toBe(201);
    expect(res.body).toBeDefined();
    expect(res.body.name).toBe("testworkspace7");
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
