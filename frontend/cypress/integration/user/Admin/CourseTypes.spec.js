describe("Test Case 6: Courses", () => {
  it("Login Admin", () => {
    cy.visit("http://localhost:3000/");
    cy.get("form").find("input").first().type("3rdyeargroupproject0@gmail.com");
    cy.get("form").find("input").last().type("admin123");
    cy.get("form").contains("Login").click();
    cy.contains("Login")
      .click()
      .then(() => {
        cy.url().should("eq", "http://localhost:3000/" + "adminhome");
      });
  });

  it("Course Types", () => {
    cy.visit("http://localhost:3000/adminhome");
    cy.contains("Courses").click();
    cy.contains("Course Types")
      .click()
      .then(() => {
        cy.url().should("eq", "http://localhost:3000/adminhome/projecttypes");
      });
  });
});
