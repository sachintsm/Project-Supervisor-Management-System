describe("Test Case 1 : SubmitBiweeklyReports", () => {
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

  it("Submit Biweekly Reports", () => {
    cy.visit("http://localhost:3000/studenthome");
    cy.contains("E-supervision")
      .click()
      .then(() => {
        cy.url().should("eq", "http://localhost:3000/studenthome/viewproject");
      });
    cy.contains("Biweekly Reports")
      .click()
      .then(() => {
        cy.url().should(
          "eq",
          "http://localhost:3000/studenthome/biweeklyview/5ebcf3f80de93d0b000bb5a6"
        );
      });

    cy.contains("Add Submission")
      .first()
      .click()
      .then(() => {
        cy.url().should(
          "eq",
          "http://localhost:3000/studenthome/biweeklysubmissionpanel/5f9dab56dc767611f8aeada5"
        );
      });

    cy.contains("Add Submission")
      .first()
      .click()
      .then(() => {
        cy.url().should(
          "eq",
          "http://localhost:3000/studenthome/biweeklysubmissionpanel/5f9dab56dc767611f8aeada5"
        );
      });
  });
});
