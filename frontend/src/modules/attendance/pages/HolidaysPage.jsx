import React, { useState, useEffect } from 'react';
import GenericModule from '../../GenericModule';
import api from '../../../utils/api';
import { Modal } from '../../../components/UI';

const HolidayCalendar = ({ data }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedHoliday, setSelectedHoliday] = useState(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const holidaysInMonth = data.filter(h => {
    const d = new Date(h.holiday_date);
    return d.getFullYear() === year && d.getMonth() === month;
  });

  const getDayHolidays = day => {
    return holidaysInMonth.filter(h => new Date(h.holiday_date).getDate() === day);
  };

  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) calendarDays.push(null);
  for (let i = 1; i <= daysInMonth; i++) calendarDays.push(i);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">
          {new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(currentDate)}
        </h2>
        <div className="flex gap-2">
          <button onClick={prevMonth} className="btn btn-outline btn-sm p-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button onClick={nextMonth} className="btn btn-outline btn-sm p-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px bg-gray-200 border border-gray-200 rounded-lg overflow-hidden">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <div key={d} className="bg-gray-50 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
            {d}
          </div>
        ))}
        {calendarDays.map((day, i) => {
          const dayHolidays = day ? getDayHolidays(day) : [];
          const isSunday = i % 7 === 0;
          return (
            <div key={i} className={`bg-white min-h-[100px] p-2 ${!day ? 'bg-gray-50' : ''} ${day && isSunday ? 'bg-gray-50' : ''}`}>
              {day && (
                <>
                  <div className="flex justify-between items-start">
                    <span className={`text-sm font-medium ${isSunday ? 'text-red-400' : 'text-gray-400'}`}>{day}</span>
                    {isSunday && <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">SUN</span>}
                  </div>
                  <div className="mt-1 space-y-1">
                    {dayHolidays.map(h => {
                      const isNational = h.holiday_type === 'NATIONAL';
                      const isReligious = h.holiday_type === 'RELIGIOUS';
                      let colorClass = 'bg-gray-100 text-gray-700 border-gray-200';
                      if (isNational) colorClass = 'bg-blue-100 text-blue-800 border-blue-200';
                      if (isReligious) colorClass = 'bg-purple-100 text-purple-800 border-purple-200';

                      return (
                        <div key={h.id} 
                          onClick={() => setSelectedHoliday(h)}
                          className={`text-[10px] p-1.5 rounded border cursor-pointer truncate transition-all hover:brightness-95 ${colorClass}`}>
                          {h.holiday_name}
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {selectedHoliday && (
        <Modal open={!!selectedHoliday} onClose={() => setSelectedHoliday(null)} title="Holiday Details" size="md"
          footer={<button onClick={() => setSelectedHoliday(null)} className="btn btn-primary">Close</button>}>
          <div className="p-2">
            <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-4 ${
              selectedHoliday.holiday_type === 'NATIONAL' ? 'bg-blue-100 text-blue-700' : 
              selectedHoliday.holiday_type === 'RELIGIOUS' ? 'bg-purple-100 text-purple-700' : 
              'bg-gray-100 text-gray-700'
            }`}>
              {selectedHoliday.holiday_type}
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">{selectedHoliday.holiday_name}</h3>
            <p className="text-gray-500 flex items-center gap-2">
              📅 {new Date(selectedHoliday.holiday_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default function HolidaysPage() {
  const [view, setView] = useState('list');
  const [allHolidays, setAllHolidays] = useState([]);

  const fetchAll = () => api.get('/holidays', { params: { limit: 1000 } }).then(r => setAllHolidays(r.data || []));

  useEffect(() => {
    fetchAll();
  }, []);

  const extraActions = () => (
    <button onClick={() => setView(v => v === 'list' ? 'calendar' : 'list')} className="btn btn-sm btn-outline mr-2 whitespace-nowrap">
      {view === 'list' ? '📅 Calendar View' : '📋 List View'}
    </button>
  );

  return (
    <div>
      {view === 'list' ? (
        <GenericModule title="Holidays" endpoint="holidays"
          filterCols={[{key:'holiday_type',label:'Type'}]}
          columns={[{key:'holiday_date',label:'Date',type:'date'},{key:'holiday_name',label:'Holiday name'},{key:'holiday_type',label:'Type',type:'badge'}]}
          fields={[
            {key:'holiday_date',label:'Holiday date',required:true,type:'date'},
            {key:'holiday_name',label:'Holiday name',required:true,minLen:3,maxLen:50},
            {key:'holiday_type',label:'Holiday type',required:true,type:'select',options:[{v:'NATIONAL',l:'National'},{v:'REGIONAL',l:'Regional'},{v:'RELIGIOUS',l:'Religious'},{v:'COMPANY',l:'Company'}]},
            {key:'country_id',label:'Country / Location',required:true,type:'lov',lovEndpoint:'locations',labelFn:o=>`${o.City}, ${o.State}, ${o.Country}`},
          ]}
          extraActions={extraActions}
          onSuccess={fetchAll}
        />
      ) : (
        <div className="card">
          <div className="card-hdr">
            <h3 className="font-bold text-gray-800 text-base">Holidays Calendar</h3>
            <div className="ml-auto">
              {extraActions()}
            </div>
          </div>
          <HolidayCalendar data={allHolidays} />
        </div>
      )}
    </div>
  );
}
