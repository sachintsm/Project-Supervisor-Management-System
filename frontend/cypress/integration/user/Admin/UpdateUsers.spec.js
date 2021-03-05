describe("Test Case 11: Update Users", () => {
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
    cy.contains("Users").click();
    cy.contains("Manage Users")
      .click()
      .then(() => {
        cy.url().should("eq", "http://localhost:3000/adminhome/viewusers");
        cy.contains("List of Staff");
        cy.contains("Actions");
        cy.get("svg.MuiSvgIcon-root.edit-btn")
          .first()
          .click()
          .then(() => {
            cy.url().should(
              "eq",
              "http://localhost:3000/editprofile/5eb7a9217ff4246104d8320f"
            );
            cy.contains("Update User");
            cy.get("input").last().type("0758693212");
            cy.contains("Confirm to reset");
            cy.contains("Yes").click();
          });
      });
  });

  it("Reset Password", () => {
    cy.visit("http://localhost:3000/adminhome");
    cy.contains("Users").click();
    cy.contains("Manage Users")
      .click()
      .then(() => {
        cy.url().should("eq", "http://localhost:3000/adminhome/viewusers");
        cy.contains("List of Staff");
        cy.contains("Actions");
        cy.get("svg.MuiSvgIcon-root.edit-btn")
          .first()
          .click()
          .then(() => {
            cy.url().should(
              "eq",
              "http://localhost:3000/editprofile/5eb7a9217ff4246104d8320f"
            );
            cy.contains("Reset Password");
            cy.contains("Reset password").click();
            cy.contains("Confirm to reset");
            cy.contains("Yes").click();
          });
      });
  });
});
