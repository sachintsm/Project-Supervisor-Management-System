describe("Test Case 2: RejectedRequests", () => {
  it("Login Supervisor", () => {
    cy.visit("http://localhost:3000/");
    cy.get("form").find("input").first().type("nipuniwarakagoda@gmail.com");
    cy.get("form").find("input").last().type("975732924v");
    cy.get("form").contains("Login").click();
    cy.contains("Login")
      .click()
      .then(() => {
        cy.url().should("eq", "http://localhost:3000/" + "supervisorhome");
      });
  });

  it("Group Request", () => {
    cy.visit("http://localhost:3000/supervisorhome");
    cy.contains("Group Request")
      .click()
      .then(() => {
        cy.url().should(
          "eq",
          "http://localhost:3000/supervisorhome/viewRequest"
        );
      });
  });

  it("Rejected Requests", () => {
    cy.visit("http://localhost:3000/supervisorhome/viewRequest");
    cy.contains("Rejected Requests")
      .click()
      .then(() => {
        cy.url().should(
          "eq",
          "http://localhost:3000/supervisorhome/viewRequest"
        );
      });
  });
});
