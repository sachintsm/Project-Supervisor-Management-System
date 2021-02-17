describe("Test Case 4 : Notices", () => {
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

  it("Create and submit a Notice", () => {
    cy.visit("http://localhost:3000/adminhome");
    cy.contains("Notices").click();
    cy.contains("Create Notice")
      .click()
      .then(() => {
        cy.url().should("eq", "http://localhost:3000/shared/notice");
      });
    cy.contains("Creating New Notice");
    cy.get("input").first().type("Presentation Schedules");
    cy.get("textarea").type("criteria for the registration");
    cy.get('[type="checkbox"]').check();
    cy.contains("Add Notice").click();
    cy.contains("Confirm to submit");
    cy.contains("Yes").click();
  });

  it("Notice Title Required validation", () => {
    cy.visit("http://localhost:3000/adminhome");
    cy.contains("Notices").click();
    cy.contains("Create Notice")
      .click()
      .then(() => {
        cy.url().should("eq", "http://localhost:3000/shared/notice");
      });
    cy.contains("Creating New Notice");
    // cy.get("input").first().type("Presentation Schedules");
    cy.get("textarea").type("criteria for the registration");
    cy.get('[type="checkbox"]').check();
    cy.contains("Add Notice").click();
    // cy.contains("Confirm to submit");
    // cy.contains("Yes").click();
  });

  it("Notice Content Required validation", () => {
    cy.visit("http://localhost:3000/adminhome");
    cy.contains("Notices").click();
    cy.contains("Create Notice")
      .click()
      .then(() => {
        cy.url().should("eq", "http://localhost:3000/shared/notice");
      });
    cy.contains("Creating New Notice");
    cy.get("input").first().type("Presentation Schedules");
    // cy.get("textarea").type("criteria for the registration");
    cy.get('[type="checkbox"]').check();
    cy.contains("Add Notice").click();
    // cy.contains("Confirm to submit");
    // cy.contains("Yes").click();
  });
});
