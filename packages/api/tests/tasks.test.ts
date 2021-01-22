import supertest from "supertest";
import app from "../api/app";
import { Priority } from "../models/Task";
import { UserDocument } from "../models/User";
import { WorkspaceDocument } from "../models/Workspace";
import { clearDB, createWorkspace, createUser, createTask } from "./test_utils";

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

afterAll(clearDB);

describe("Tasks", () => {
  test("User can create a new task", async () => {
    const response = await supertest(app)
      .post("/api/tasks")
      .set("Authorization", token)
      .send({
        title: "Test Task",
        description: "Test description",
        workspace: workspace.id,
        priority: Priority.high,
        stage: "in_progress",
        comments: [],
        users: [],
        labels: [],
      });
    expect(response.status).toBe(201);
    expect(response.body.title).toBe("Test Task");
    expect(response.body.description).toBe("Test description");
    expect(response.body.priority).toBe(Priority.high);
    expect(response.body.comments).toStrictEqual([]);
    expect(response.body.users).toStrictEqual([]);
    expect(response.body.labels).toStrictEqual([]);
  });

  test("User can edit an existing task", async () => {
    const task = await createTask(workspace.id);
    const res = await supertest(app)
      .put(`/api/tasks/${task.id}`)
      .set("Authorization", token)
      .send({ title: "Changed title" });
    expect(res.status).toBe(200);
  });

  test("User can delete an existing task", async () => {
    const task = await createTask(workspace.id);
    const res = await supertest(app)
      .delete(`/api/tasks/${task.id}`)
      .set("Authorization", token);
    expect(res.status).toBe(204);
  });

  test("User can get an existing task", async () => {
    const task = await createTask(workspace.id);
    const res = await supertest(app)
      .get(`/api/tasks/${task.id}`)
      .set("Authorization", token);
    expect(res.status).toBe(200);
  });
});

describe("Comments", () => {
  test("User can post a comment to a task", async () => {
    const task = await createTask(workspace.id);
    const res = await supertest(app)
      .post(`/api/tasks/${task.id}/comment`)
      .set("Authorization", token)
      .send({ content: "Smell of types in the morning", author: user.id });
    expect(res.status).toBe(201);
  });
  test("User can edit a comment", async () => {
    const task = await createTask(workspace.id, {
      title: "Workspace with comment",
      comments: [{ content: "Initial comment", author: user.id }],
      workspace: workspace.id,
    });
    const res = await supertest(app)
      .put(`/api/tasks/${task.id}/comment/${task.comments[0].id}`)
      .set("Authorization", token)
      .send({ content: "I'm changed!" });
    expect(res.status).toBe(200);
  });

  test("User can delete a comment", async () => {
    const task = await createTask(workspace.id, {
      title: "Workspace with comment",
      comments: [{ content: "Initial comment", author: user.id }],
      workspace: workspace.id,
    });
    const res = await supertest(app)
      .delete(`/api/tasks/${task.id}/comment/${task.comments[0].id}`)
      .set("Authorization", token);
    expect(res.status).toBe(200);
  });
});
