// src/lib/calendarSync.js
// Adi Sampark — Google Calendar sync helpers.
// Import this wherever you need to create / update / delete calendar events.

import { supabase } from "./supabase";

// ─── CREATE ──────────────────────────────────────────────────────────────────
// Call this immediately after a successful appointment INSERT.
// Returns { google_event_id, event_link } on success, or null on failure.
// Failures are non-fatal — the appointment is already saved in Supabase.

export async function syncCalendarCreate({
  appointment_id,
  citizen_name,
  purpose,
  appointment_date,
  appointment_time,
  appointment_end_time,
  appointment_duration,
  officer_name,
  location,
  mobile,
  notes,
}) {
  try {
    const { data, error } = await supabase.functions.invoke("google-calendar", {
      body: {
        action: "create",
        appointment_id,
        citizen_name,
        purpose,
        appointment_date,
        appointment_time,
        appointment_end_time: appointment_end_time ?? null,
        appointment_duration: appointment_duration ?? 5,
        officer_name,
        location:  location  ?? null,
        mobile:    mobile    ?? null,
        notes:     notes     ?? null,
      },
    });

    if (error) {
      console.error("[calendarSync] create error:", error);
      return null;
    }

    console.log("[calendarSync] created:", data?.google_event_id);
    return data; // { success, action, google_event_id, event_link }
  } catch (err) {
    console.error("[calendarSync] create exception:", err);
    return null;
  }
}

// ─── UPDATE ──────────────────────────────────────────────────────────────────
// Call this when an appointment is rescheduled.
// google_event_id must be the value stored in your appointments table
// after the original CREATE call.

export async function syncCalendarUpdate({
  google_event_id,
  appointment_id,
  citizen_name,
  purpose,
  appointment_date,
  appointment_time,
  appointment_end_time,
  appointment_duration,
  officer_name,
  location,
  mobile,
  notes,
}) {
  if (!google_event_id) {
    console.warn("[calendarSync] update skipped — no google_event_id");
    return null;
  }

  try {
    const { data, error } = await supabase.functions.invoke("google-calendar", {
      body: {
        action: "update",
        google_event_id,
        appointment_id,
        citizen_name,
        purpose,
        appointment_date,
        appointment_time,
        appointment_end_time: appointment_end_time ?? null,
        appointment_duration: appointment_duration ?? 5,
        officer_name,
        location: location ?? null,
        mobile:   mobile   ?? null,
        notes:    notes    ?? null,
      },
    });

    if (error) {
      console.error("[calendarSync] update error:", error);
      return null;
    }

    console.log("[calendarSync] updated:", data?.google_event_id);
    return data;
  } catch (err) {
    console.error("[calendarSync] update exception:", err);
    return null;
  }
}

// ─── DELETE ──────────────────────────────────────────────────────────────────
// Call this when an appointment is cancelled / deleted.

export async function syncCalendarDelete({ google_event_id, appointment_id }) {
  if (!google_event_id) {
    console.warn("[calendarSync] delete skipped — no google_event_id");
    return null;
  }

  try {
    const { data, error } = await supabase.functions.invoke("google-calendar", {
      body: {
        action:          "delete",
        google_event_id,
        appointment_id,
        // Minimum required by the edge function validator
        citizen_name:        "—",
        purpose:             "—",
        appointment_date:    "2000-01-01",
        appointment_time:    "12:00 PM",
        officer_name:        "—",
      },
    });

    if (error) {
      console.error("[calendarSync] delete error:", error);
      return null;
    }

    console.log("[calendarSync] deleted:", google_event_id);
    return data;
  } catch (err) {
    console.error("[calendarSync] delete exception:", err);
    return null;
  }
}