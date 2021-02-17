describe("Test Case 4 : Notices", () => {
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
    //   beforeEach(() => {
    //     cy.visit("http://localhost:3000/");
    //     cy.get("form").find("input").first().type("3rdyeargroupproject0@gmail.com");
    //     cy.get("form").find("input").last().type("admin123");
    //     cy.get("form").contains("Login").click();
    //     cy.contains("Login")
    //       .click()
    //       .then(() => {
    //         cy.url().should("eq", "http://localhost:3000/" + "adminhome");
    //       });
  });

  it("Create Notice", () => {
    cy.visit("http://localhost:3000/adminhome");
    cy.contains("Notices").click();
    cy.contains("Create Notice")
      .click()
      .then(() => {
        cy.url().should("eq", "http://localhost:3000/shared/notice");
      });
  });

  // it("Create Notice", () => {
  //   cy.visit("http://localhost:3000/shared/notice");
  //   cy.contains("Creating New Notice").click();
  //   cy.get("input[name='NoticeTittle']").type("Molly");
  // });

  //   it("Can fill the form", () => {
  //     cy.visit("http://localhost:3000/adminhome");
  //     cy.contains("Notices").click();
  //     cy.contains("Create Notice")
  //       .click()
  //       .then(() => {
  //         cy.url().should("eq", "http://localhost:3000/shared/notice");

  //       });
  //     // cy.visit("http://localhost:3000/shared/notice");
  //     cy.contains("Creating New Notice");

  //     cy.get("input[name='NoticeTittle']").type("Molly");
});
