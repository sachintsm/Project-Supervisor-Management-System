describe("Test Case 1 : ContactUs", () => {
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

  it("ContactUs", () => {
    cy.visit("http://localhost:3000/" + "adminhome");
    cy.contains("Message").click();
    cy.contains("Message")
      //   .click()
      .then(() => {
        cy.url().should("eq", "http://localhost:3000/adminhome");
        cy.get("input[name=firstName]").type("Sachini");
        cy.get("input[name=lastName]").type("Herath");
        cy.get("input[name=contactNumber]").type("0758693212");
        cy.get("input[name=email]").type("sachini@gmail.com");
        cy.get("textarea[name=message]").type("criteria for the registration");
        cy.get("form").contains("Send").click();
      });
  });

  it("Missing fields of the ContactUs", () => {
    cy.visit("http://localhost:3000/" + "adminhome");
    cy.contains("Message").click();
    cy.contains("Message").then(() => {
      cy.url().should("eq", "http://localhost:3000/adminhome");
      cy.get("input[name=firstName]").type("Sachini");
      cy.get("input[name=lastName]").type("Herath");
      // cy.get("input[name=contactNumber]").type("0758693212");
      // cy.get("input[name=email]").type("sachini@gmail.com");
      // cy.get("textarea[name=message]").type("criteria for the registartion");
      cy.get("form").contains("Send").click();
    });
  });

  it("Wrong email format of the ContactUs", () => {
    cy.visit("http://localhost:3000/" + "adminhome");
    cy.contains("Message").click();
    cy.contains("Message").then(() => {
      cy.url().should("eq", "http://localhost:3000/adminhome");
      cy.get("input[name=firstName]").type("Sachini");
      cy.get("input[name=lastName]").type("Herath");
      cy.get("input[name=contactNumber]").type("0758693212");
      cy.get("input[name=email]").type("sachinigmail.com");
      cy.get("textarea[name=message]").type("criteria for the registartion");
      cy.get("form").contains("Send").click();
    });
  });

  it("Wrong contact number format of the ContactUs", () => {
    cy.visit("http://localhost:3000/" + "adminhome");
    cy.contains("Message").click();
    cy.contains("Message").then(() => {
      cy.url().should("eq", "http://localhost:3000/adminhome");
      cy.get("input[name=firstName]").type("Sachini");
      cy.get("input[name=lastName]").type("Herath");
      cy.get("input[name=contactNumber]").type("075869252553212");
      cy.get("input[name=email]").type("sachini@gmail.com");
      cy.get("textarea[name=message]").type("criteria for the registartion");
      cy.get("form").contains("Send").click();
    });
  });
});
