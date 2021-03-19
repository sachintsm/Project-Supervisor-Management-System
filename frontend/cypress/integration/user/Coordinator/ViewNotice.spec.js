describe("Test Case 16: ViewNotice", () => {
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

  it("View Notice", () => {
    cy.visit("http://localhost:3000/coordinatorhome");
    cy.contains("Notice").click();
    cy.contains("View Notices")
      .click()
      .then(() => {
        cy.url().should("eq", "http://localhost:3000/shared/noticeView");
      });
  });
});
