import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { CityContext } from '../../contexts/CityContext';
import AddMuseum from './AddMuseum';
import enGB from 'date-fns/locale/en-GB';
import { registerLocale } from 'react-datepicker';

registerLocale('en-GB', enGB);

const mockCityID = 'mockCityID';

const Wrapper = ({ children }) => (
  <CityContext.Provider value={{ cityID: mockCityID }}>
    {children}
  </CityContext.Provider>
);

describe('AddMuseum Component', () => {
  test('renders museum details form', () => {
    const { getByLabelText } = render(
      <BrowserRouter>
        <Wrapper>
          <AddMuseum />
        </Wrapper>
      </BrowserRouter>
    );
    expect(getByLabelText('Museum Name')).toBeInTheDocument();
    expect(getByLabelText('Museum Summary')).toBeInTheDocument();
    expect(getByLabelText('Museum History')).toBeInTheDocument();
    expect(getByLabelText('Museum Address')).toBeInTheDocument();
    expect(getByLabelText('Days and Hours')).toBeInTheDocument();
    expect(getByLabelText('Phone Number')).toBeInTheDocument();
    expect(getByLabelText('Website')).toBeInTheDocument();
  });

  test('handles museum name change', () => {
    const { getByLabelText } = render(
      <BrowserRouter>
        <Wrapper>
          <AddMuseum />
        </Wrapper>
      </BrowserRouter>
    );
    const input = getByLabelText('Museum Name');
    fireEvent.change(input, { target: { value: 'Test Museum' } });
    expect(input.value).toBe('Test Museum');
  });

  test('handles museum summary change', () => {
    const { getByLabelText } = render(
      <BrowserRouter>
        <Wrapper>
          <AddMuseum />
        </Wrapper>
      </BrowserRouter>
    );
    const input = getByLabelText('Museum Summary');
    fireEvent.change(input, { target: { value: 'Test Museum' } });
    expect(input.value).toBe('Test Museum');
  });

  test('handles museum history change', () => {
    const { getByLabelText } = render(
      <BrowserRouter>
        <Wrapper>
          <AddMuseum />
        </Wrapper>
      </BrowserRouter>
    );
    const input = getByLabelText('Museum History');
    fireEvent.change(input, { target: { value: 'Test Museum' } });
    expect(input.value).toBe('Test Museum');
  });

  test('validates museum name', () => {
    const { getByLabelText, getByRole, getAllByText } = render(
      <BrowserRouter>
        <Wrapper>
          <AddMuseum />
        </Wrapper>
      </BrowserRouter>
    );
    const input = getByLabelText('Museum Name');
    fireEvent.change(input, { target: { value: '' } });
    fireEvent.click(getByRole('button', { name: /next/i }));
    const errorMessages = getAllByText('This field cannot be empty.');
    expect(errorMessages.length).toBeGreaterThan(0);
    expect(errorMessages[0]).toBeInTheDocument();
  });

  test('validates museum summary', () => {
    const { getByLabelText, getByRole, getAllByText } = render(
      <BrowserRouter>
        <Wrapper>
          <AddMuseum />
        </Wrapper>
      </BrowserRouter>
    );
    const input = getByLabelText('Museum Summary');
    fireEvent.change(input, { target: { value: '' } });
    fireEvent.click(getByRole('button', { name: /next/i }));
    const errorMessages = getAllByText('This field cannot be empty.');
    expect(errorMessages.length).toBeGreaterThan(0);
    expect(errorMessages[0]).toBeInTheDocument();
  });

  test('validates museum website', () => {
    const { getByLabelText, getByRole, getAllByText } = render(
      <BrowserRouter>
        <Wrapper>
          <AddMuseum />
        </Wrapper>
      </BrowserRouter>
    );
    const input = getByLabelText('Website');
    fireEvent.change(input, { target: { value: '' } });
    fireEvent.click(getByRole('button', { name: /next/i }));
    const errorMessages = getAllByText('This field cannot be empty.');
    expect(errorMessages.length).toBeGreaterThan(0);
    expect(errorMessages[0]).toBeInTheDocument();
  });
});
