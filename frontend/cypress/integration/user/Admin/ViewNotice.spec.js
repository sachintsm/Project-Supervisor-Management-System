describe("Test Case 3: ViewNotice", () => {
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

  it("View Notice", () => {
    cy.visit("http://localhost:3000/adminhome");
    cy.contains("Notices").click();
    cy.contains("View Notices")
      .click()
      .then(() => {
        cy.url().should("eq", "http://localhost:3000/shared/noticeView");
      });
  });
});
