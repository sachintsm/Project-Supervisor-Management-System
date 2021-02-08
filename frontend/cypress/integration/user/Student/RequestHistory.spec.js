describe("Test Case 1 : RequestHistory", () => {
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

  it("Request History", () => {
    cy.visit("http://localhost:3000/studenthome");
    cy.contains("E-supervision")
      .click()
      .then(() => {
        cy.url().should("eq", "http://localhost:3000/studenthome/viewproject");
      });
    cy.contains("Request Supervisors")
      .click()
      .then(() => {
        cy.url().should(
          "eq",
          "http://localhost:3000/studenthome/viewproject/requestsupervisor"
        );
      });
    cy.contains("Requests History").click();
  });
});
