describe("Test Case 5: GivePresentationFeedback", () => {
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

  it(" Give Presentation Feedback", () => {
    cy.visit("http://localhost:3000/supervisorhome");
    cy.contains("Presentation Feedback")
      .click()
      .then(() => {
        cy.url().should(
          "eq",
          "http://localhost:3000/supervisorhome/givepresentationfeedback"
        );
        cy.get('select[id="dropdown"]').select("2020-Undegraduate-2nd Year");
        // cy.get("react-datepicker__input-container").type("2020-01-01");
        // cy.get("textarea[name=message]").type("criteria for the registration");
        // cy.get("form").contains("Send").click();
        // cy.get("form").contains("Register Now").click();
        // cy.contains("Register Now").click();
        // cy.contains("Confirm to submit");
        // cy.contains("Yes").click();
      });
  });
});
