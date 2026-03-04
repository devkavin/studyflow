import DatePicker from 'react-datepicker';

type DatePickerInputProps = {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    minDate?: Date;
    id?: string;
};

export default function DatePickerInput({ value, onChange, placeholder = 'Select date', minDate, id }: DatePickerInputProps) {
    return (
        <DatePicker
            id={id}
            selected={value ? new Date(value) : null}
            onChange={(date: Date | null) => onChange(date ? date.toISOString().slice(0, 10) : '')}
            dateFormat="MMM d, yyyy"
            placeholderText={placeholder}
            minDate={minDate}
            isClearable
            className="w-full rounded-md border-slate-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-950"
        />
    );
}
