describe("Test Case 9: SubmitReport", () => {
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

  it("Submit Report", () => {
    cy.visit("http://localhost:3000/supervisorhome");
    cy.get("span.material-icons.MuiIcon-root")
      .first()
      .click()
      .then(() => {
        cy.url().should(
          "eq",
          "http://localhost:3000/supervisorhome/notifications"
        );
        cy.get("button.btn.btn-info.my-btn1.btn-primary")
          .first()
          .click()
          .then(() => {
            cy.url().should(
              "eq",
              "http://localhost:3000/supervisorhome/notifications/individualmarks/5fb6a7384404db0cbab9acf4"
            );
          });

        cy.contains("Submit Report")
          .click()
          .then(() => {
            cy.url().should(
              "eq",
              "http://localhost:3000/supervisorhome/notifications/individualmarks/5fb6a7384404db0cbab9acf4"
            );
          });
      });
  });
});
