/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import SearchInput from "@/app/components/SearchInput";
import ErrorMessage from "@/app/components/ErrorMessage";

// Mock next/font
jest.mock("next/font/google", () => ({
  Playfair_Display: () => ({ variable: "--font-display" }),
  DM_Sans: () => ({ variable: "--font-body" }),
  DM_Mono: () => ({ variable: "--font-mono" }),
}));

// --- SearchInput ---
describe("SearchInput", () => {
  it("renders the input and search button", () => {
    const mockSearch = jest.fn();
    render(<SearchInput onSearch={mockSearch} isLoading={false} />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /search/i })).toBeInTheDocument();
  });

  it("shows validation error on empty submit", () => {
    const mockSearch = jest.fn();
    render(<SearchInput onSearch={mockSearch} isLoading={false} />);
    fireEvent.click(screen.getByRole("button", { name: /search/i }));
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(mockSearch).not.toHaveBeenCalled();
  });

  it("shows format error for invalid IMDb ID", () => {
    const mockSearch = jest.fn();
    render(<SearchInput onSearch={mockSearch} isLoading={false} />);
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "invalidid" } });
    fireEvent.click(screen.getByRole("button", { name: /search/i }));
    expect(screen.getByRole("alert")).toHaveTextContent(/invalid/i);
    expect(mockSearch).not.toHaveBeenCalled();
  });

  it("calls onSearch with valid IMDb ID", () => {
    const mockSearch = jest.fn();
    render(<SearchInput onSearch={mockSearch} isLoading={false} />);
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "tt0133093" } });
    fireEvent.click(screen.getByRole("button", { name: /search/i }));
    expect(mockSearch).toHaveBeenCalledWith("tt0133093");
  });

  it("calls onSearch on Enter key press", () => {
    const mockSearch = jest.fn();
    render(<SearchInput onSearch={mockSearch} isLoading={false} />);
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "tt0111161" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(mockSearch).toHaveBeenCalledWith("tt0111161");
  });

  it("disables input and button while loading", () => {
    const mockSearch = jest.fn();
    render(<SearchInput onSearch={mockSearch} isLoading={true} />);
    expect(screen.getByRole("textbox")).toBeDisabled();
  });

  it("renders example ID buttons", () => {
    const mockSearch = jest.fn();
    render(<SearchInput onSearch={mockSearch} isLoading={false} />);
    expect(screen.getByText("tt0133093")).toBeInTheDocument();
  });
});

// --- ErrorMessage ---
describe("ErrorMessage", () => {
  it("renders error message text", () => {
    render(<ErrorMessage message="Movie not found." />);
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("Movie not found.")).toBeInTheDocument();
  });

  it("shows retry button when onRetry is provided", () => {
    const mockRetry = jest.fn();
    render(<ErrorMessage message="Error" onRetry={mockRetry} />);
    const retryBtn = screen.getByRole("button", { name: /try again/i });
    expect(retryBtn).toBeInTheDocument();
    fireEvent.click(retryBtn);
    expect(mockRetry).toHaveBeenCalledTimes(1);
  });

  it("hides retry button when no onRetry provided", () => {
    render(<ErrorMessage message="Error" />);
    expect(screen.queryByRole("button", { name: /try again/i })).not.toBeInTheDocument();
  });
});
