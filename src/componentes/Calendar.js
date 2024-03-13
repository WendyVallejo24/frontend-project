import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Calendar = ({ selectedDate, handleDateChange }) => {
    const [internalSelectedDate, setInternalSelectedDate] = useState(null);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

    const toggleCalendar = () => {
        setIsCalendarOpen(!isCalendarOpen);
    };

    const closeCalendar = () => {
        setIsCalendarOpen(false);
    };

    return (
        <div>
            <div onClick={toggleCalendar}>
                <DatePicker
                    className="fecha-entrega"
                    placeholderText="Fecha de entrega"
                    selected={internalSelectedDate || (selectedDate && new Date(selectedDate))}
                    dateFormat="yyyy-MM-dd"
                    onChange={(date) => {
                        setInternalSelectedDate(date);
                        handleDateChange(date);
                        closeCalendar();
                    }}
                    onClickOutside={closeCalendar}
                />
            </div>
        </div>
    );
};

export default Calendar;
