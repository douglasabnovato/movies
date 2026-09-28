/*
 * setupTests.js · carrega os matchers do jest-dom e silencia o aviso de depreciação
 * do act emitido internamente pela Testing Library 13 com React 18.3.
 */
import "@testing-library/jest-dom";

const originalError = console.error;

/* Filtra apenas o aviso conhecido da biblioteca; os demais erros continuam visíveis. */
beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation((message, ...args) => {
    if (typeof message === "string" && message.includes("ReactDOMTestUtils.act")) return;
    originalError(message, ...args);
  });
});

/* Restaura o console original. */
afterAll(() => {
  console.error.mockRestore();
});
/* fim de setupTests.js */
