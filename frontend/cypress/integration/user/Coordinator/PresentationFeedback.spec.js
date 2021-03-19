describe("Test Case 15 : Presentation Feedback", () => {
  it("Login Coordinator", () => {
    cy.visit("http://localhost:3000/");
    cy.get("form").find("input").first().type("shayanmalinda@gmail.com");
    cy.get("form").find("input").last().type("970822151v");
    cy.get("form").contains("Login").click();
    cy.contains("Login")
      .click()
      .then(() => {
        cy.url().should("eq", "http://localhost:3000/" + "coordinatorhome");
      });
  });

  it("Presentation Feedback", () => {
    cy.visit("http://localhost:3000/coordinatorhome");
    cy.contains("Presentation Feedback")

      .click()
      .then(() => {
        cy.url().should(
          "eq",
          "http://localhost:3000/coordinatorhome/presentationfeedback"
        );
      });
  });
});
