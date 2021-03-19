describe("Test Case 2: NoticeView", () => {
  it("Login Supervisor", () => {
    cy.visit("http://localhost:3000/");
    cy.get("form").find("input").first().type("sachintsmuthumala@gmail.com");
    cy.get("form").find("input").last().type("950880333v");
    cy.get("form").contains("Login").click();
    cy.contains("Login")
      .click()
      .then(() => {
        cy.url().should("eq", "http://localhost:3000/" + "supervisorhome");
      });
  });

  it("Notice View", () => {
    cy.visit("http://localhost:3000/supervisorhome");
    cy.contains("Notices")
      .click()
      .then(() => {
        cy.url().should("eq", "http://localhost:3000/shared/noticeView");
      });
  });

  //   it("View Attachment", () => {
  //     cy.visit("http://localhost:3000/shared/noticeView");
  //     cy.get("a.crd_atchmnt")
  //       .last()
  //       .click()
  //       .then(() => {
  //         cy.url().should(
  //           "eq",
  //           "http://localhost:4000/notice/noticeAttachment/NOTICE_FILE%20-2098Screenshot%20(1).png"
  //         );
  //       });
  //   });

  it("Published By Admins", () => {
    cy.visit("http://localhost:3000/supervisorhome");
    cy.contains("Published By Admins")
      .first()
      .click()
      .then(() => {
        cy.url().should("eq", "http://localhost:3000/shared/noticeView");
      });
  });
});
