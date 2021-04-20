describe("Test Case 19: Current Course", () => {
  beforeEach(() => {
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

  it("Update Users", () => {
    cy.visit("http://localhost:3000/adminhome");
    cy.contains("Courses").click();
    cy.contains("Create Course")
      .click()
      .then(() => {
        cy.url().should("eq", "http://localhost:3000/adminhome/createproject");
        cy.contains("Current Courses");
        cy.contains("Operations");
        cy.get("svg.MuiSvgIcon-root.edit-btn")
          .first()
          .click()
          .then(() => {
            cy.url().should(
              "eq",
              "http://localhost:3000/adminhome/createproject"
            );
            cy.get("Course Year");
            cy.click();
            cy.get("select").select("2020");
            //   cy.contains("Confirm to reset");
            //   cy.contains("Yes").click();
          });
      });
  });
});
