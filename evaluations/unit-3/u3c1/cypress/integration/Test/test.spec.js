import "cypress-localstorage-commands";
import arr from "../../../data.js";
C1Testcase();

function generateScore(a, s, weight) {
  const attempt = cy.state("runnable")._currentRetry;

  s = attempt === 1 ? -weight : weight;

  a += s;

  a = a < 0 ? 0 : a;

  return a;
}

function C1Testcase() {
  describe("C1", () => {
    let acc_score = 0;
    let score = 0;
    beforeEach(() => {
      cy.restoreLocalStorage();
    });

    afterEach(() => {
      cy.saveLocalStorage();
    });
    arr.forEach((url) => {
      console.log(url);
      if (url && url.link) {
        if (url.link.charAt(url.link.length - 1) != "/") {
          url.link = url.link + "/";
        }

        it(` ${url.link} add product 1`, { retries: 1 }, () => {
          cy.visit(url.link);
          cy.saveLocalStorage();

          cy.get("#name").type("shoe 1");
          cy.get("#price").type(1000);
          cy.get("#type").type("casuals");
          cy.get("#image").type(
            "https://dt2sdf0db8zob.cloudfront.net/wp-content/uploads/2019/12/9-Best-Online-Avatars-and-How-to-Make-Your-Own-for-Free-image1-5.png"
          );

          cy.get("#submit").click();

          acc_score = generateScore(0, score, 1);
        });

        it(` ${url.link} add product 2`, { retries: 1 }, () => {
          cy.visit(url.link);
          cy.saveLocalStorage();

          cy.get("#name").type("shoe 2");
          cy.get("#price").type(2000);
          cy.get("#type").type("sports");
          cy.get("#image").type(
            "https://dt2sdf0db8zob.cloudfront.net/wp-content/uploads/2019/12/9-Best-Online-Avatars-and-How-to-Make-Your-Own-for-Free-image1-5.png"
          );

          cy.get("#submit").click();
          acc_score = generateScore(acc_score, score, 1);
        });
        it(
          ` ${url.link} check if data added to localstorage`,
          { retries: 1 },
          () => {
            cy.restoreLocalStorage();

            let data = JSON.parse(localStorage.getItem("products"));

            expect(data.length).to.equal(2);

            expect(data[0].name).to.equal("shoe 1");

            acc_score = generateScore(acc_score, score, 2);

            //expect(JSON.parse(localStorage.getItem("products")).length).to.equal(1);
          }
        );
        it(
          `${url.link} check if data shown on inventory`,
          { retries: 1 },
          () => {
            cy.restoreLocalStorage();
            cy.get("#show_products").click();

            cy.get("#products_data").children().should("have.length", 2);

            //expect(JSON.parse(localStorage.getItem("products")).length).to.equal(1);
            acc_score = generateScore(acc_score, score, 3);
          }
        );

        it(`${url.link} check remove functionality`, { retries: 1 }, () => {
          cy.restoreLocalStorage();

          cy.get("#products_data > div > button").then((y) => {
            y[0].click();

            expect(
              JSON.parse(localStorage.getItem("products")).length
            ).to.equal(1);
          });
          acc_score = generateScore(acc_score, score, 3);
          console.log("final score:", acc_score);
          fetch(`http://localhost:3000/data/${url.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ ...url, score: acc_score }),
          })
            .then((res) => res.json())
            .then((res) => {
              console.log(res);
            })
            .catch((error) => {
              console.error(error);
            });
        });
      }
    });
  });
}
