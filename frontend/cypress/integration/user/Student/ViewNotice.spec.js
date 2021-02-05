describe("Test Case 2: ViewNotice", () => {
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

  it("View Notice", () => {
    cy.visit("http://localhost:3000/studenthome");
    cy.contains("Notices")
      .click()
      .then(() => {
        cy.url().should("eq", "http://localhost:3000/shared/noticeView");
      });
  });
});
