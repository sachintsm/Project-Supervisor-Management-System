describe("Test Case 5 : ViewProfile", () => {
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

  it("View Profile", () => {
    cy.visit("http://localhost:3000/studenthome");
    cy.get("span.material-icons.MuiIcon-root")
      .click()
      .then(() => {
        cy.url().should("eq", "http://localhost:3000/profile");
      });
  });
});
