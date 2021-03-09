describe("Test Case 17 : Notices", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/");
    cy.get("form").find("input").first().type("shayanmalinda@gmail.com");
    cy.get("form").find("input").last().type("970822151v");
    cy.get("form").contains("Login").click();
    cy.contains("Login")
      .click()
      .then(() => {
        cy.url().should("eq", "http://localhost:3000/" + "coordinatorhome");
      });
  });

  it("Login Coordinator", () => {
    cy.visit("http://localhost:3000/");
    cy.get("form").find("input").first().type("shayanmalinda@gmail.com");
    cy.get("form").find("input").last().type("970822151v");
    cy.get("form").contains("Login").click();
    cy.contains("Login")
      .click()
      .then(() => {
        cy.url().should("eq", "http://localhost:3000/" + "coordinatorhome");
      });
  });

  it("Create and submit a Notice", () => {
    cy.visit("http://localhost:3000/coordinatorhome");
    cy.contains("Notice").click();
    cy.contains("Create Notice")
      .click()
      .then(() => {
        cy.url().should("eq", "http://localhost:3000/shared/notice");
      });
    cy.contains("Creating New Notices");
    cy.get("select").select("2020 - BIT - 2nd Year");
    cy.get("input").first().type("Presentation Schedules");
    cy.get("textarea").type("criteria for the registration");
    cy.get('[type="checkbox"]').check();
    cy.contains("Add Notice").click();
    cy.contains("Confirm to submit");
    cy.contains("Yes").click();
  });

  it("Notice Title Required validation", () => {
    cy.visit("http://localhost:3000/coordinatorhome");
    cy.contains("Notices").click();
    cy.contains("Create Notice")
      .click()
      .then(() => {
        cy.url().should("eq", "http://localhost:3000/shared/notice");
      });
    cy.contains("Creating New Notices");
    // cy.get("input").first().type("Presentation Schedules");
    cy.get("textarea").type("criteria for the registration");
    cy.get('[type="checkbox"]').check();
    cy.contains("Add Notice").click();
    // cy.contains("Confirm to submit");
    // cy.contains("Yes").click();
  });

  it("Notice Content Required validation", () => {
    cy.visit("http://localhost:3000/coordinatorhome");
    cy.contains("Notices").click();
    cy.contains("Create Notice")
      .click()
      .then(() => {
        cy.url().should("eq", "http://localhost:3000/shared/notice");
      });
    cy.contains("Creating New Notices");
    cy.get("input").first().type("Presentation Schedules");
    // cy.get("textarea").type("criteria for the registration");
    cy.get('[type="checkbox"]').check();
    cy.contains("Add Notice").click();
    // cy.contains("Confirm to submit");
    // cy.contains("Yes").click();
  });
});
