describe("Test Case 18: Profile", () => {
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

  // it("Profile Settings", () => {
  //   cy.visit("http://localhost:3000/coordinatorhome");
  //   cy.get("span.material-icons.MuiIcon-root").click();
  //   cy.contains("Settings")
  //     // .first()
  //     .click()
  //     .then(() => {
  //       cy.url().should("eq", "http://localhost:3000/profile");
  //     });
  // });
});
