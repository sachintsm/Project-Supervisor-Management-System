describe("Test Case 14: AddComments", () => {
  it("Login Supervisor", () => {
    cy.visit("http://localhost:3000/");
    cy.get("form").find("input").first().type("sachintsmuthumala@gmail.com");
    cy.get("form").find("input").last().type("950880333v");
    cy.get("form").contains("Login").click();
    cy.contains("Login")
      .click()
      .then(() => {
        cy.url().should("eq", "http://localhost:3000/" + "supervisorhome");
      });
  });

  it("Add Comment", () => {
    cy.visit("http://localhost:3000/supervisorhome");
    cy.get("span.material-icons.MuiIcon-root")
      .first()
      .click()
      .then(() => {
        cy.url().should(
          "eq",
          "http://localhost:3000/supervisorhome/notifications"
        );
        cy.contains("Comment")
          .first()
          .click()
          .then(() => {
            cy.url().should(
              "eq",
              "http://localhost:3000/supervisorhome/notifications/biweekcomments/5fb6a7384404db0cbab9acf4"
            );

            cy.get("form").find("input").first().type("text");
            cy.get("form").contains("Register Now").click();
          });
      });
  });
});
