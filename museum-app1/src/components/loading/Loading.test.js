import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Loading from './Loading';

const renderComponent = () => {
  return render(<Loading />);
};

test('renders CircularProgress spinner', () => {
  renderComponent();

  const spinner = screen.getByRole('progressbar');
  expect(spinner).toBeInTheDocument();
});

test('renders Loading text', () => {
  renderComponent();

  const loadingText = screen.getByText('Loading...');
  expect(loadingText).toBeInTheDocument();
  expect(loadingText).toHaveTextContent('Loading...');
});

test('renders Loading component with correct styles', () => {
  renderComponent();

  const container = screen.getByRole('progressbar').parentElement;
  expect(container).toHaveStyle({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    zIndex: 9999,
    overflow: 'hidden'
  });
});
