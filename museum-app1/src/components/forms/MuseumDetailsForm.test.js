import { render, screen, fireEvent } from '@testing-library/react';
import MuseumDetailsForm from './MuseumDetailsForm';

describe('MuseumDetailsForm', () => {
    const mockHandleChange = jest.fn();
    const initialValues = {
        name: '',
        summary: '',
        history: '',
        address: '',
        daysAndHours: '',
        phoneNumber: '',
        website: ''
    };
    const errors = {
        name: 'Name required',
        summary: 'Summary required',
        history: 'History required',
        address: 'Address required',
        daysAndHours: 'Opening hours required',
        phoneNumber: 'Phone number required',
        website: 'Website required'
    };

    beforeEach(() => {
        render(<MuseumDetailsForm
            museumValue={initialValues}
            handleMuseumChange={mockHandleChange}
            errors={errors}
        />);
    });

    it('renders all text fields and displays errors', () => {
        const fields = [
            { label: 'Museum Name', error: 'Name required' },
            { label: 'Museum Summary', error: 'Summary required' },
            { label: 'Museum History', error: 'History required' },
            { label: 'Museum Address', error: 'Address required' },
            { label: 'Days and Hours', error: 'Opening hours required' },
            { label: 'Phone Number', error: 'Phone number required' },
            { label: 'Website', error: 'Website required' }
        ];

        fields.forEach(field => {
            const input = screen.getByLabelText(field.label);
            expect(input).toBeInTheDocument();
            fireEvent.change(input, { target: { value: 'Test' } });
            expect(mockHandleChange).toHaveBeenCalled();
            expect(screen.getByText(field.error)).toBeInTheDocument();
        });
    });
});
