describe("Test Case 17: ViewNotification", () => {
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

  it("View Notification", () => {
    cy.visit("http://localhost:3000/coordinatorhome");
    cy.get("li.nav-item.mr-3")
      .first()
      .click()
      .then(() => {
        cy.url().should(
          "eq",
          "http://localhost:3000/coordinatorhome/notifications"
        );
      });
  });
});
