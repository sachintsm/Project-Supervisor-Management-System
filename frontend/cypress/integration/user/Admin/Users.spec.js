describe("Test Case 7: CreateCourses", () => {
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

  it("View Users", () => {
    cy.visit("http://localhost:3000/adminhome");
    cy.contains("Users").click();
    cy.contains("Manage Users")
      .click()
      .then(() => {
        cy.url().should("eq", "http://localhost:3000/adminhome/viewusers");
      });
  });
});
