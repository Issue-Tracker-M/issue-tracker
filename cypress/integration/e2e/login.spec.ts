describe("Visit and login to the site", () => {
  it("User can log in to ", () => {
    cy.visit("localhost:4000/login");
    cy.contains("Login");
    cy.contains(/forgot password/i);
    cy.contains(/sign up/i);
    cy.findByLabelText(/Email/).type("thesiegebot@gmail.com");
    cy.findByLabelText(/Password/).type("test1234");
    cy.findByText("Sign In").click();
  });
});
