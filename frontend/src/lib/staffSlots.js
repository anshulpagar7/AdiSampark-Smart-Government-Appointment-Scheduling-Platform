// src/lib/staffSlots.js
// Adi Sampark — single source of truth for the STAFF booking slot range.
//
// Staff can schedule across the full office day: 10:00 AM → 8:00 PM in 5-minute
// slots. Last slot STARTS 7:55 PM (ends 8:00 PM). A lunch break mirrors the
// citizen booking: the morning ends at 1:20 PM and the afternoon resumes 2:30 PM
// (1:25–2:25 PM is not bookable).
//
// Both the Walk-In Registration page (ScheduleAppointment) and the staff
// Appointments reschedule modal import from here, so the office hours can never
// drift apart between the two.

export const STAFF_START_MIN = 10 * 60;      // 10:00 AM
export const STAFF_END_MIN   = 20 * 60;      // 8:00 PM (exclusive — last start 7:55)
export const LUNCH_START_MIN = 13 * 60 + 25; // 1:25 PM — first non-bookable minute
export const LUNCH_END_MIN   = 14 * 60 + 30; // 2:30 PM — afternoon resumes

export const DURATION_OPTIONS = [5, 10, 15, 20, 25];

/** minutes-since-midnight → "hh:mm AM/PM" (the stored format). */
export function minutesToSlotStr(min) {
  let h = Math.floor(min / 60);
  const m = min % 60;
  const suffix = h < 12 ? "AM" : "PM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${String(h12).padStart(2, "0")}:${String(m).padStart(2, "0")} ${suffix}`;
}

/** "hh:mm AM/PM" or "HH:mm" → minutes since midnight (-1 when unparseable). */
export function slotToMinutes(slotStr) {
  if (!slotStr) return -1;
  const s = String(slotStr).trim();
  const ampm = /^(\d{1,2}):(\d{2})(?::\d{2})?\s*(AM|PM)$/i.exec(s);
  if (ampm) {
    let h = parseInt(ampm[1], 10);
    const m = parseInt(ampm[2], 10);
    const p = ampm[3].toUpperCase();
    if (p === "PM" && h !== 12) h += 12;
    if (p === "AM" && h === 12) h = 0;
    return h * 60 + m;
  }
  const parts = s.split(":");
  if (parts.length >= 2) {
    const h = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10);
    if (!isNaN(h) && !isNaN(m)) return h * 60 + m;
  }
  return -1;
}

/**
 * Build 5-minute slots, skipping the lunch window, grouped into rows of 5 within
 * each section so the grid renders in neat blocks.
 */
export function buildStaffSlotGroups() {
  const groups = [];
  let row = [];
  let rowSection = null;

  const flushRow = () => {
    if (row.length > 0) { groups.push({ section: rowSection, slots: row }); row = []; }
  };

  for (let min = STAFF_START_MIN; min < STAFF_END_MIN; min += 5) {
    if (min >= LUNCH_START_MIN && min < LUNCH_END_MIN) continue; // lunch

    const section = min < LUNCH_START_MIN ? "morning" : "afternoon";
    if (section !== rowSection || row.length === 5) {
      flushRow();
      rowSection = section;
    }
    row.push(minutesToSlotStr(min));
  }
  flushRow();
  return groups;
}

export const SLOT_GROUPS = buildStaffSlotGroups();

/** Flat list of every bookable staff slot, in time order. */
export const ALL_SLOTS = SLOT_GROUPS.flatMap(g => g.slots);

/**
 * Slots an appointment occupies, or null if it crosses a break (lunch) or runs
 * past the last slot. Validity = the occupied slots are time-contiguous (each
 * exactly 5 minutes after the previous), which allows spanning visual rows
 * within a session but forbids jumping the lunch gap or off the end of the day.
 */
export function getOccupiedSlots(startSlot, durationMinutes) {
  const slotsNeeded = durationMinutes / 5;
  const startIdx = ALL_SLOTS.indexOf(startSlot);
  if (startIdx === -1) return null;

  const occupied = [];
  for (let i = 0; i < slotsNeeded; i++) {
    const idx = startIdx + i;
    if (idx >= ALL_SLOTS.length) return null;
    occupied.push(ALL_SLOTS[idx]);
  }

  for (let i = 1; i < occupied.length; i++) {
    if (slotToMinutes(occupied[i]) - slotToMinutes(occupied[i - 1]) !== 5) return null;
  }
  return occupied;
}
