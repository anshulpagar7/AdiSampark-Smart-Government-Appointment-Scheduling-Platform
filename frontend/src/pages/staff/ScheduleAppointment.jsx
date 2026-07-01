import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { useRealtime } from "../../hooks/useRealtime";
import { syncCalendarCreate } from "../../lib/calendarSync";

// ─────────────────────────────────────────────────────────────────────────────
// SHARED SLOT ENGINE  (identical to CitizenBooking — do not diverge)
// ─────────────────────────────────────────────────────────────────────────────

const DURATION_OPTIONS = [5, 10, 15, 20, 25];

const SLOT_GROUPS = [
  { section: "morning",   slots: ["12:00 PM","12:05 PM","12:10 PM","12:15 PM","12:20 PM"] },
  { section: "morning",   slots: ["12:30 PM","12:35 PM","12:40 PM","12:45 PM","12:50 PM"] },
  { section: "morning",   slots: ["01:00 PM","01:05 PM","01:10 PM","01:15 PM","01:20 PM"] },
  { section: "afternoon", slots: ["02:30 PM","02:35 PM","02:40 PM","02:45 PM","02:50 PM"] },
  { section: "afternoon", slots: ["03:00 PM","03:05 PM","03:10 PM","03:15 PM","03:20 PM"] },
  { section: "afternoon", slots: ["03:30 PM","03:35 PM","03:40 PM","03:45 PM","03:50 PM"] },
  { section: "afternoon", slots: ["04:00 PM","04:05 PM","04:10 PM","04:15 PM","04:20 PM"] },
  { section: "afternoon", slots: ["04:30 PM","04:35 PM","04:40 PM","04:45 PM","04:50 PM"] },
];

const ALL_SLOTS = SLOT_GROUPS.flatMap(g => g.slots);

function slotToMinutes(slotStr) {
  const d = new Date(`1970-01-01 ${slotStr}`);
  return d.getHours() * 60 + d.getMinutes();
}

/** Returns the end-time string for a given start slot + duration, e.g. "12:20 PM" */
function computeEndTime(startSlot, durationMinutes) {
  const startMin = slotToMinutes(startSlot);
  const endMin   = startMin + durationMinutes;
  const h = Math.floor(endMin / 60);
  const m = endMin % 60;
  const suffix = h < 12 ? "AM" : "PM";
  const h12    = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${String(h12).padStart(2,"0")}:${String(m).padStart(2,"0")} ${suffix}`;
}

/** Returns array of slot strings the appointment occupies, or null if it crosses a break. */
function getOccupiedSlots(startSlot, durationMinutes) {
  const slotsNeeded = durationMinutes / 5;
  const startIdx = ALL_SLOTS.indexOf(startSlot);
  if (startIdx === -1) return null;

  const occupied = [];
  for (let i = 0; i < slotsNeeded; i++) {
    const idx = startIdx + i;
    if (idx >= ALL_SLOTS.length) return null;
    occupied.push(ALL_SLOTS[idx]);
  }

  // All slots must be in the same group (no crossing breaks/lunch/close)
  const groupOf = slot => SLOT_GROUPS.findIndex(g => g.slots.includes(slot));
  const firstGroup = groupOf(occupied[0]);
  if (firstGroup === -1) return null;
  for (const s of occupied) {
    if (groupOf(s) !== firstGroup) return null;
  }
  return occupied;
}

/** Expand booked appointments into a Set of all occupied slot strings. */
function buildOccupiedSet(bookedAppointments) {
  const occupied = new Set();
  for (const appt of bookedAppointments) {
    const dur = appt.appointment_duration ?? 5;
    const slots = getOccupiedSlots(appt.appointment_time, dur);
    if (slots) slots.forEach(s => occupied.add(s));
  }
  return occupied;
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function getTodayStr() {
  const n = new Date();
  return `${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,"0")}-${String(n.getDate()).padStart(2,"0")}`;
}

function isWeekendStr(dateStr) {
  if (!dateStr) return false;
  const [y,m,d] = dateStr.split("-").map(Number);
  const day = new Date(y, m-1, d).getDay();
  return day === 0 || day === 6;
}

// ─────────────────────────────────────────────────────────────────────────────
// SLOT GRID sub-component  (mirrors CitizenBooking SlotRow but in staff style)
// ─────────────────────────────────────────────────────────────────────────────

function SlotGrid({ occupiedSet, selectedSlot, setSelectedSlot, duration, isToday, nowMinutes }) {

  function getStatus(slotStr) {
    if (isToday && slotToMinutes(slotStr) <= nowMinutes) return "past";
    if (occupiedSet.has(slotStr)) return "booked";
    const run = getOccupiedSlots(slotStr, duration);
    if (!run) return "too-short";
    for (const s of run) { if (occupiedSet.has(s)) return "run-blocked"; }
    return "available";
  }

  const selectedRun = selectedSlot ? (getOccupiedSlots(selectedSlot, duration) ?? []) : [];

  const morningGroups   = SLOT_GROUPS.filter(g => g.section === "morning");
  const afternoonGroups = SLOT_GROUPS.filter(g => g.section === "afternoon");

  const visibleMorning   = morningGroups.flatMap(g=>g.slots).some(s => getStatus(s) !== "past");
  const visibleAfternoon = afternoonGroups.flatMap(g=>g.slots).some(s => getStatus(s) !== "past");

  function renderGroup(groups) {
    return groups.map((group, gi) => {
      const visible = group.slots.filter(s => !(isToday && slotToMinutes(s) <= nowMinutes));
      if (visible.length === 0) return null;
      return (
        <div key={gi} style={{ marginBottom: 12 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 8 }}>
            {visible.map(slotStr => {
              const status    = getStatus(slotStr);
              const isStart   = selectedSlot === slotStr;
              const isInRun   = !isStart && selectedRun.includes(slotStr);
              const isClickable = status === "available";

              let bg, border, color, fw, opacity, sublabel;
              if (isStart) {
                bg="#2563EB"; border="#2563EB"; color="#fff"; fw=700; opacity=1;
                sublabel=<span style={{display:"block",fontSize:9,color:"rgba(255,255,255,0.85)",fontWeight:700,marginTop:2}}>Start</span>;
              } else if (isInRun) {
                bg="#DBEAFE"; border="#93C5FD"; color="#1E3A8A"; fw=700; opacity=1;
                sublabel=<span style={{display:"block",fontSize:9,color:"#2563EB",fontWeight:700,marginTop:2}}>✓</span>;
              } else if (status === "booked") {
                bg="#FEF2F2"; border="#FECACA"; color="#9CA3AF"; fw=500; opacity=1;
                sublabel=<span style={{display:"block",fontSize:9,color:"#EF4444",fontWeight:700,marginTop:2}}>Booked</span>;
              } else {
                // available, too-short, run-blocked — all look normal (staff sees full grid)
                bg="#fff"; border="#E2E8F0"; color="#374151"; fw=500; opacity=1;
                sublabel=null;
              }

              return (
                <button
                  key={slotStr}
                  onClick={() => isClickable && setSelectedSlot(slotStr)}
                  disabled={!isClickable}
                  title={
                    status==="booked"      ? "Already booked" :
                    status==="too-short"   ? `Not enough room for ${duration} min` :
                    status==="run-blocked" ? "A slot in this range is booked" : ""
                  }
                  style={{
                    padding:"10px 4px", borderRadius:10,
                    border:`1.5px solid ${border}`,
                    background: bg, color, fontWeight:fw, fontSize:12,
                    cursor: isClickable ? "pointer" : "default",
                    opacity,
                    transform: isStart ? "scale(1.06)" : isInRun ? "scale(1.03)" : "scale(1)",
                    transition:"all 0.15s",
                    boxShadow: isStart ? "0 4px 12px rgba(37,99,235,0.35)" : "none",
                    minHeight:48,
                  }}
                >
                  {slotStr.replace(" PM","").replace(" AM","")}
                  {sublabel}
                </button>
              );
            })}
          </div>
        </div>
      );
    });
  }

  return (
    <div>
      {/* Morning */}
      {visibleMorning && (
        <div style={{ marginBottom: 20 }}>
          <p style={{ margin:"0 0 10px", fontSize:11, fontWeight:700, color:"#94A3B8", textTransform:"uppercase", letterSpacing:"0.08em" }}>
            ☀️ Morning Session — 12:00 PM to 1:30 PM
          </p>
          {renderGroup(morningGroups)}
        </div>
      )}

      {/* Lunch banner (only if both sessions visible) */}
      {visibleMorning && visibleAfternoon && (
        <div style={{
          background:"#FEF3C7", border:"1px solid #FDE68A", borderRadius:10,
          padding:"10px 16px", textAlign:"center", marginBottom:20,
          color:"#92400E", fontWeight:700, fontSize:13,
        }}>
          🍽 Lunch Break — 1:30 PM to 2:30 PM
        </div>
      )}

      {/* Afternoon */}
      {visibleAfternoon && (
        <div style={{ marginBottom: 8 }}>
          <p style={{ margin:"0 0 10px", fontSize:11, fontWeight:700, color:"#94A3B8", textTransform:"uppercase", letterSpacing:"0.08em" }}>
            🌤 Afternoon Session — 2:30 PM to 5:00 PM
          </p>
          {renderGroup(afternoonGroups)}
        </div>
      )}

      {!visibleMorning && !visibleAfternoon && (
        <p style={{ color:"#94A3B8", fontSize:13 }}>No slots available for today.</p>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function ScheduleAppointment() {
  const [form, setForm] = useState({
    name: "", mobile: "", purpose: "", officer: "",
    date: "", location: "",
  });
  const [duration, setDuration]     = useState(5);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [created, setCreated]       = useState(false);
  const [appointmentId]             = useState("SHA-" + Math.floor(1000 + Math.random() * 9000));
  const [errors, setErrors]         = useState({});
  const [saving, setSaving]         = useState(false);

  // Booked appointments for selected date
  const [bookedAppointments, setBookedAppointments] = useState([]);

  // Holiday state + warning
  const [holidays, setHolidays]               = useState([]);
  const [holidayWarning, setHolidayWarning]   = useState(null);  // { reason, dateStr } | null
  const [holidayConfirmed, setHolidayConfirmed] = useState(false);

  // Real-time clock
  const [nowMinutes, setNowMinutes] = useState(() => {
    const n = new Date(); return n.getHours() * 60 + n.getMinutes();
  });
  useEffect(() => {
    const tick = setInterval(() => {
      const n = new Date(); setNowMinutes(n.getHours() * 60 + n.getMinutes());
    }, 60000);
    return () => clearInterval(tick);
  }, []);

  // Fetch holidays on mount
  useEffect(() => {
    supabase.from("holidays")
      .select("holiday_name, holiday_date")
      .then(({ data }) => { if (data) setHolidays(data); });
  }, []);

  // Fetch booked appointments + clear slot when date/duration changes
  useEffect(() => {
    setSelectedSlot("");
    if (!form.date) { setBookedAppointments([]); return; }
    supabase
      .from("appointments")
      .select("appointment_time, appointment_duration")
      .eq("appointment_date", form.date)
      .then(({ data, error }) => {
        if (!error && data) setBookedAppointments(data);
        else setBookedAppointments([]);
      });
  }, [form.date]);

  // Clear slot when duration changes
  useEffect(() => { setSelectedSlot(""); }, [duration]);

  // ── Realtime: slot availability updates instantly when others book ──
  useRealtime("appointments", () => {
    if (form.date) {
      supabase
        .from("appointments")
        .select("appointment_time, appointment_duration")
        .eq("appointment_date", form.date)
        .then(({ data, error }) => {
          if (!error && data) setBookedAppointments(data);
        });
    }
  });

  // ── Date change handler with holiday/weekend warning ──────────────────────
  function handleDateChange(dateStr) {
    setForm(f => ({ ...f, date: dateStr }));
    setHolidayConfirmed(false);
    setHolidayWarning(null);

    if (!dateStr) return;

    // Check holiday
    const holiday = holidays.find(h => h.holiday_date === dateStr);
    if (holiday) {
      setHolidayWarning({ reason: holiday.holiday_name, type: "holiday" });
      return;
    }
    // Check weekend
    if (isWeekendStr(dateStr)) {
      const [y,m,d] = dateStr.split("-").map(Number);
      const dayName = new Date(y,m-1,d).getDay() === 0 ? "Sunday" : "Saturday";
      setHolidayWarning({ reason: dayName, type: "weekend" });
    }
  }

  const handleChange = e => {
    const { name, value } = e.target;
    if (name === "date") { handleDateChange(value); }
    else { setForm(f => ({ ...f, [name]: value })); }
    setErrors(prev => ({ ...prev, [name]: "" }));
  };

  // ── Occupied set ──────────────────────────────────────────────────────────
  const occupiedSet = buildOccupiedSet(bookedAppointments);

  const isToday = form.date === getTodayStr();

  // ── Validation ────────────────────────────────────────────────────────────
  function validate() {
    const e = {};
    if (!form.name.trim())                               e.name    = "Name is required";
    if (!form.mobile.trim() || !/^\d{10}$/.test(form.mobile)) e.mobile = "Enter a valid 10-digit mobile number";
    if (!form.purpose)                                   e.purpose = "Please select a purpose";
    if (!form.officer)                                   e.officer = "Please select an officer";
    if (!form.date)                                      e.date    = "Please select a date";
    if (!selectedSlot)                                   e.slot    = "Please select a time slot";
    return e;
  }

  // ── Save ──────────────────────────────────────────────────────────────────
  const handleCreate = async () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }

    // Confirm holiday warning before proceeding
    if (holidayWarning && !holidayConfirmed) {
      setErrors(prev => ({ ...prev, date: `This date is a ${holidayWarning.type === "weekend" ? "weekend" : "holiday"}. Click "Confirm Anyway" to proceed.` }));
      return;
    }

    // Verify all required slots are still free (race-condition safety)
    const run = getOccupiedSlots(selectedSlot, duration);
    if (!run) { alert("Selected slot is invalid. Please choose another."); return; }
    for (const s of run) {
      if (occupiedSet.has(s)) {
        alert(`Slot ${s} is no longer available. Please choose a different start time.`);
        setSelectedSlot(""); return;
      }
    }

    const endTime = computeEndTime(selectedSlot, duration);

    setSaving(true);
    const { data: insertedRow, error } = await supabase.from("appointments").insert([{
      appointment_id:       appointmentId,
      citizen_name:         form.name,
      mobile:               form.mobile,
      purpose:              form.purpose,
      officer_name:         form.officer,
      appointment_date:     form.date,
      appointment_time:     selectedSlot,
      appointment_end_time: endTime,
      appointment_duration: duration,
      location:             form.location,
      status:               "Waiting",
      booking_source:       "Walk-In",
    }]).select().single();
    setSaving(false);

    if (error) { console.log(error); alert("Failed to save: " + error.message); return; }

    // ── Google Calendar sync (non-blocking — appointment already saved) ────
    try {
      const calResult = await syncCalendarCreate({
        appointment_id:       appointmentId,
        citizen_name:         form.name,
        purpose:              form.purpose,
        appointment_date:     form.date,
        appointment_time:     selectedSlot,
        appointment_end_time: endTime,
        appointment_duration: duration,
        officer_name:         form.officer,
        location:             form.location,
        mobile:               form.mobile,
        notes:                null,
      });

      if (calResult?.google_event_id) {
        await supabase
          .from("appointments")
          .update({ google_event_id: calResult.google_event_id })
          .eq("appointment_id", appointmentId);
      }
    } catch (calErr) {
      console.error("[ScheduleAppointment] Calendar sync failed:", calErr);
    }
    setCreated(true);
  };

  const handleReset = () => {
    setForm({ name:"", mobile:"", purpose:"", officer:"", date:"", location:"" });
    setDuration(5);
    setSelectedSlot("");
    setCreated(false);
    setErrors({});
    setBookedAppointments([]);
    setHolidayWarning(null);
    setHolidayConfirmed(false);
  };

  const endTime = selectedSlot ? computeEndTime(selectedSlot, duration) : "";

  // ── Confirmation screen ───────────────────────────────────────────────────
  if (created) {
    return (
      <div style={styles.page}>
        <div style={styles.successPage}>
          <div style={styles.successIcon}>✅</div>
          <h1 style={styles.successTitle}>Appointment Confirmed!</h1>
          <p style={styles.successSub}>The appointment has been created and added to the queue.</p>

          <div style={styles.summaryCard}>
            <div style={styles.tokenBadge}>
              <p style={styles.tokenLabel}>APPOINTMENT TOKEN</p>
              <p style={styles.tokenNum}>{appointmentId}</p>
            </div>
            <div style={styles.summaryGrid}>
              <SummaryRow icon="👤" label="Citizen"    value={form.name} />
              <SummaryRow icon="📱" label="Mobile"     value={form.mobile} />
              <SummaryRow icon="📋" label="Purpose"    value={form.purpose} />
              <SummaryRow icon="🏛️" label="Officer"   value={form.officer} />
              <SummaryRow icon="📅" label="Date"       value={form.date} />
              <SummaryRow icon="🕐" label="Time"       value={`${selectedSlot} – ${computeEndTime(selectedSlot, duration)}`} />
              <SummaryRow icon="⏱" label="Duration"   value={`${duration} Minutes`} />
              {form.location && <SummaryRow icon="📍" label="Location" value={form.location} />}
              <SummaryRow icon="🚶" label="Source"     value="Walk-In" />
            </div>
          </div>

          <div style={styles.successActions}>
            <div style={styles.notifRow}>
              <span style={styles.notifItem}>✅ Added to live queue</span>
              <span style={styles.notifItem}>✅ Token generated</span>
            </div>
            <button onClick={handleReset} style={styles.newBtn}>+ Schedule Another Appointment</button>
          </div>
        </div>
      </div>
    );
  }

  // ── Form ──────────────────────────────────────────────────────────────────
  return (
    <div style={styles.page}>
      <div style={styles.pageHeader}>
        <div>
          <p style={styles.eyebrow}>STAFF PORTAL</p>
          <h1 style={styles.title}>Walk-In Registration</h1>
          <p style={styles.sub}>Create appointments manually for citizens physically visiting the office.</p>
        </div>
      </div>

      <div style={styles.formLayout}>

        {/* ── Main Form ── */}
        <div style={styles.formCard}>

          {/* Section 1 — Citizen Details */}
          <div style={styles.sectionHeader}>
            <div style={styles.sectionNum}>1</div>
            <h2 style={styles.sectionTitle}>Citizen Details</h2>
          </div>

          <div style={styles.fieldsGrid}>
            <Field label="Full Name" required error={errors.name}>
              <input name="name" value={form.name} onChange={handleChange} placeholder="Enter citizen's full name"
                style={{ ...styles.input, borderColor: errors.name ? "#FCA5A5" : "#E2E8F0" }} />
            </Field>
            <Field label="Mobile Number" required error={errors.mobile}>
              <input name="mobile" value={form.mobile} onChange={handleChange} placeholder="10-digit mobile number" maxLength={10}
                style={{ ...styles.input, borderColor: errors.mobile ? "#FCA5A5" : "#E2E8F0" }} />
            </Field>
            <Field label="Purpose of Visit" required error={errors.purpose}>
              <select name="purpose" value={form.purpose} onChange={handleChange}
                style={{ ...styles.input, borderColor: errors.purpose ? "#FCA5A5" : "#E2E8F0" }}>
                <option value="">Select purpose</option>
                {["Scholarship","Education","Employment","Certificate","Complaint","Other"].map(p => <option key={p}>{p}</option>)}
              </select>
            </Field>
            <Field label="Assign Officer" required error={errors.officer}>
              <select name="officer" value={form.officer} onChange={handleChange}
                style={{ ...styles.input, borderColor: errors.officer ? "#FCA5A5" : "#E2E8F0" }}>
                <option value="">Select officer</option>
                <option>Leena Bansod</option>
              </select>
            </Field>
            <Field label="Appointment Date" required error={errors.date}>
              <input type="date" name="date" value={form.date} min={getTodayStr()} onChange={handleChange}
                style={{ ...styles.input, borderColor: errors.date ? "#FCA5A5" : "#E2E8F0" }} />
              {/* ── Holiday / Weekend warning (staff can override) ── */}
              {holidayWarning && !holidayConfirmed && (
                <div style={styles.holidayWarn}>
                  <span style={{ fontSize:16 }}>{holidayWarning.type === "weekend" ? "📅" : "🏖️"}</span>
                  <div style={{ flex:1 }}>
                    <p style={{ margin:0, fontWeight:700, fontSize:13, color:"#92400E" }}>
                      {holidayWarning.type === "weekend" ? "Weekend" : "Holiday"}: {holidayWarning.reason}
                    </p>
                    <p style={{ margin:"3px 0 0", fontSize:12, color:"#78350F" }}>
                      Staff can book on this date. Confirm to proceed.
                    </p>
                  </div>
                  <button
                    onClick={() => { setHolidayConfirmed(true); setErrors(prev => ({...prev, date:""})); }}
                    style={styles.confirmWarnBtn}
                  >
                    Confirm Anyway
                  </button>
                </div>
              )}
              {holidayWarning && holidayConfirmed && (
                <div style={styles.holidayOverridden}>
                  ✅ Holiday override confirmed
                </div>
              )}
            </Field>
            <Field label="Location / Arriving From">
              <input name="location" value={form.location} onChange={handleChange}
                placeholder="Enter city, village or area" style={styles.input} />
            </Field>
          </div>

          {/* Section 2 — Duration */}
          <div style={{ borderTop:"1px solid #F1F5F9", paddingTop:28, marginBottom:28 }}>
            <div style={styles.sectionHeader}>
              <div style={styles.sectionNum}>2</div>
              <h2 style={styles.sectionTitle}>Meeting Duration</h2>
            </div>
            <p style={{ margin:"0 0 14px", fontSize:13, color:"#64748B" }}>
              How much time does this citizen need with the officer?
            </p>
            <div style={{ display:"flex", flexWrap:"wrap", gap:10 }}>
              {DURATION_OPTIONS.map(d => {
                const sel = duration === d;
                return (
                  <button
                    key={d}
                    onClick={() => setDuration(d)}
                    style={{
                      padding:"11px 22px", borderRadius:10, fontSize:14, fontWeight: sel ? 700 : 500,
                      border:`1.5px solid ${sel ? "#2563EB" : "#E2E8F0"}`,
                      background: sel ? "#2563EB" : "#F8FAFC",
                      color: sel ? "#fff" : "#374151",
                      cursor:"pointer",
                      transform: sel ? "scale(1.04)" : "scale(1)",
                      transition:"all 0.15s",
                      boxShadow: sel ? "0 4px 12px rgba(37,99,235,0.25)" : "none",
                    }}
                  >
                    {d} min
                  </button>
                );
              })}
            </div>
            {duration > 5 && (
              <p style={{ marginTop:10, fontSize:12, color:"#2563EB", fontWeight:600 }}>
                ⏱ This will reserve {duration / 5} consecutive 5-minute slot{duration > 5 ? "s" : ""}.
              </p>
            )}
          </div>

          {/* Section 3 — Time Slot */}
          <div style={{ borderTop:"1px solid #F1F5F9", paddingTop:28 }}>
            <div style={styles.sectionHeader}>
              <div style={styles.sectionNum}>3</div>
              <h2 style={styles.sectionTitle}>Select Time Slot</h2>
            </div>

            {errors.slot && <p style={styles.errorText}>{errors.slot}</p>}

            {!form.date ? (
              <p style={{ fontSize:13, color:"#94A3B8", marginBottom:16 }}>
                Select a date above to see slot availability.
              </p>
            ) : (
              <>
                {/* Duration reminder pill */}
                <div style={{ display:"inline-flex", alignItems:"center", gap:6, background:"#EFF6FF", border:"1px solid #BFDBFE", borderRadius:99, padding:"5px 14px", marginBottom:18 }}>
                  <span style={{ fontSize:13 }}>⏱</span>
                  <span style={{ fontSize:13, fontWeight:700, color:"#2563EB" }}>{duration} min appointment</span>
                </div>

                {/* Legend */}
                <div style={{ display:"flex", alignItems:"center", flexWrap:"wrap", gap:4, marginBottom:16, fontSize:12, color:"#64748B" }}>
                  <span style={legendDot("#fff","#E2E8F0")} /> Available &nbsp;
                  <span style={legendDot("#2563EB","#2563EB")} /> Selected &nbsp;
                  <span style={legendDot("#DBEAFE","#93C5FD")} /> Reserved &nbsp;
                  <span style={legendDot("#FEF2F2","#FECACA")} /> Booked
                </div>

                <SlotGrid
                  occupiedSet={occupiedSet}
                  selectedSlot={selectedSlot}
                  setSelectedSlot={(s) => { setSelectedSlot(s); setErrors(prev => ({...prev, slot:""})); }}
                  duration={duration}
                  isToday={isToday}
                  nowMinutes={nowMinutes}
                />
              </>
            )}
          </div>

          <button
            onClick={handleCreate}
            disabled={saving}
            style={{ ...styles.submitBtn, opacity: saving ? 0.7 : 1, cursor: saving ? "not-allowed" : "pointer", marginTop:32 }}
          >
            {saving ? "Saving…" : "Create Appointment →"}
          </button>
        </div>

        {/* ── Preview Panel ── */}
        <div style={styles.previewPanel}>
          <div style={styles.previewCard}>
            <p style={styles.previewEyebrow}>APPOINTMENT PREVIEW</p>
            <div style={styles.previewContent}>
              {form.name ? (
                <>
                  <div style={styles.previewAvatar}>{form.name[0]}</div>
                  <p style={styles.previewName}>{form.name}</p>
                </>
              ) : (
                <div style={styles.previewPlaceholder}>
                  <span style={{ fontSize:"32px" }}>👤</span>
                  <p style={{ color:"#CBD5E1", margin:"8px 0 0", fontSize:"13px" }}>Fill in the form</p>
                </div>
              )}
              <div style={styles.previewDetails}>
                <PreviewRow label="Mobile"   value={form.mobile   || "—"} />
                <PreviewRow label="Purpose"  value={form.purpose  || "—"} />
                <PreviewRow label="Officer"  value={form.officer  || "—"} />
                <PreviewRow label="Date"     value={form.date     || "—"} />
                <PreviewRow label="Duration" value={`${duration} min`} />
                <PreviewRow label="Start"    value={selectedSlot  || "—"} />
                <PreviewRow label="End"      value={endTime        || "—"} />
                <PreviewRow label="Location" value={form.location || "—"} />
                <PreviewRow label="Source"   value="Walk-In" />
              </div>
            </div>
          </div>

          <div style={styles.infoCard}>
            <p style={styles.infoTitle}>📌 Office Hours</p>
            <p style={styles.infoItem}>Morning: 12:00 PM – 1:30 PM</p>
            <p style={styles.infoItem}>Lunch: 1:30 PM – 2:30 PM</p>
            <p style={styles.infoItem}>Afternoon: 2:30 PM – 5:00 PM</p>
          </div>

          <div style={{ background:"#F0FDF4", border:"1px solid #BBF7D0", borderRadius:12, padding:"16px 18px" }}>
            <p style={{ margin:"0 0 8px", fontWeight:700, fontSize:13, color:"#15803D" }}>🛡️ Staff Privileges</p>
            <p style={{ margin:0, fontSize:12, color:"#166534", lineHeight:1.6 }}>
              As staff, you can book on weekends and holidays with confirmation.
              Citizen-facing booking blocks those dates automatically.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPER COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

function Field({ label, required, error, children }) {
  return (
    <div style={{ marginBottom:"4px" }}>
      <label style={{ display:"block", marginBottom:"7px", fontSize:"13px", fontWeight:"600", color:"#374151" }}>
        {label} {required && <span style={{ color:"#EF4444" }}>*</span>}
      </label>
      {children}
      {error && <p style={{ margin:"5px 0 0", color:"#DC2626", fontSize:"12px" }}>{error}</p>}
    </div>
  );
}

function SummaryRow({ icon, label, value }) {
  return (
    <div style={{ display:"flex", gap:"12px", padding:"12px 0", borderBottom:"1px solid #F1F5F9" }}>
      <span style={{ fontSize:"16px", width:"24px" }}>{icon}</span>
      <span style={{ color:"#64748B", fontSize:"14px", flex:"0 0 120px" }}>{label}</span>
      <span style={{ fontWeight:"700", color:"#111827", fontSize:"14px" }}>{value}</span>
    </div>
  );
}

function PreviewRow({ label, value }) {
  return (
    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"10px" }}>
      <span style={{ fontSize:"12px", color:"#94A3B8", fontWeight:"600" }}>{label}</span>
      <span style={{ fontSize:"13px", color:"#111827", fontWeight:"600", textAlign:"right", maxWidth:"130px" }}>{value}</span>
    </div>
  );
}

const legendDot = (bg, border) => ({
  display:"inline-block", width:14, height:14, borderRadius:4,
  background:bg, border:`1.5px solid ${border}`,
  marginRight:5, verticalAlign:"middle",
});

// ─────────────────────────────────────────────────────────────────────────────
// STYLES  (original preserved; new items appended)
// ─────────────────────────────────────────────────────────────────────────────

const styles = {
  page:         { padding:"36px 40px", background:"#F8FAFC", minHeight:"100vh", fontFamily:"'Segoe UI', system-ui, sans-serif" },
  pageHeader:   { marginBottom:"28px" },
  eyebrow:      { margin:"0 0 6px", fontSize:"11px", fontWeight:"700", letterSpacing:"2px", color:"#2563EB" },
  title:        { margin:"0 0 4px", fontSize:"28px", fontWeight:"800", color:"#111827" },
  sub:          { margin:0, fontSize:"14px", color:"#64748B" },
  formLayout:   { display:"grid", gridTemplateColumns:"1fr 300px", gap:"24px" },
  formCard:     { background:"#fff", borderRadius:"16px", padding:"32px", boxShadow:"0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)" },
  sectionHeader:{ display:"flex", alignItems:"center", gap:"12px", marginBottom:"24px" },
  sectionNum:   { width:"28px", height:"28px", borderRadius:"50%", background:"#2563EB", color:"#fff", fontWeight:"700", fontSize:"14px", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 },
  sectionTitle: { margin:0, fontSize:"18px", fontWeight:"700", color:"#111827" },
  fieldsGrid:   { display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(240px, 1fr))", gap:"20px", marginBottom:"36px" },
  input:        { width:"100%", padding:"12px 14px", border:"1.5px solid #E2E8F0", borderRadius:"10px", fontSize:"14px", background:"#F8FAFC", color:"#111827", outline:"none", boxSizing:"border-box", marginTop:"2px" },
  errorText:    { color:"#DC2626", fontSize:"12px", margin:"0 0 12px" },
  submitBtn:    { background:"linear-gradient(135deg,#2563EB,#1d4ed8)", color:"#fff", border:"none", padding:"14px 28px", borderRadius:"12px", fontSize:"15px", fontWeight:"700", letterSpacing:"0.3px" },
  // Holiday warning
  holidayWarn:  { marginTop:10, display:"flex", alignItems:"flex-start", gap:10, background:"#FEF3C7", border:"1px solid #FDE68A", borderRadius:10, padding:"12px 14px" },
  confirmWarnBtn:{ flexShrink:0, background:"#D97706", color:"#fff", border:"none", borderRadius:8, padding:"7px 13px", fontSize:12, fontWeight:700, cursor:"pointer" },
  holidayOverridden: { marginTop:8, fontSize:12, fontWeight:700, color:"#059669", background:"#ECFDF5", border:"1px solid #A7F3D0", borderRadius:8, padding:"7px 12px", display:"inline-block" },
  // Preview Panel
  previewPanel: { display:"flex", flexDirection:"column", gap:"16px" },
  previewCard:  { background:"#fff", borderRadius:"16px", padding:"24px", boxShadow:"0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)" },
  previewEyebrow:{ margin:"0 0 16px", fontSize:"10px", fontWeight:"700", letterSpacing:"1.5px", color:"#94A3B8" },
  previewContent:{},
  previewAvatar: { width:"48px", height:"48px", borderRadius:"12px", background:"linear-gradient(135deg,#2563EB,#1E3A8A)", color:"#fff", fontWeight:"800", fontSize:"20px", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 8px" },
  previewName:  { margin:"0 0 16px", textAlign:"center", fontWeight:"700", fontSize:"16px", color:"#111827" },
  previewPlaceholder:{ textAlign:"center", padding:"24px 0" },
  previewDetails:{ borderTop:"1px solid #F1F5F9", paddingTop:"14px" },
  infoCard:     { background:"#EFF6FF", borderRadius:"14px", padding:"20px", border:"1px solid #BFDBFE" },
  infoTitle:    { margin:"0 0 12px", fontWeight:"700", fontSize:"14px", color:"#1E3A8A" },
  infoItem:     { margin:"0 0 6px", fontSize:"13px", color:"#1d4ed8" },
  // Success page
  successPage:  { maxWidth:"640px", margin:"0 auto", textAlign:"center", paddingTop:"20px" },
  successIcon:  { fontSize:"56px", marginBottom:"16px" },
  successTitle: { margin:"0 0 8px", fontSize:"28px", fontWeight:"800", color:"#111827" },
  successSub:   { margin:"0 0 32px", fontSize:"15px", color:"#64748B" },
  summaryCard:  { background:"#fff", borderRadius:"16px", padding:"28px", boxShadow:"0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)", textAlign:"left", marginBottom:"24px" },
  tokenBadge:   { textAlign:"center", padding:"20px", background:"linear-gradient(135deg,#2563EB,#1E3A8A)", borderRadius:"12px", marginBottom:"24px" },
  tokenLabel:   { margin:"0 0 6px", fontSize:"10px", fontWeight:"700", letterSpacing:"2px", color:"rgba(255,255,255,0.7)" },
  tokenNum:     { margin:0, fontSize:"28px", fontWeight:"900", color:"#fff" },
  summaryGrid:  {},
  successActions:{},
  notifRow:     { display:"flex", gap:"16px", justifyContent:"center", marginBottom:"24px", flexWrap:"wrap" },
  notifItem:    { background:"#ECFDF5", color:"#059669", padding:"8px 14px", borderRadius:"20px", fontSize:"13px", fontWeight:"600" },
  newBtn:       { background:"linear-gradient(135deg,#2563EB,#1d4ed8)", color:"#fff", border:"none", padding:"14px 24px", borderRadius:"12px", fontSize:"15px", fontWeight:"700", cursor:"pointer" },
};