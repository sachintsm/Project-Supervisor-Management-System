describe("Test Case 3: ViewNotification", () => {
  it("Login Student", () => {
    cy.visit("http://localhost:3000/");
    cy.get("form").find("input").first().type("sachin@gmail.com");
    cy.get("form").find("input").last().type("950880333v");
    cy.get("form").contains("Login").click();
    cy.contains("Login")
      .click()
      .then(() => {
        cy.url().should("eq", "http://localhost:3000/" + "studenthome");
      });
  });

  it("View Notification", () => {
    cy.visit("http://localhost:3000/studenthome");
    cy.get("navbar")
      .find("mui-72835")
      .click()
      // cy.contains("Settings")
      //   .click()
      .then(() => {
        cy.url().should(
          "eq",
          "http://localhost:3000/studenthome/notifications"
        );
      });
  });
});
