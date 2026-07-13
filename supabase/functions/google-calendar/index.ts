// supabase/functions/google-calendar/index.ts
// Adi Sampark — Google Calendar Integration
// Single-office, refresh-token-based. No user OAuth required.

import { serve } from "https://deno.land/std@0.208.0/http/server.ts";

// ─── CORS ─────────────────────────────────────────────────────────────────────

const CORS = {
  "Access-Control-Allow-Origin":  "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// ─── Event colours ────────────────────────────────────────────────────────────

const EVENT_COLORS: Record<string, string> = {
  citizen:   "9",  // Blueberry
  executive: "3",  // Grape (purple)
  tour:      "5",  // Banana (yellow)
};

// ─── Google OAuth ─────────────────────────────────────────────────────────────

async function getAccessToken(): Promise<string> {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id:     Deno.env.get("GOOGLE_CLIENT_ID")!,
      client_secret: Deno.env.get("GOOGLE_CLIENT_SECRET")!,
      refresh_token: Deno.env.get("GOOGLE_REFRESH_TOKEN")!,
      grant_type:    "refresh_token",
    }),
  });
  if (!res.ok) throw new Error(`Token refresh failed: ${await res.text()}`);
  const json = await res.json();
  if (!json.access_token) throw new Error(`No access_token: ${JSON.stringify(json)}`);
  return json.access_token;
}

// ─── Time helper ──────────────────────────────────────────────────────────────

function toIST(dateStr: string, timeStr: string): string {
  let hours = 0, minutes = 0;
  const ampm = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (ampm) {
    hours   = parseInt(ampm[1], 10);
    minutes = parseInt(ampm[2], 10);
    if (ampm[3].toUpperCase() === "PM" && hours !== 12) hours += 12;
    if (ampm[3].toUpperCase() === "AM" && hours === 12) hours  = 0;
  } else {
    const parts = timeStr.split(":");
    hours   = parseInt(parts[0], 10);
    minutes = parseInt(parts[1], 10);
  }
  const [year, month, day] = dateStr.split("-").map(Number);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${year}-${pad(month)}-${pad(day)}T${pad(hours)}:${pad(minutes)}:00+05:30`;
}

// ─── Calendar API wrappers ────────────────────────────────────────────────────

const BASE = "https://www.googleapis.com/calendar/v3/calendars";

async function calCreate(token: string, payload: unknown): Promise<Record<string, unknown>> {
  const id  = encodeURIComponent(Deno.env.get("GOOGLE_CALENDAR_ID")!);
  const res = await fetch(`${BASE}/${id}/events`, {
    method: "POST",
    headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(`Create failed: ${JSON.stringify(json)}`);
  return json;
}

async function calUpdate(token: string, eventId: string, payload: unknown): Promise<{ ok: boolean; status: number; json: Record<string, unknown> }> {
  const id  = encodeURIComponent(Deno.env.get("GOOGLE_CALENDAR_ID")!);
  const res = await fetch(`${BASE}/${id}/events/${eventId}`, {
    method: "PUT",
    headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const json = await res.json().catch(() => ({}));
  // Do NOT throw on 404/410 here — the caller decides whether to recreate the
  // event (it may have been deleted off the calendar manually or the stored
  // google_event_id is stale). Other non-OK statuses still throw.
  if (!res.ok && res.status !== 404 && res.status !== 410) {
    throw new Error(`Update failed (${res.status}): ${JSON.stringify(json)}`);
  }
  return { ok: res.ok, status: res.status, json };
}

async function calDelete(token: string, eventId: string): Promise<void> {
  const id  = encodeURIComponent(Deno.env.get("GOOGLE_CALENDAR_ID")!);
  const res = await fetch(`${BASE}/${id}/events/${eventId}`, {
    method: "DELETE",
    headers: { "Authorization": `Bearer ${token}` },
  });
  if (!res.ok && res.status !== 410) {
    throw new Error(`Delete failed (${res.status}): ${await res.text()}`);
  }
}

// ─── Citizen Appointment builder ──────────────────────────────────────────────
// Fields: appointment_id, citizen_name, purpose, appointment_date,
//         appointment_time, appointment_end_time, appointment_duration,
//         officer_name, location, mobile, notes, meeting_link

function buildCitizenEvent(b: Record<string, unknown>): Record<string, unknown> {
  const dateStr   = String(b.appointment_date || "");
  const startTime = String(b.appointment_time || "12:00 PM");
  const startISO  = toIST(dateStr, startTime);

  let endISO: string;
  if (b.appointment_end_time) {
    endISO = toIST(dateStr, String(b.appointment_end_time));
  } else {
    const durationMs = (Number(b.appointment_duration) || 5) * 60 * 1000;
    const startMs    = new Date(startISO).getTime();
    const endMs      = startMs + durationMs;
    const d          = new Date(endMs);
    const h          = d.getUTCHours() + 5;
    const m          = d.getUTCMinutes() + 30;
    const total      = h * 60 + m;
    const hh         = Math.floor(total / 60) % 24;
    const mm         = total % 60;
    endISO = toIST(dateStr, `${String(hh).padStart(2,"0")}:${String(mm).padStart(2,"0")}`);
  }

  const link         = String(b.meeting_link || "").trim();
  const isGoogleMeet = link.includes("meet.google.com");

  const linkSection = link
    ? [``, `------------------------------------`, `🔗 Online Meeting`, link, `------------------------------------`]
    : [];

  const description = [
    `🎫 Token: ${b.appointment_id}`,
    `👤 Citizen: ${b.citizen_name}`,
    `📋 Purpose: ${b.purpose}`,
    `📱 Mobile: ${b.mobile || "—"}`,
    `📍 Location: ${b.location || "—"}`,
    b.notes ? `📝 Notes: ${b.notes}` : null,
    ``,
    `🏛 Officer: ${b.officer_name}`,
    `📅 Date: ${dateStr}`,
    `🕐 Time: ${startTime}${b.appointment_end_time ? ` – ${b.appointment_end_time}` : ""}`,
    ...linkSection,
    ``,
    `Generated by Adi Sampark Portal`,
  ].filter(l => l !== null).join("\n");

  return {
    summary:     `[${b.appointment_id}] ${b.citizen_name} — ${b.purpose}`,
    description,
    start:    { dateTime: startISO, timeZone: "Asia/Kolkata" },
    end:      { dateTime: endISO,   timeZone: "Asia/Kolkata" },
    location: isGoogleMeet ? link : "Adivasi Vikas Bhavan, Government of Maharashtra",
    colorId:  EVENT_COLORS.citizen,
    reminders: { useDefault: false, overrides: [
      { method: "popup", minutes: 10 },
      { method: "popup", minutes: 2  },
    ]},
    extendedProperties: { private: {
      appointment_id: String(b.appointment_id),
      source: "adi-sampark",
    }},
  };
}

// ─── Executive Meeting builder ────────────────────────────────────────────────
// Fields: appointment_id (MTG-xx), meeting_title, meeting_with, meeting_date,
//         meeting_time (or meeting_start_time), meeting_end_time,
//         meeting_link, notes, status

function buildExecutiveMeeting(b: Record<string, unknown>): Record<string, unknown> {
  const dateStr   = String(b.meeting_date || "");
  // Accept both meeting_time and meeting_start_time from callers
  const startTime = String(b.meeting_start_time || b.meeting_time || "09:00 AM");
  const endTime   = String(b.meeting_end_time   || "10:00 AM");
  const startISO  = toIST(dateStr, startTime);
  const endISO    = toIST(dateStr, endTime);

  const link      = String(b.meeting_link || b.meet_link || "").trim();
  const isGoogleMeet = link.includes("meet.google.com");
  const isTeams      = link.includes("teams.microsoft.com");
  const isZoom       = link.includes("zoom.us");
  const isWebex      = link.includes("webex");

  const lines: string[] = [
    `🏛 Executive Meeting`,
    ``,
    `Meeting With: ${b.meeting_with || "—"}`,
    `Meeting Date: ${dateStr}`,
    `Meeting Time: ${startTime} - ${endTime}`,
  ];

  if (b.status) {
    lines.push(`Status: ${b.status}`);
  }

  if (link) {
    lines.push(``, `------------------------------------`);
    lines.push(`🔗 Online Meeting:`);
    lines.push(link);
    lines.push(`------------------------------------`);
  }

  if (b.notes && String(b.notes).trim()) {
    lines.push(``, `📝 Notes: ${String(b.notes).trim()}`);
  }

  lines.push(``, `Generated by Adi Sampark Portal`);

  // Location: Google Meet URL enables native join button.
  // Teams/Zoom/Webex keep the physical address (link is in description).
  const eventLocation =
    isGoogleMeet
      ? link
      : "Adivasi Vikas Bhavan, Government of Maharashtra";

  const title = String(b.meeting_title || b.title || "Executive Meeting");

  return {
    summary:     `🏛 [${b.appointment_id}] ${title}`,
    description: lines.join("\n"),
    start:    { dateTime: startISO, timeZone: "Asia/Kolkata" },
    end:      { dateTime: endISO,   timeZone: "Asia/Kolkata" },
    location: eventLocation,
    colorId:  EVENT_COLORS.executive,
    reminders: { useDefault: false, overrides: [
      { method: "popup", minutes: 10 },
      { method: "popup", minutes: 2  },
    ]},
    extendedProperties: { private: {
      appointment_id: String(b.appointment_id),
      source: "adi-sampark",
    }},
  };
}

// ─── Tour Diary builder ───────────────────────────────────────────────────────
// Fields: appointment_id (TOUR-xx), citizen_name (tour label), purpose,
//         appointment_date, appointment_time, appointment_end_time,
//         location (destination), notes

function buildTourEvent(b: Record<string, unknown>): Record<string, unknown> {
  const dateStr  = String(b.appointment_date || "");
  const startISO = toIST(dateStr, String(b.appointment_time || "09:00 AM"));
  const endISO   = b.appointment_end_time
    ? toIST(dateStr, String(b.appointment_end_time))
    : toIST(dateStr, "18:00");

  const lines: string[] = [
    `✈️ Official Tour`,
    ``,
    `Destination: ${b.location || "—"}`,
    `Purpose: ${b.purpose || "—"}`,
  ];
  if (b.notes && String(b.notes).trim()) {
    lines.push(``, `📝 Notes: ${String(b.notes).trim()}`);
  }
  lines.push(``, `Generated by Adi Sampark Portal`);

  return {
    summary:     `${b.citizen_name}`,
    description: lines.join("\n"),
    start:    { dateTime: startISO, timeZone: "Asia/Kolkata" },
    end:      { dateTime: endISO,   timeZone: "Asia/Kolkata" },
    location: String(b.location || "Adivasi Vikas Bhavan, Government of Maharashtra"),
    colorId:  EVENT_COLORS.tour,
    reminders: { useDefault: false, overrides: [
      { method: "popup", minutes: 30 },
    ]},
    extendedProperties: { private: {
      appointment_id: String(b.appointment_id),
      source: "adi-sampark",
    }},
  };
}

// ─── Router ───────────────────────────────────────────────────────────────────

function buildEventPayload(b: Record<string, unknown>): Record<string, unknown> {
  const id = String(b.appointment_id || "");
  if (id.startsWith("MTG-"))  return buildExecutiveMeeting(b);
  if (id.startsWith("TOUR-")) return buildTourEvent(b);
  return buildCitizenEvent(b);
}

// ─── Main handler ─────────────────────────────────────────────────────────────

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS });
  }
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405, headers: { ...CORS, "Content-Type": "application/json" },
    });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400, headers: { ...CORS, "Content-Type": "application/json" },
    });
  }

  // Only hard requirements: action + appointment_id
  if (!body.action || !body.appointment_id) {
    return new Response(
      JSON.stringify({ error: "Missing required fields: action, appointment_id" }),
      { status: 400, headers: { ...CORS, "Content-Type": "application/json" } },
    );
  }

  if ((body.action === "update" || body.action === "delete") && !body.google_event_id) {
    return new Response(
      JSON.stringify({ error: "google_event_id required for update/delete" }),
      { status: 400, headers: { ...CORS, "Content-Type": "application/json" } },
    );
  }

  try {
    const token = await getAccessToken();

    // ── DELETE ──────────────────────────────────────────────────────────────
    if (body.action === "delete") {
      await calDelete(token, String(body.google_event_id));
      return new Response(JSON.stringify({
        success: true, action: "delete", google_event_id: body.google_event_id,
      }), { headers: { ...CORS, "Content-Type": "application/json" } });
    }

    // ── CREATE / UPDATE ──────────────────────────────────────────────────────
    const payload = buildEventPayload(body);

    if (body.action === "update") {
      const result = await calUpdate(token, String(body.google_event_id), payload);

      // Event still exists → updated in place.
      if (result.ok) {
        return new Response(JSON.stringify({
          success: true,
          action:  "update",
          google_event_id: result.json.id ?? body.google_event_id,
          event_link:      result.json.htmlLink,
        }), { headers: { ...CORS, "Content-Type": "application/json" } });
      }

      // Event was gone (404/410) — the stored google_event_id is stale or the
      // event was deleted off the calendar. Recreate it so the edit still lands,
      // and hand back the NEW id so the caller can persist it.
      const recreated = await calCreate(token, payload);
      return new Response(JSON.stringify({
        success: true,
        action:  "update",
        recreated: true,
        google_event_id: recreated.id,
        event_link:      recreated.htmlLink,
      }), { headers: { ...CORS, "Content-Type": "application/json" } });
    }

    // action === "create"
    const event = await calCreate(token, payload);

    return new Response(JSON.stringify({
      success: true,
      action:  body.action,
      google_event_id: event.id,
      event_link:      event.htmlLink,
    }), { headers: { ...CORS, "Content-Type": "application/json" } });

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[google-calendar] Error:", message);
    return new Response(JSON.stringify({ success: false, error: message }), {
      status: 500, headers: { ...CORS, "Content-Type": "application/json" },
    });
  }
});