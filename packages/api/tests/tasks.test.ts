import supertest from "supertest";
import app from "../src/components/app";
import { UserDocument } from "../src/components/users/model";
import { WorkspaceDocument } from "../src/components/workspaces/model";
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
  } catch (error) {
    console.log(error, error.message);
  }
  done();
});

afterAll(async (done) => {
  try {
    await clearDB();
    done();
  } catch (error) {
    console.log("Can't clear DB!");
  }
});

describe("Tasks", () => {
  test("User can create a new task", async (done) => {
    const response = await supertest(app)
      .post(`/api/workspaces/${workspace._id}/tasks`)
      .set("Authorization", token)
      .send({
        title: "Test Task",
        description: "Test description",
        workspace: workspace.id,
        list: workspace.lists[0]._id,
      });
    expect(response.status).toBe(201);
    expect(response.body.title).toBe("Test Task");
    expect(response.body.description).toBe("Test description");
    expect(response.body.comments).toStrictEqual([]);
    expect(response.body.users).toStrictEqual([]);
    expect(response.body.labels).toStrictEqual([]);
    done();
  });

  test("User can edit an existing task", async () => {
    const task = await createTask(workspace._id, workspace.lists[0]._id);
    const res = await supertest(app)
      .patch(`/api/workspaces/${workspace._id}/tasks/${task._id}`)
      .set("Authorization", token)
      .send({ title: "Changed title" });
    expect(res.status).toBe(200);
  });

  test("User can delete an existing task", async () => {
    const task = await createTask(workspace._id, workspace.lists[0]._id);
    const res = await supertest(app)
      .delete(`/api/workspaces/${workspace._id}/tasks/${task._id}`)
      .set("Authorization", token);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "Task has been deleted" });
  });

  test("User can get an existing task", async () => {
    const task = await createTask(workspace._id, workspace.lists[0]._id);
    const res = await supertest(app)
      .get(`/api/workspaces/${workspace._id}/tasks/${task.id}`)
      .set("Authorization", token);
    expect(res.status).toBe(200);
  });
});

// describe("Comments", () => {
//   test("User can post a comment to a task", async () => {
//     const task = await createTask(workspace._id, workspace.lists[0]._id);
//     const res = await supertest(app)
//       .post(`/api/workspaces/${workspace._id}/tasks/${task.id}/comment`)
//       .set("Authorization", token)
//       .send({ content: "Smell of types in the morning", author: user.id });
//     expect(res.status).toBe(201);
//   });
//   test("User can edit a comment", async () => {
//     const task = await createTask(workspace.id, workspace.lists[0]._id, {
//       title: "Workspace with comment",
//       workspace: workspace.id,
//     });
//     task.comments.push({ content: "Initial comment", author: user.id });
//     await task.save();
//     const res = await supertest(app)
//       .put(`/api/tasks/${task.id}/comment/${task.comments[0].id}`)
//       .set("Authorization", token)
//       .send({ content: "I'm changed!" });
//     expect(res.status).toBe(200);
//   });

//   test("User can delete a comment", async () => {
//     const task = await createTask(workspace.id, workspace.lists[0]._id, {
//       title: "Workspace with comment",
//       workspace: workspace.id,
//     });
//     task.comments.push({ content: "Initial comment", author: user.id });
//     await task.save();
//     const res = await supertest(app)
//       .delete(`/api/tasks/${task.id}/comment/${task.comments[0].id}`)
//       .set("Authorization", token);
//     expect(res.status).toBe(200);
//   });
// });
