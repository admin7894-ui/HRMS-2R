import React, { useEffect, useRef } from 'react';
import GenericModule from '../../GenericModule';
import api from '../../../utils/api';

function AdvanceRecoveryLogic({ form, setForm, api, editing }) {
  const prevAdvanceId = useRef(null);

  useEffect(() => {
    const aid = form.HRMS_advance_id;
    if (!aid) {
      prevAdvanceId.current = null;
      return;
    }
    if (aid === prevAdvanceId.current) return;
    prevAdvanceId.current = aid;

    // Fetch the Advance record to get Installment Amount and Total Installments
    api.get(`/advance-payments/${aid}`).then(res => {
      const adv = res.data || {};
      const instAmt = parseFloat(adv.installment_amount) || 0;
      const totalInst = parseInt(adv.total_installments) || 0;

      if (!editing) {
        // Only auto-fill for new records
        api.get('/advance-recovery-schedules', { params: { HRMS_advance_id: aid, limit: 1000 } }).then(sRes => {
          const schedules = sRes.data || [];
          const nextNo = schedules.length + 1;
          setForm(p => ({
            ...p,
            installment_amount: instAmt,
            installment_no: nextNo,
            _totalInstallments: totalInst
          }));
        });
      } else {
        setForm(p => ({ ...p, _totalInstallments: totalInst }));
      }
    }).catch(() => {});
  }, [form.HRMS_advance_id, setForm, api, editing]);

  useEffect(() => {
    const instAmt = parseFloat(form.installment_amount) || 0;
    const paidAmt = parseFloat(form.paid_amount) || 0;
    const balance = Math.max(0, instAmt - paidAmt);

    let status = 'PENDING';
    if (paidAmt > 0) {
      if (paidAmt < instAmt) status = 'PARTIAL';
      else status = 'PAID';
    }

    if (
      parseFloat(form.balance_amount || 0) !== balance ||
      form.payment_status !== status
    ) {
      setForm(p => ({
        ...p,
        balance_amount: balance,
        payment_status: status
      }));
    }
  }, [form.installment_amount, form.paid_amount, setForm]);

  return null;
}

export default function AdvanceRecoveryPage() {
  const customValidate = (form) => {
    const errs = {};
    if (form.installment_no && form._totalInstallments) {
      if (parseInt(form.installment_no) > parseInt(form._totalInstallments)) {
        errs.installment_no = `Cannot create installment no. ${form.installment_no} because limit is ${form._totalInstallments} in Advance Payment`;
      }
    }
    return errs;
  };

  const handleSuccess = async (data, body) => {
    const aid = body.HRMS_advance_id;
    if (!aid) return;

    try {
      // Sync Advance Payment record
      const sRes = await api.get('/advance-recovery-schedules', { params: { HRMS_advance_id: aid, limit: 1000 } });
      const schedules = sRes.data || [];
      const recovered = schedules.reduce((acc, s) => acc + (parseFloat(s.paid_amount) || 0), 0);
      
      const aRes = await api.get(`/advance-payments/${aid}`);
      const adv = aRes.data || {};
      const advanceAmt = parseFloat(adv.advance_amount) || 0;
      const remaining = Math.max(0, advanceAmt - recovered);
      
      let nextStatus = adv.advance_status;
      if (remaining <= 0 && advanceAmt > 0) {
        nextStatus = 'CLOSED';
      }

      await api.put(`/advance-payments/${aid}`, {
        ...adv,
        recovered_amount: recovered,
        remaining_balance: remaining,
        advance_status: nextStatus
      });
    } catch (e) {
      console.error('Failed to sync Advance Payment:', e);
    }
  };

  return <GenericModule title="Advance recovery schedules" endpoint="advance-recovery-schedules"
    filterCols={[{key:'payment_status',label:'Status'}]}
    customValidate={customValidate}
    onSuccess={handleSuccess}
    columns={[
      {key:'HRMS_advance_id',label:'Advance / employee',render:(_,r)=>r.Advance_Display||r._advanceLabel||r.Employee_Name||r.HRMS_advance_id||'—'},
      {key:'installment_no',label:'#'},
      {key:'due_date',label:'Due date',type:'date'},
      {key:'installment_amount',label:'Amount',type:'currency'},
      {key:'payment_status',label:'Status',type:'badge'},
    ]}
    fields={[
      {key:'HRMS_advance_id',label:'Advance',required:true,type:'lov',lovEndpoint:'advance-payments',
        labelFn:o=>`${o._displayId||o.id} — ₹${Number(parseFloat(o.advance_amount)||0).toLocaleString('en-IN')}`},
      {key:'installment_no',label:'Installment no.',required:true,numeric:true,min:1},
      {key:'due_date',label:'Due date',required:true,type:'date'},
      {key:'installment_amount',label:'Installment amount',numeric:true,min:0,readOnly:true,tooltip:'Auto-filled from Advance Payment record'},
      {key:'paid_amount',label:'Paid amount',numeric:true,min:0},
      {key:'balance_amount',label:'Balance amount',numeric:true,min:0,readOnly:true,tooltip:'Auto-calculated: Installment Amount - Paid Amount'},
      {key:'payment_date',label:'Payment date',type:'date'},
      {key:'payment_status',label:'Payment status',type:'select',options:[{v:'PENDING',l:'Pending'},{v:'PAID',l:'Paid'},{v:'PARTIAL',l:'Partial'},{v:'OVERDUE',l:'Overdue'}],readOnly:true},
    ]}
    extraForm={(props) => <AdvanceRecoveryLogic {...props} />}
  />;
}
