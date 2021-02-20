describe("Test Case 12: Register Users", () => {
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

  it("Users Registration", () => {
    cy.visit("http://localhost:3000/adminhome");
    cy.contains("Users").click();
    cy.contains("User Registrations")
      .click()
      .then(() => {
        cy.url().should("eq", "http://localhost:3000/adminhome/registration");
        cy.contains("Single")
          .click()
          .then(() => {
            cy.url().should(
              "eq",
              "http://localhost:3000/adminhome/registration"
            );

            cy.get("input[name=firstName]").type("Sachini");
            cy.get("input[name=lastName]").type("Herath");
            cy.get("input[name=mobileNumber]").type("0758693212");
            cy.get("input[name=nic]").type("758693212v");
            cy.get("input[name=email]").type("sachini@gmail.com");
            cy.get('select[id="dropdown"]').select("Administrator");
            // cy.get("react-datepicker__input-container").type("2020-01-01");
            // cy.get("textarea[name=message]").type("criteria for the registration");
            // cy.get("form").contains("Send").click();
            cy.get("form").contains("Register Now").click();
            // cy.contains("Register Now").click();
            cy.contains("Confirm to submit");
            cy.contains("Yes").click();
          });
      });
  });
});
