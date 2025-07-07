import { render, screen } from '@testing-library/react';
import App from './App';
import Layout from "./App";

test('renders learn react link', () => {
  render(<Layout />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
