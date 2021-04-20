describe("Test Case 13: Supervisor Reg", () => {
  // beforeEach(() => {
  //   cy.visit("http://localhost:3000/");
  //   cy.get("form").find("input").first().type("3rdyeargroupproject0@gmail.com");
  //   cy.get("form").find("input").last().type("admin123");
  //   cy.get("form").contains("Login").click();
  //   cy.contains("Login")
  //     .click()
  //     .then(() => {
  //       cy.url().should("eq", "http://localhost:3000/" + "adminhome");
  //     });
  // });

  it("Supervisor Registration", () => {
    cy.visit("http://localhost:3000/");
    cy.contains("Sign Up Now")
      .click()
      .then(() => {
        cy.url().should("eq", "http://localhost:3000/customregistration");

        cy.get("input[name=firstName]").type("Nipuni");
        cy.get("input[name=lastName]").type("Warakagoda");
        cy.get("input[name=email]").type("nipuni@gmail.com");
        cy.get("input[name=nic]").type("975732928vv");
        cy.get("input[name=mobileNumber]").type("0772358312");
        cy.get("input[name=password]").type("123");
        cy.get("input[name=confirmPassword]").type("123");
        cy.get("input[name=educationalQualifications]").type("test");
        cy.get("input[name=jobDescription]").type("test");
        cy.get("form").contains("Register Now").click();
      });
  });
});
