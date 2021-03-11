describe("My First Test", () => {
  it("User can log in to ", () => {
    cy.visit("localhost:4000/login");
    cy.contains("Login");
    cy.findByPlaceholderText("Username or Email").type("thesiegebot@gmail.com");
    cy.findByPlaceholderText("Password").type("test1234");
    cy.findAllByText("Sign In").click();
    cy.contains("Password");
    cy.contains("Sign In");
    cy.contains(/forgot password/i);
    cy.contains(/sign up/i);
  });
});
