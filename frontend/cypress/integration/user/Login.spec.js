describe("Test Case 1 : Login", () => {
  // beforeEach(() => {
  //   indexedDB.deleteDatabase('firebaseLocalStorageDb')
  // })

  //   it("Sign In Navigation", () => {
  //     cy.visit(Cypress.env("baseURI"));
  //     cy.contains("Sign In").click();
  //     cy.contains("Sign In")
  //       .click()
  //       .then(() => {
  //         cy.url().should("eq", Cypress.env("baseURI") + "signin");
  //       });
  //   });

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

  it("Missing @ in the email", () => {
    cy.visit("http://localhost:3000/");
    cy.get("form").find("input").first().type("3rdyeargroupproject0gmail.com");
    cy.get("form").find("input").last().type("admin123");
    cy.get("form").contains("Login").click();
    cy.get('[type="email"]').then(($input) => {
      expect($input[0].validationMessage).to.eq(
        "Please include an '@' in the email address. '3rdyeargroupproject0gmail.com' is missing an '@'."
      );
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

  it("Missing @ in the email", () => {
    cy.visit("http://localhost:3000/");
    cy.get("form").find("input").first().type("shayanmalindagmail.com");
    cy.get("form").find("input").last().type("970822151v");
    cy.get("form").contains("Login").click();
    cy.get('[type="email"]').then(($input) => {
      expect($input[0].validationMessage).to.eq(
        "Please include an '@' in the email address. 'shayanmalindagmail.com' is missing an '@'."
      );
    });
  });

  it("Leaving an incomplete email", () => {
    cy.visit("http://localhost:3000/");
    cy.get("form").find("input").first().type("shayanmalinda@");
    cy.get("form").find("input").last().type("970822151v");
    cy.get("form").contains("Login").click();
    cy.get('[type="email"]').then(($input) => {
      expect($input[0].validationMessage).to.eq(
        "Please enter a part following '@'. 'shayanmalinda@' is incomplete."
      );
    });
  });
});
