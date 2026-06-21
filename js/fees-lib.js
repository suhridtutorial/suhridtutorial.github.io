// Pure helpers used by multiple pages (loaded as module)
import { sb } from "./supabase.js";

// Returns the monthly fee that applied for (year, month) for a student.
// Uses fee_history: starts at students.monthly_fee, then any revision rows
// whose effective_from_year/month <= target apply (latest wins).
export async function feeForMonth(student, year, month){
  const { data:revs } = await sb.from("fee_history")
    .select("new_fee,effective_from_year,effective_from_month")
    .eq("student_id", student.student_id)
    .order("effective_from_year",{ascending:true})
    .order("effective_from_month",{ascending:true});
  let fee = Number(student.monthly_fee||0);
  (revs||[]).forEach(r=>{
    const tgt = year*12 + (month-1);
    const eff = r.effective_from_year*12 + (r.effective_from_month-1);
    if (eff <= tgt) fee = Number(r.new_fee);
  });
  return fee;
}

// All (year,month) periods this student is liable for, from admission up to today.
// Inactive/Left students stop generating dues after their last collected month
// (we still include up to today; UI shows status). Simpler & predictable.
export function periodsFromAdmission(admissionISO, untilY, untilM){
  const d = new Date(admissionISO);
  let y = d.getFullYear(), m = d.getMonth()+1;
  const out = [];
  while (y < untilY || (y===untilY && m <= untilM)){
    out.push({y,m});
    m++; if (m>12){ m=1; y++; }
  }
  return out;
}

// Build a month-wise ledger for a student.
export async function ledger(student){
  const { y, m } = window.thisYM();
  let periods = periodsFromAdmission(student.admission_date, y, m);
  if (student.status !== "Active"){
    // stop at current month anyway (no future dues)
  }
  const { data: pays } = await sb.from("fee_collections")
    .select("*").eq("student_id", student.student_id);
  const byKey = {};
  (pays||[]).forEach(p => byKey[`${p.fee_year}-${p.fee_month}`] = p);

  const rows = [];
  for (const p of periods){
    const key = `${p.y}-${p.m}`;
    const pay = byKey[key];
    const fee = pay ? Number(pay.monthly_fee_snapshot) : await feeForMonth(student, p.y, p.m);
    const paid = pay ? Number(pay.amount_paid) : 0;
    const disc = pay ? Number(pay.discount) : 0;
    rows.push({
      year:p.y, month:p.m, fee, paid, discount:disc,
      due: Math.max(fee - paid - disc, 0),
      date: pay ? pay.collection_date : null,
      note: pay ? pay.payment_note : null,
      hasPayment: !!pay,
    });
  }
  return rows;
}

// Allocate an advance lump-sum across unpaid future months (starting from startY/M).
// Returns array of allocations [{year,month,fee,amount}].
export async function allocateAdvance(student, amount, startY, startM){
  amount = Number(amount);
  const allocations = [];
  let y = startY, m = startM;
  const { data: existing } = await sb.from("fee_collections")
    .select("fee_year,fee_month").eq("student_id", student.student_id);
  const paidSet = new Set((existing||[]).map(p=>`${p.fee_year}-${p.fee_month}`));
  // hard limit 60 months to avoid runaway
  for (let i=0; i<60 && amount > 0; i++){
    const key = `${y}-${m}`;
    if (!paidSet.has(key)){
      const fee = await feeForMonth(student, y, m);
      const pay = Math.min(amount, fee);
      allocations.push({ year:y, month:m, fee, amount:pay });
      amount -= pay;
    }
    m++; if (m>12){ m=1; y++; }
  }
  return { allocations, leftover: amount };
}
