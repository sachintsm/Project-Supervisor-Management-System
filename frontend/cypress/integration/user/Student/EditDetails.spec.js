describe("Test Case 1 : EditDetails", () => {
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

  it("Edit Details", () => {
    cy.visit("http://localhost:3000/studenthome");
    cy.contains("E-supervision")
      .click()
      .then(() => {
        cy.url().should("eq", "http://localhost:3000/studenthome/viewproject");
      });
    cy.get("span.edit-span")
      // .last()
      .click()
      .then(() => {
        cy.url().should("eq", "http://localhost:3000/studenthome/viewproject");
      });
  });
});