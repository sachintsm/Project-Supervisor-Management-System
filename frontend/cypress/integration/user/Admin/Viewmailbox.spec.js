describe("Test Case 5 : ViewMailbox", () => {
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

  it("View MailBox", () => {
    cy.visit("http://localhost:3000/adminhome");
    cy.get("span.material-icons.MuiIcon-root")
      .first()
      .click()
      .then(() => {
        cy.url().should("eq", "http://localhost:3000/adminhome/viewmailbox");
      });
  });
});
