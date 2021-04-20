describe("Test Case 5: ViewRecentPresentationFeedback", () => {
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

  it(" View Recent Presentation Feedback", () => {
    cy.visit("http://localhost:3000/supervisorhome");
    cy.contains("Presentation Feedback")
      .click()
      .then(() => {
        cy.url().should(
          "eq",
          "http://localhost:3000/supervisorhome/givepresentationfeedback"
        );
      });
  });
});
