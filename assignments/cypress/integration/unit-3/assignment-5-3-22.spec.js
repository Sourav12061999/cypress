describe("This the assignment of 5-3-22", () => {
  beforeEach(() => {
    cy.visit("https://example.cypress.io/todo");
  });

  it("All the buttons with right ID are there", () => {
    cy.get("#scope");
    cy.get("#hoisting");
    cy.get("#constructor-functions");
    cy.get("prototype");
  });

  it("All Local Storage Data is Present", () => {
    expect(localStorage.getItem("scope")).to.not.equal(null);
    expect(localStorage.getItem("hoisting")).to.not.equal(null);
    expect(localStorage.getItem("constructor-functions")).to.not.equal(null);
    expect(localStorage.getItem("prototype")).to.not.equal(null);
  });

  it("Checking the Data appending on Button click", () => {
    let scopeData = localStorage.getItem("scope");
    cy.get("#scope").click();
    scopeData.forEach((element, index) => {
      cy.get("ul")
        .children()
        .eq(index)
        .then((li) => {
          const text = li.text();
          expect(text).to.eq(element);
        });
    });
  });
});
