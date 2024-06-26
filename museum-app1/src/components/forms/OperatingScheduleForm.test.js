import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import OperatingScheduleForm from './OperatingScheduleForm';

describe('OperatingScheduleForm', () => {
  const originalWarn = console.warn;
  beforeAll(() => {
    console.warn = (...args) => {
      if (args[0].includes('A locale object was not found for the provided string')) {
        return;
      }
      originalWarn(...args);
    };
  });

  afterAll(() => {
    console.warn = originalWarn;
  });

  const setup = (overrides = {}) => {
    const defaultProps = {
      museumHandleSelectDate: jest.fn(),
      museumOpenDays: [],
      museumRecurrence: 'none',
      museumSetRecurrence: jest.fn(),
      museumWeekDays: { Monday: false, Tuesday: false, Wednesday: false, Thursday: false, Friday: false, Saturday: false, Sunday: false },
      museumSetWeekDays: jest.fn(),
      museumRecurrenceStartDate: new Date(),
      museumSetRecurrenceStartDate: jest.fn(),
      museumRecurrenceEndDate: new Date(),
      museumSetRecurrenceEndDate: jest.fn(),
      errors: {},
    };

    const props = { ...defaultProps, ...overrides };
    render(<OperatingScheduleForm {...props} />);
    return props;
  };

  test('renders the date picker correctly', () => {
    setup();
    expect(screen.getByLabelText('Select Dates')).toBeInTheDocument();
  });

  test('renders the recurrence radio buttons', () => {
    setup();
    expect(screen.getByTestId('recurrence-radio-group')).toBeInTheDocument();
    expect(screen.getByLabelText('None')).toBeInTheDocument();
    expect(screen.getByLabelText('Daily')).toBeInTheDocument();
    expect(screen.getByLabelText('Weekly')).toBeInTheDocument();
  });

  test('handles radio button change', () => {
    const { museumSetRecurrence } = setup();
    fireEvent.click(screen.getByLabelText('Daily'));
    expect(museumSetRecurrence).toHaveBeenCalledWith('daily');
  });

  test('renders the checkboxes for weekly recurrence', () => {
    setup({ museumRecurrence: 'weekly' });
    expect(screen.getByTestId('checkbox-Monday')).toBeInTheDocument();
    expect(screen.getByTestId('checkbox-Tuesday')).toBeInTheDocument();
    expect(screen.getByTestId('checkbox-Wednesday')).toBeInTheDocument();
    expect(screen.getByTestId('checkbox-Thursday')).toBeInTheDocument();
    expect(screen.getByTestId('checkbox-Friday')).toBeInTheDocument();
    expect(screen.getByTestId('checkbox-Saturday')).toBeInTheDocument();
    expect(screen.getByTestId('checkbox-Sunday')).toBeInTheDocument();
  });

  test('handles checkbox change', () => {
    const { museumSetWeekDays, museumWeekDays } = setup({ museumRecurrence: 'weekly' });
    fireEvent.click(screen.getByTestId('checkbox-Monday'));
    expect(museumSetWeekDays).toHaveBeenCalledWith({ ...museumWeekDays, Monday: !museumWeekDays.Monday });
  });

  test('renders the recurrence range date fields when recurrence is not none', () => {
    setup({ museumRecurrence: 'daily' });
    expect(screen.getByTestId('start-date')).toBeInTheDocument();
    expect(screen.getByTestId('end-date')).toBeInTheDocument();
  });

  test('displays error message if open days error exists', () => {
    setup({ errors: { openDays: 'Please select open days' } });
    expect(screen.getByTestId('error-openDays')).toHaveTextContent('Please select open days');
  });
});
