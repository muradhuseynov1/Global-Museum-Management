import { render, screen } from '@testing-library/react';
import Footer from './Footer';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import thesisIcon from '../../assets/thesis_icon1.png';

describe('Footer', () => {
  test('renders content and applies styles correctly', () => {
    const theme = createTheme();
    render(
      <ThemeProvider theme={theme}>
        <Footer />
      </ThemeProvider>
    );

    expect(screen.getByText('Global Museum Management')).toBeInTheDocument();
    expect(screen.getByText(`© ${new Date().getFullYear()} Global Museum Management. All rights reserved.`)).toBeInTheDocument();
    expect(screen.getByAltText('Logo')).toHaveAttribute('src', thesisIcon);
  });

  it('should match snapshot', () => {
    const theme = createTheme();
    const { asFragment } = render(
      <ThemeProvider theme={theme}>
        <Footer />
      </ThemeProvider>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
