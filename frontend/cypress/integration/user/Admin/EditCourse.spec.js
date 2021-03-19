describe("Test Case 13: EditCourses", () => {
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
        cy.contains("Current Course Types");
        cy.contains("Operations");
        cy.get("svg.MuiSvgIcon-root.edit-btn").first().click();
        cy.contains("Edit Project Type");
        cy.get("input").first().type("Undergraduate");
        cy.get("input").last().type("CS");
        cy.get('[type="checkbox"]').first().check();
        cy.contains("Save Now").click();
        cy.contains("Project Type");
        cy.contains("Yes").click();
        //   .then(() => {
        //     cy.url().should(
        //       "eq",
        //       "http://localhost:3000/editprofile/5eb7a9217ff4246104d8320f"
        //     );
        // });
      });
  });
});
