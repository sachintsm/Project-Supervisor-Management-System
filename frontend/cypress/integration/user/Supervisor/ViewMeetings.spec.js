describe("Test Case 10: ViewMeetings", () => {
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

  it("View Meetings", () => {
    cy.visit("http://localhost:3000/supervisorhome");
    cy.get("span.material-icons.MuiIcon-root")
      .first()
      .click()
      .then(() => {
        cy.url().should(
          "eq",
          "http://localhost:3000/supervisorhome/notifications"
        );
        cy.contains("View Request")
          .first()
          .click()
          .then(() => {
            cy.url().should(
              "eq",
              "http://localhost:3000/supervisorhome/viewMeetings"
            );
          });

        cy.contains("Confirm Meeting")
          .first()
          .click()
          .then(() => {
            cy.url().should(
              "eq",
              "http://localhost:3000/supervisorhome/viewMeetings"
            );
          });
      });
  });
});
