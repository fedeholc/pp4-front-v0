import { describe, it, expect } from "vitest";
import {
  formatCurrency,
  validateEmail,
  calculateDateDifference,
  capitalizeFirstLetter,
} from "./utils";

describe("Utility Functions", () => {
  describe("formatCurrency", () => {
    it("should format currency correctly", () => {
      expect(formatCurrency(1000)).toMatch(/1\.000/);
      expect(formatCurrency(0)).toMatch(/0/);
    });

    it("should handle decimal values", () => {
      expect(formatCurrency(1000.5)).toMatch(/1\.000,50/);
    });
  });

  describe("validateEmail", () => {
    it("should validate correct email formats", () => {
      expect(validateEmail("test@example.com")).toBe(true);
      expect(validateEmail("user.name@domain.co.ar")).toBe(true);
      expect(validateEmail("admin@subdomain.example.org")).toBe(true);
    });

    it("should reject invalid email formats", () => {
      expect(validateEmail("invalid-email")).toBe(false);
      expect(validateEmail("test@")).toBe(false);
      expect(validateEmail("@domain.com")).toBe(false);
      expect(validateEmail("test.domain.com")).toBe(false);
      expect(validateEmail("")).toBe(false);
    });
  });

  describe("calculateDateDifference", () => {
    it("should calculate difference in days correctly", () => {
      const date1 = new Date("2023-01-01");
      const date2 = new Date("2023-01-05");
      expect(calculateDateDifference(date1, date2)).toBe(4);
    });

    it("should handle same dates", () => {
      const date = new Date("2023-01-01");
      expect(calculateDateDifference(date, date)).toBe(0);
    });

    it("should work regardless of date order", () => {
      const date1 = new Date("2023-01-01");
      const date2 = new Date("2023-01-05");
      expect(calculateDateDifference(date1, date2)).toBe(
        calculateDateDifference(date2, date1)
      );
    });
  });

  describe("capitalizeFirstLetter", () => {
    it("should capitalize first letter of string", () => {
      expect(capitalizeFirstLetter("hello")).toBe("Hello");
      expect(capitalizeFirstLetter("world")).toBe("World");
    });

    it("should handle already capitalized strings", () => {
      expect(capitalizeFirstLetter("Hello")).toBe("Hello");
    });

    it("should handle single character strings", () => {
      expect(capitalizeFirstLetter("a")).toBe("A");
      expect(capitalizeFirstLetter("A")).toBe("A");
    });

    it("should handle empty string", () => {
      expect(capitalizeFirstLetter("")).toBe("");
    });
  });
});
