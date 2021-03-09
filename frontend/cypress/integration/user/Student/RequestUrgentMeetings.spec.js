describe("Test Case 1 : RequestUrgentsMeetings", () => {
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

  it("Request Urgent Meetings", () => {
    cy.visit("http://localhost:3000/studenthome");
    cy.contains("E-supervision")
      .click()
      .then(() => {
        cy.url().should("eq", "http://localhost:3000/studenthome/viewproject");
      });
    cy.contains("Meetings")
      .click()
      .then(() => {
        cy.url().should("eq", "http://localhost:3000/student/viewMeeting");
      });
    cy.contains("Urgent Meetings")
      .click()
      .then(() => {
        cy.url().should("eq", "http://localhost:3000/student/viewMeeting");
      });
  });
});
