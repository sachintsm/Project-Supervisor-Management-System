describe("Test Case 9: Manage Users", () => {
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
        cy.contains("List of Staff");
        cy.get("input").first().type("Malinda");
      });
  });

  it("Edit Users", () => {
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
          });
      });
  });

  it("Delete Users", () => {
    cy.visit("http://localhost:3000/adminhome");
    cy.contains("Users").click();
    cy.contains("Manage Users")
      .click()
      .then(() => {
        cy.url().should("eq", "http://localhost:3000/adminhome/viewusers");
        cy.contains("List of Staff");
        cy.contains("Actions");
        cy.get("svg.MuiSvgIcon-root.del-btn").first().click();
        cy.contains("Confirm to submit");
        cy.contains("Yes").click();
      });
  });

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
        cy.contains("Admins").click();
      });
  });
});
