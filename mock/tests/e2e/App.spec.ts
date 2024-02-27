import { expect, test } from "@playwright/test";

/**
  The general shapes of tests in Playwright Test are:
    1. Navigate to a URL
    2. Interact with the page
    3. Assert something about the page against your expectations
  Look for this pattern in the tests below!
 */

test.beforeEach(() => {});

test("on page load, i see a login button", async ({ page }) => {
  await page.goto("http://localhost:8000/");
  await expect(page.getByLabel("Login")).toBeVisible();
});

test("on page load, i dont see the input box until login", async ({ page }) => {
  await page.goto("http://localhost:8000/");
  await expect(page.getByLabel("Sign Out")).not.toBeVisible();
  await expect(page.getByLabel("Command input")).not.toBeVisible();

  // click the login button
  await page.getByLabel("Login").click();
  await expect(page.getByLabel("Sign Out")).toBeVisible();
  await expect(page.getByLabel("Command input")).toBeVisible();
});

test("after I type into the input box, its text changes", async ({ page }) => {
  // Step 1: Navigate to a URL
  await page.goto("http://localhost:8000/");
  await page.getByLabel("Login").click();

  // Step 2: Interact with the page
  // Locate the element you are looking for
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("Awesome command");

  // Step 3: Assert something about the page
  // Assertions are done by using the expect() function
  const mock_input = `Awesome command`;
  await expect(page.getByLabel("Command input")).toHaveValue(mock_input);
});

test("on page load, i see a button", async ({ page }) => {
  // CHANGED
  await page.goto("http://localhost:8000/");
  await page.getByLabel("Login").click();
  await expect(
    page.getByRole("button", { name: "Submitted 0 times" })
  ).toBeVisible();
});

test("after I click the button, its label increments", async ({ page }) => {
  // CHANGED
  await page.goto("http://localhost:8000/");
  await page.getByLabel("Login").click();
  await expect(
    page.getByRole("button", { name: "Submitted 0 times" })
  ).toBeVisible();
  await page.getByRole("button", { name: "Submitted 0 times" }).click();
  await expect(
    page.getByRole("button", { name: "Submitted 1 times" })
  ).toBeVisible();
});

test("after I click the button, my command gets pushed", async ({ page }) => {
  // CHANGED
  await page.goto("http://localhost:8000/");
  await page.getByLabel("Login").click();
  await page.getByLabel("Command input").fill("Awesome command");
  await page.getByRole("button", { name: "Submitted 0 times" }).click();

  // you can use page.evaulate to grab variable content from the page for more complex assertions
  const firstChild = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[0]?.textContent;
  });
  expect(firstChild).toEqual("invalid command: Awesome command");
});

test("my view command outputs an error message if no file was loaded", async ({
  page,
}) => {
  // CHANGED
  await page.goto("http://localhost:8000/");
  await page.getByLabel("Login").click();
  await page.getByLabel("Command input").fill("view");
  await page.getByRole("button", { name: "Submitted 0 times" }).click();

  // you can use page.evaulate to grab variable content from the page for more complex assertions
  const firstChild = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[0]?.textContent;
  });
  expect(firstChild).toEqual("Result: No file loaded");
});

test("my view command outputs the loaded file if file was loaded", async ({
  page,
}) => {
  // CHANGED
  await page.goto("http://localhost:8000/");
  await page.getByLabel("Login").click();
  await page.getByLabel("Command input").fill("load_file exampleCSV1");
  await page.getByRole("button", { name: "Submitted 0 times" }).click();
  await page.getByLabel("Command input").fill("view");
  await page.getByRole("button", { name: "Submitted 1 times" }).click();

  const firstChild = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[0]?.textContent;
  });
  const secondChild = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[1]?.textContent;
  });
  expect(firstChild).toEqual("Result: Loaded file: exampleCSV1");
  expect(secondChild).toEqual("Result: Currently viewing loaded CSV");
});

test("after I search for a file that doesn't exist, it outputs an error message", async ({
  page,
}) => {
  await page.goto("http://localhost:8000/");
  await page.getByLabel("Login").click();
  await page.getByLabel("Command input").fill("view booo");
  await page.getByRole("button", { name: "Submitted 0 times" }).click();

  const firstChild = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[0]?.textContent;
  });
  expect(firstChild).toEqual("Result: No file loaded");
});

test("search works when the desired value is in the desired column", async ({
  page,
}) => {
  await page.goto("http://localhost:8000/");
  await page.getByLabel("Login").click();
  await page.getByLabel("Command input").fill("load_file exampleCSV1");
  await page.getByRole("button", { name: "Submitted 0 times" }).click();
  await page.getByLabel("Command input").fill("search 0 1");
  await page.getByRole("button", { name: "Submitted 1 times" }).click();

  const firstChild = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[0]?.textContent;
  });
  const secondChild = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[1]?.textContent;
  });
  const thirdChild = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[2]?.textContent;
  });
  expect(firstChild).toEqual("Result: Loaded file: exampleCSV1");
  expect(secondChild).toEqual("Result: Values found in the following row(s): ");
  expect(thirdChild).toEqual("1, 2, 3, 4, 5");
});

test("search works when there are multiple matching rows", async ({ page }) => {
  await page.goto("http://localhost:8000/");
  await page.getByLabel("Login").click();
  await page.getByLabel("Command input").fill("load_file income_by_race");
  await page.getByRole("button", { name: "Submitted 0 times" }).click();
  await page.getByLabel("Command input").fill("search 0 RI");
  await page.getByRole("button", { name: "Submitted 1 times" }).click();

  const firstChild = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[0]?.textContent;
  });
  const secondChild = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[1]?.textContent;
  });
  expect(firstChild).toEqual("Result: Loaded file: income_by_race");
  expect(secondChild).toEqual("Result: Values found in the following row(s): ");

  const eleventhChild = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[2]?.textContent;
  });
  expect(eleventhChild).toEqual(
    "RI, White, $1,058.47, 395773.6521, $1.00, 75%"
  );

  const twelfthChild = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[3]?.textContent;
  });
  expect(twelfthChild).toEqual("RI, Black, $770.26, 30424.80376, $0.73 , 6%");

  const thirteenthChild = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[4]?.textContent;
  });
  expect(thirteenthChild).toEqual(
    "RI, Native American/American Indian, $471.07, 2315.505646, $0.45, 0%"
  );

  const fourteenthChild = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[5]?.textContent;
  });
  expect(fourteenthChild).toEqual(
    "RI, Asian-Pacific Islander, $1,080.09, 18956.71657, $1.02, 4%"
  );

  const fifthteenthChild = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[6]?.textContent;
  });
  expect(fifthteenthChild).toEqual(
    "RI, Hispanic/Latino, $673.14, 74596.18851, $0.64, 14%"
  );

  const sixteenthChild = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[7]?.textContent;
  });
  expect(sixteenthChild).toEqual(
    "RI, Multiracial, $971.89, 8883.049171, $0.92, 2%"
  );
});

test("search outputs a message when no matching values were found in the column", async ({
  page,
}) => {
  await page.goto("http://localhost:8000/");
  await page.getByLabel("Login").click();
  await page.getByLabel("Command input").fill("load_file exampleCSV1");
  await page.getByRole("button", { name: "Submitted 0 times" }).click();
  await page.getByLabel("Command input").fill("search 0 hihihi");
  await page.getByRole("button", { name: "Submitted 1 times" }).click();

  const firstChild = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[0]?.textContent;
  });
  const secondChild = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[1]?.textContent;
  });
  expect(firstChild).toEqual("Result: Loaded file: exampleCSV1");
  expect(secondChild).toEqual("Result: No values found with given parameters");
});

test("search outputs a message when too little parameters are given", async ({
  page,
}) => {
  await page.goto("http://localhost:8000/");
  await page.getByLabel("Login").click();
  await page.getByLabel("Command input").fill("load_file exampleCSV1");
  await page.getByRole("button", { name: "Submitted 0 times" }).click();
  await page.getByLabel("Command input").fill("search 0");
  await page.getByRole("button", { name: "Submitted 1 times" }).click();

  const firstChild = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[0]?.textContent;
  });
  const secondChild = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[1]?.textContent;
  });
  expect(firstChild).toEqual("Result: Loaded file: exampleCSV1");
  expect(secondChild).toEqual("Result: Proper arguments not found");
});

test("load_file successfully loads a given file", async ({ page }) => {
  await page.goto("http://localhost:8000/");
  await page.getByLabel("Login").click();
  await page.getByLabel("Command input").fill("load_file exampleCSV1");
  await page.getByRole("button", { name: "Submitted 0 times" }).click();

  const firstChild = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[0]?.textContent;
  });
  expect(firstChild).toEqual("Result: Loaded file: exampleCSV1");
});

test("load_file fails to load file that does not exist in the mocked data", async ({
  page,
}) => {
  await page.goto("http://localhost:8000/");
  await page.getByLabel("Login").click();
  await page.getByLabel("Command input").fill("load_file boo");
  await page.getByRole("button", { name: "Submitted 0 times" }).click();

  const firstChild = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[0]?.textContent;
  });
  expect(firstChild).toEqual("Result: File not found");
});

test("load_file fails due to invalid number of parameters", async ({
  page,
}) => {
  await page.goto("http://localhost:8000/");
  await page.getByLabel("Login").click();
  await page.getByLabel("Command input").fill("load_file");
  await page.getByRole("button", { name: "Submitted 0 times" }).click();

  const firstChild = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[0]?.textContent;
  });
  expect(firstChild).toEqual("Result: Proper arguments not found");
});

test("mode changes successfully and consecutively", async ({ page }) => {
  await page.goto("http://localhost:8000/");
  await page.getByLabel("Login").click();
  await page.getByLabel("Command input").fill("mode");
  await page.getByRole("button", { name: "Submitted 0 times" }).click();

  const firstChild = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[0]?.textContent;
  });
  expect(firstChild).toEqual("Result: Mode changed to verbose");

  await page.getByLabel("Command input").fill("mode");
  await page.getByRole("button", { name: "Submitted 1 times" }).click();
  const secondChild = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[1]?.textContent;
  });
  const thirdChild = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[2]?.textContent;
  });

  expect(secondChild).toEqual("mode");
  expect(thirdChild).toEqual("Result: Mode changed to brief");
});

test("both modes successfully display text with other commands", async ({
  page,
}) => {
  await page.goto("http://localhost:8000/");
  await page.getByLabel("Login").click();
  await page.getByLabel("Command input").fill("load_file exampleCSV1");
  await page.getByRole("button", { name: "Submitted 0 times" }).click();

  const firstChild = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[0]?.textContent;
  });
  expect(firstChild).toEqual("Result: Loaded file: exampleCSV1");

  await page.getByLabel("Command input").fill("mode");
  await page.getByRole("button", { name: "Submitted 1 times" }).click();
  const secondChild = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[1]?.textContent;
  });

  expect(secondChild).toEqual("Result: Mode changed to verbose");

  await page.getByLabel("Command input").fill("load_file income_by_race");
  await page.getByRole("button", { name: "Submitted 2 times" }).click();
  const fourthChild = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[2]?.textContent;
  });
  const fifthChild = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[3]?.textContent;
  });
  expect(fourthChild).toEqual("load_file income_by_race");
  expect(fifthChild).toEqual("Result: Loaded file: income_by_race");
});

test("boo is successfully added to the function map", async ({ page }) => {
  await page.goto("http://localhost:8000/");
  await page.getByLabel("Login").click();
  await page.getByLabel("Command input").fill("boo");
  await page.getByRole("button", { name: "Submitted 0 times" }).click();

  const firstChild = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[0]?.textContent;
  });
  expect(firstChild).toEqual("Result: boo");
});

test("compound commands: load_file view mode loadfile view mode search mode search", async ({
  page,
}) => {
  await page.goto("http://localhost:8000/");
  await page.getByLabel("Login").click();
  await page.getByLabel("Command input").fill("load_file exampleCSV1");
  await page.getByRole("button", { name: "Submitted 0 times" }).click();
  await page.getByLabel("Command input").fill("view");
  await page.getByRole("button", { name: "Submitted 1 times" }).click();
  await page.getByLabel("Command input").fill("mode");
  await page.getByRole("button", { name: "Submitted 2 times" }).click();
  await page.getByLabel("Command input").fill("load_file income_by_race");
  await page.getByRole("button", { name: "Submitted 3 times" }).click();
  await page.getByLabel("Command input").fill("view");
  await page.getByRole("button", { name: "Submitted 4 times" }).click();
  await page.getByLabel("Command input").fill("mode");
  await page.getByRole("button", { name: "Submitted 5 times" }).click();
  await page.getByLabel("Command input").fill("search 2 $1,058.47");
  await page.getByRole("button", { name: "Submitted 6 times" }).click();
  await page.getByLabel("Command input").fill("mode");
  await page.getByRole("button", { name: "Submitted 7 times" }).click();
  await page.getByLabel("Command input").fill("search 2 $1,058.47");
  await page.getByRole("button", { name: "Submitted 8 times" }).click();

  const firstChild = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[0]?.textContent;
  });
  expect(firstChild).toEqual("Result: Loaded file: exampleCSV1");

  const secondChild = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[1]?.textContent;
  });
  expect(secondChild).toEqual("Result: Currently viewing loaded CSV");

  const thirdChild = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[2]?.textContent;
  });
  expect(thirdChild).toEqual("Row 1: 1, 2, 3, 4, 5");

  const fourthChild = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[3]?.textContent;
  });
  expect(fourthChild).toEqual("Row 2: The, song, remains, the, same.");

  const fifthChild = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[4]?.textContent;
  });
  expect(fifthChild).toEqual("Result: Mode changed to verbose");

  const sixthChild = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[5]?.textContent;
  });
  expect(sixthChild).toEqual("load_file income_by_race");

  const seventhChild = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[6]?.textContent;
  });
  expect(seventhChild).toEqual("Result: Loaded file: income_by_race");

  const eighthChild = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[7]?.textContent;
  });
  expect(eighthChild).toEqual("view");

  const ninthChild = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[8]?.textContent;
  });
  expect(ninthChild).toEqual("Result: Currently viewing loaded CSV");

  const tenthChild = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[9]?.textContent;
  });
  expect(tenthChild).toEqual(
    "Row 1: State, Data Type, Average Weekly Earnings, Number of Workers, Earnings Disparity, Employed Percent"
  );

  const eleventhChild = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[10]?.textContent;
  });
  expect(eleventhChild).toEqual(
    "Row 2: RI, White, $1,058.47, 395773.6521, $1.00, 75%"
  );

  const twelfthChild = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[11]?.textContent;
  });
  expect(twelfthChild).toEqual(
    "Row 3: RI, Black, $770.26, 30424.80376, $0.73 , 6%"
  );

  const thirteenthChild = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[12]?.textContent;
  });
  expect(thirteenthChild).toEqual(
    "Row 4: RI, Native American/American Indian, $471.07, 2315.505646, $0.45, 0%"
  );

  const fourteenthChild = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[13]?.textContent;
  });
  expect(fourteenthChild).toEqual(
    "Row 5: RI, Asian-Pacific Islander, $1,080.09, 18956.71657, $1.02, 4%"
  );

  const fifthteenthChild = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[14]?.textContent;
  });
  expect(fifthteenthChild).toEqual(
    "Row 6: RI, Hispanic/Latino, $673.14, 74596.18851, $0.64, 14%"
  );

  const sixteenthChild = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[15]?.textContent;
  });
  expect(sixteenthChild).toEqual(
    "Row 7: RI, Multiracial, $971.89, 8883.049171, $0.92, 2%"
  );

  const seventeenthChild = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[16]?.textContent;
  });
  expect(seventeenthChild).toEqual("mode");

  const eighteenthChild = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[17]?.textContent;
  });
  expect(eighteenthChild).toEqual("Result: Mode changed to brief");

  const nineteenthChild = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[18]?.textContent;
  });
  expect(nineteenthChild).toEqual(
    "Result: Values found in the following row(s): "
  );

  const twentiethChild = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[19]?.textContent;
  });
  expect(twentiethChild).toEqual(
    "RI, White, $1,058.47, 395773.6521, $1.00, 75%"
  );

  const twentifirstChild = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[20]?.textContent;
  });
  expect(twentifirstChild).toEqual("Result: Mode changed to verbose");

  const twentysecondChild = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[21]?.textContent;
  });
  expect(twentysecondChild).toEqual("search 2 $1,058.47");

  const twentyThirdChild = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[22]?.textContent;
  });
  expect(twentyThirdChild).toEqual(
    "Result: Values found in the following row(s): "
  );

  const twentyFourthChild = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[23]?.textContent;
  });
  expect(twentyFourthChild).toEqual(
    "RI, White, $1,058.47, 395773.6521, $1.00, 75%"
  );
});
