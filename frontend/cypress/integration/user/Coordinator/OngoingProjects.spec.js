describe("Test Case 14: OngoingProjects", () => {
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

  // describe("Test Case 14: OngoingProjects", () => {
  //   beforeEach(() => {
  //     cy.visit("http://localhost:3000/");
  //     cy.get("form").find("input").first().type("shayanmalinda@gmail.com");
  //     cy.get("form").find("input").last().type("970822151v");
  //     cy.get("form").contains("Login").click();
  //     cy.contains("Login")
  //       .click()
  //       .then(() => {
  //         cy.url().should("eq", "http://localhost:3000/" + "adminhome");
  //       });
  //   });

  it("Project Details", () => {
    cy.visit("http://localhost:3000/coordinatorhome");
    cy.contains("2020 BIT 2nd Year");
    cy.contains("Supervisor").click();

    //   .then(() => {
    //     cy.url().should(
    //       "eq",
    //       "http://localhost:3000/coordinatorhome/projectdata/Supervisors/5f15be22fc9bc73774ef3b8e"
    //     );
    //   });
  });
});
