import React, { useState, useEffect } from 'react';
import GenericModule from '../../GenericModule';
import api from '../../../utils/api';
import { Modal } from '../../../components/UI';
import { useAuth } from '../../../context/AuthContext';

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
  // Fill leading empty slots
  for (let i = 0; i < firstDay; i++) calendarDays.push(null);
  // Fill month days
  for (let i = 1; i <= daysInMonth; i++) calendarDays.push(i);

  const monthName = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(currentDate);

  return (
    <div className="p-6">
      {/* Calendar Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">{monthName}</h2>
          <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mt-1">Holidays Overview</p>
        </div>
        <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
          <button onClick={prevMonth} className="cal-nav-btn" title="Previous Month">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <div className="w-px h-4 bg-slate-200 mx-1"></div>
          <button onClick={nextMonth} className="cal-nav-btn" title="Next Month">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="cal-grid">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d, i) => (
          <div key={d} className={`cal-head ${i === 0 ? 'text-red-500 bg-red-50/30' : ''}`}>
            {d}
          </div>
        ))}
        {calendarDays.map((day, i) => {
          const dayHolidays = day ? getDayHolidays(day) : [];
          const isSunday = i % 7 === 0;
          const isMuted = !day;

          return (
            <div key={i} className={`cal-cell ${isMuted ? 'cal-cell-muted' : ''} ${day && isSunday ? 'cal-cell-sun' : ''}`}>
              {day && (
                <>
                  <div className="flex justify-between items-start mb-2">
                    <span className={`cal-day-num ${isSunday ? 'cal-day-num-sun' : ''}`}>{day}</span>
                    {isSunday && <span className="text-[9px] font-extrabold text-red-300 uppercase tracking-tighter">OFF</span>}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    {dayHolidays.map(h => {
                      const type = h.holiday_type?.toUpperCase();
                      const isNational = type === 'NATIONAL';
                      const isReligious = type === 'RELIGIOUS';
                      
                      let variantClass = 'cal-holiday-other';
                      if (isNational) variantClass = 'cal-holiday-nat';
                      if (isReligious) variantClass = 'cal-holiday-rel';

                      return (
                        <div key={h.id} 
                          onClick={() => setSelectedHoliday(h)}
                          className={`cal-holiday ${variantClass}`}
                          title={h.holiday_name}>
                          <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60"></span>
                            {h.holiday_name}
                          </div>
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

      {/* Holiday Details Modal */}
      {selectedHoliday && (
        <Modal open={!!selectedHoliday} onClose={() => setSelectedHoliday(null)} title="Holiday Details" size="sm"
          footer={<button onClick={() => setSelectedHoliday(null)} className="btn btn-primary w-full">Got it</button>}>
          <div className="text-center py-4">
            <div className={`inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 shadow-sm ${
              selectedHoliday.holiday_type?.toUpperCase() === 'NATIONAL' ? 'bg-blue-100 text-blue-700' : 
              selectedHoliday.holiday_type?.toUpperCase() === 'RELIGIOUS' ? 'bg-purple-100 text-purple-700' : 
              'bg-emerald-100 text-emerald-700'
            }`}>
              {selectedHoliday.holiday_type}
            </div>
            <h3 className="text-3xl font-black text-slate-800 leading-tight mb-2">{selectedHoliday.holiday_name}</h3>
            <div className="flex items-center justify-center gap-2 text-slate-400 font-medium">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              {new Date(selectedHoliday.holiday_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default function HolidaysPage() {
  const [view, setView] = useState('calendar');
  const [allHolidays, setAllHolidays] = useState([]);
  const { user } = useAuth();

  const fetchAll = () => {
    if (!user?.company_id) return;
    api.get('/holidays', { params: { limit: 1000, company_id: user.company_id } }).then(r => setAllHolidays(r.data || r || []));
  };

  useEffect(() => {
    fetchAll();
  }, [user?.company_id]);

  const companyHolidays = allHolidays.filter(h => h.company_id === user?.company_id);

  const toggleButton = (
    <button onClick={() => setView(v => v === 'list' ? 'calendar' : 'list')} 
      className="btn btn-sm btn-outline flex items-center gap-2 bg-white hover:bg-slate-50 border-slate-200 text-slate-600 font-semibold shadow-sm px-4 py-2">
      {view === 'list' ? (
        <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg> Calendar View</>
      ) : (
        <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg> List View</>
      )}
    </button>
  );

  return (
    <div className="animate-fade-in">
      {view === 'list' ? (
        <GenericModule title="Holidays" endpoint="holidays"
          filterCols={[{key:'holiday_type',label:'Type'}]}
          columns={[
            {key:'holiday_date',label:'Date',type:'date'},
            {key:'holiday_name',label:'Holiday name'},
            {key:'holiday_type',label:'Type',render: v => (
              <span className={`badge ${
                v === 'NATIONAL' ? 'badge-blue' : 
                v === 'RELIGIOUS' ? 'badge-purple' : 
                'badge-green'
              }`}>{v}</span>
            )}
          ]}
          fields={[
            {key:'holiday_date',label:'Holiday date',required:true,type:'date'},
            {key:'holiday_name',label:'Holiday name',required:true,minLen:3,maxLen:50},
            {key:'holiday_type',label:'Holiday type',required:true,type:'select',options:[{v:'NATIONAL',l:'National'},{v:'REGIONAL',l:'Regional'},{v:'RELIGIOUS',l:'Religious'},{v:'COMPANY',l:'Company'}]},
            {key:'country_id',label:'Country / Location',required:true,type:'lov',lovEndpoint:'locations',labelFn:o=>`${o.City}, ${o.State}, ${o.Country}`},
          ]}
          extraActions={() => toggleButton}
          onSuccess={fetchAll}
          staticFilters={{ company_id: user?.company_id }}
        />
      ) : (
        <div className="card overflow-hidden">
          <div className="card-hdr bg-white border-b border-slate-100 flex justify-between items-center px-6 py-4">
            <div>
              <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </span>
                Holidays Calendar
              </h3>
            </div>
            {toggleButton}
          </div>
          <HolidayCalendar data={companyHolidays} />
        </div>
      )}
    </div>
  );
}
