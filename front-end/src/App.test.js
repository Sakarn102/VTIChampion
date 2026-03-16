import { render, screen } from '@testing-library/react';
import App from './App';

test('renders logo text', () => {
  render(<App />);
  const linkElement = screen.getByText(/MCQ Training/i);
  expect(linkElement).toBeInTheDocument();
});
