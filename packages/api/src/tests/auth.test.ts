import app from "../api/app";
import supertest from "supertest";
import { clearDB, createUser, newUser } from "./test_utils";
/* 
iwm is a singleton used by nodemailer-stub to store all of the newly created emails in memory
and give you easy access to them for testing  purposes
 */
const iwm: any = require("nodemailer-stub").interactsWithMail;

beforeAll(async (done) => {
  try {
    await clearDB();
  } catch (error) {
    console.log(error);
  }
  done();
});

describe("Auth", () => {
  it("User can register with username, email, and password. And then confirm their email", async (done) => {
    // Create user and check that it creates correctly
    const input = { ...newUser };
    delete input.is_verified;
    const res = await supertest(app).post("/api/auth/register").send(input);
    expect(res.status).toBe(201);
    // get token from the email
    const email_token = iwm
      .lastMail()
      .content.split("/confirm/")[1]
      .split(`" target`)[0];
    // follow the verification link
    const verification_res = await supertest(app)
      .post("/api/auth/confirm_email")
      .send({ token: email_token });
    // check the response contents to be the right shape
    expect(verification_res.body).toEqual(
      expect.objectContaining({
        token: expect.any(String),
        user: expect.any(Object),
      })
    );
    // check the right status
    expect(verification_res.status).toBe(200);

    done();
  });

  it("User can login with email & password", async (done) => {
    const res = await supertest(app)
      .post("/api/auth/login")
      .send({ credential: newUser.email, password: newUser.password });
    expect(res.body).toEqual(
      expect.objectContaining({ token: expect.any(String) })
    );
    expect(res.status).toBe(200);
    done();
  });

  it("User can login with username & password", async (done) => {
    const res = await supertest(app)
      .post("/api/auth/login")
      .send({ credential: newUser.username, password: newUser.password });
    expect(res.body).toEqual(
      expect.objectContaining({ token: expect.any(String) })
    );
    expect(res.status).toBe(200);
    done();
  });

  it("User can reset password", async (done) => {
    // create a user
    // send a forgot password request
    // get password reset token from email
    // send password reset token & new password to reset_password endpoint
    // check that the user can log in with the new password
    await clearDB();
    const { user, token } = await createUser();
    iwm.flushMails();
    const res = await supertest(app)
      .post("/api/auth/forgot_password")
      .send({ email: user.email });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      message: "Password reset mail sent to user email",
    });
    // get token from the email
    const reset_token = iwm
      .lastMail()
      .content.split("/reset/")[1]
      .split(`" target`)[0];
    const newPassword = "a fine day in typescript 4.0 heaven";
    const res2 = await supertest(app).post("/api/auth/reset_password").send({
      token: reset_token,
      password: newPassword,
      confirmPassword: newPassword,
    });
    expect(res2.status).toBe(200);
    expect(res2.body).toEqual({ message: "Password updated" });

    // try to login using updated password
    const res3 = await supertest(app)
      .post("/api/auth/login")
      .send({ credential: user.email, password: newPassword });

    expect(res3.body).toEqual(
      expect.objectContaining({ token: expect.any(String) })
    );
    expect(res3.status).toBe(200);
    done();
  });
});

afterAll(async (done) => {
  try {
    await clearDB();
  } catch (error) {
    console.log(error);
  }
  done();
});
