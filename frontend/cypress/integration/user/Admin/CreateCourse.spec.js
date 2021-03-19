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

  it("Create Course", () => {
    cy.visit("http://localhost:3000/adminhome");
    cy.contains("Courses").click();
    cy.contains("Create Course")
      .click()
      .then(() => {
        cy.url().should("eq", "http://localhost:3000/adminhome/createproject");
        // cy.contains("Create Course");
        // cy.get("dropdown-toggle.btn-btn-secondary").contains("2019").click();
      });
  });
});
