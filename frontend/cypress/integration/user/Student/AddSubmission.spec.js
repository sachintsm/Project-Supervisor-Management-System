describe("Test Case 1 : AddSubmission", () => {
  //   beforeEach(() => {
  //     cy.visit("http://localhost:3000/");
  //     cy.get("form").find("input").first().type("sachin@gmail.com");
  //     cy.get("form").find("input").last().type("950880333v");
  //     cy.get("form").contains("Login").click();
  //     cy.contains("Login")
  //       .click()
  //       .then(() => {
  //         cy.url().should("eq", "http://localhost:3000/" + "studenthome");
  //       });
  //   });

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

  it("Add Submission", () => {
    cy.visit("http://localhost:3000/studenthome");
    cy.contains("E-supervision")
      .click()
      .then(() => {
        cy.url().should("eq", "http://localhost:3000/studenthome/viewproject");
      });
    cy.contains("Submissions")
      .click()
      .then(() => {
        cy.url().should(
          "eq",
          "http://localhost:3000/studenthome/submisionview/5ebcf3f80de93d0b000bb5a6"
        );
      });
    cy.contains("Add Submission")
      .click()
      .then(() => {
        cy.url().should(
          "eq",
          "http://localhost:3000/studenthome/submisionview/submisionpanal/5f7ce14e03fb8b37d8a35a57"
        );
      });

    cy.contains("Add Submission")
      .click()
      .then(() => {
        cy.url().should(
          "eq",
          "http://localhost:3000/studenthome/submisionview/submisionpanal/5f7ce14e03fb8b37d8a35a57"
        );
      });
  });
});
