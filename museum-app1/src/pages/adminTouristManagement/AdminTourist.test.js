import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import AdminTourist from './AdminTourist';

jest.mock('../../components/tables/TouristTable', () => (props) => (
  <div data-testid="TouristTable">
    <button onClick={() => props.onEdit({ id: 1, name: 'Test Tourist' })}>Edit Tourist</button>
  </div>
));

jest.mock('../../components/forms/TouristForm', () => (props) => (
  <div data-testid="TouristForm">
    <button onClick={props.onSave}>Save</button>
    <button onClick={props.onCancel}>Cancel</button>
  </div>
));

jest.mock('../../components/appBars/AdminAppBar', () => () => <div data-testid="AdminAppBar" />);
jest.mock('../../components/footer/Footer', () => () => <div data-testid="Footer" />);

describe('AdminTourist', () => {
  test('renders AdminTourist component', () => {
    render(<AdminTourist />);
    
    expect(screen.getByTestId('AdminAppBar')).toBeInTheDocument();
    expect(screen.getByTestId('Footer')).toBeInTheDocument();
    expect(screen.getByText('Tourist Management')).toBeInTheDocument();
    expect(screen.getByText('Add New Tourist')).toBeInTheDocument();
    expect(screen.getByTestId('TouristTable')).toBeInTheDocument();
  });

  test('shows TouristForm when Add New Tourist button is clicked', () => {
    render(<AdminTourist />);
    
    fireEvent.click(screen.getByText('Add New Tourist'));
    
    expect(screen.getByTestId('TouristForm')).toBeInTheDocument();
    expect(screen.queryByTestId('TouristTable')).not.toBeInTheDocument();
  });

  test('shows TouristForm when editing a tourist', () => {
    render(<AdminTourist />);
    
    fireEvent.click(screen.getByText('Edit Tourist'));
    
    expect(screen.getByTestId('TouristForm')).toBeInTheDocument();
    expect(screen.queryByTestId('TouristTable')).not.toBeInTheDocument();
  });

  test('hides TouristForm and shows TouristTable when save is clicked', () => {
    render(<AdminTourist />);
    
    fireEvent.click(screen.getByText('Add New Tourist'));
    fireEvent.click(screen.getByText('Save'));
    
    expect(screen.getByTestId('TouristTable')).toBeInTheDocument();
    expect(screen.queryByTestId('TouristForm')).not.toBeInTheDocument();
  });

  test('hides TouristForm and shows TouristTable when cancel is clicked', () => {
    render(<AdminTourist />);
    
    fireEvent.click(screen.getByText('Add New Tourist'));
    fireEvent.click(screen.getByText('Cancel'));
    
    expect(screen.getByTestId('TouristTable')).toBeInTheDocument();
    expect(screen.queryByTestId('TouristForm')).not.toBeInTheDocument();
  });
});
