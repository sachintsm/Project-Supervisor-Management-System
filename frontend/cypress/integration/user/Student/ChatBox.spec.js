// describe("Test Case 1 : ChatBox", () => {
//   //   beforeEach(() => {
//   //     cy.visit("http://localhost:3000/");
//   //     cy.get("form").find("input").first().type("sachin@gmail.com");
//   //     cy.get("form").find("input").last().type("950880333v");
//   //     cy.get("form").contains("Login").click();
//   //     cy.contains("Login")
//   //       .click()
//   //       .then(() => {
//   //         cy.url().should("eq", "http://localhost:3000/" + "studenthome");
//   //       });
//   //   });

//   it("Login Student", () => {
//     cy.visit("http://localhost:3000/");
//     cy.get("form").find("input").first().type("sachin@gmail.com");
//     cy.get("form").find("input").last().type("950880333v");
//     cy.get("form").contains("Login").click();
//     cy.contains("Login")
//       .click()
//       .then(() => {
//         cy.url().should("eq", "http://localhost:3000/" + "studenthome");
//       });
//   });

//   it("Chat Box", () => {
//     cy.visit("http://localhost:3000/studenthome");
//     cy.contains("E-supervision")
//       .click()
//       .then(() => {
//         cy.url().should("eq", "http://localhost:3000/studenthome/viewproject");
//       });
//     cy.contains("Chat Box")
//       .click()
//       .then(() => {
//         cy.url().should(
//           "eq",
//           "http://localhost:3000/studenthome/chat/5ebd1591abd73b6e0cc760e2"
//         );
//       });
//   });
// });
