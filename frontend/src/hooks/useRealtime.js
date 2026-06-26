import { useEffect, useRef } from "react";
import { supabase } from "../lib/supabase";

/**
 * useRealtime
 *
 * Subscribes to one or more Supabase tables via Realtime Channels.
 * Calls the provided callback whenever an INSERT, UPDATE, or DELETE fires
 * on any of the specified tables.
 * Automatically unsubscribes when the component unmounts.
 *
 * @param {string | string[]} tables  - Table name or array of table names to watch.
 * @param {Function}          callback - Called with ({ table, eventType, new, old }).
 *
 * Usage:
 *   useRealtime("appointments", fetchAppointments);
 *   useRealtime(["appointments", "executive_meetings"], fetchAll);
 *   useRealtime({ appointments: fetchAppointments, holidays: fetchHolidays });
 */
export function useRealtime(tables, callback) {
  // Support three call signatures:
  //   1. useRealtime("appointments", fn)              → one table, one callback
  //   2. useRealtime(["appts","meetings"], fn)         → many tables, same callback
  //   3. useRealtime({ appointments: fn1, holidays: fn2 }) → per-table callbacks
  const callbackRef = useRef(callback);
  useEffect(() => { callbackRef.current = callback; }, [callback]);

  useEffect(() => {
    const channelName = `realtime-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const channel = supabase.channel(channelName);

    // Normalise input into [ { table, handler } ]
    let subscriptions = [];
    if (typeof tables === "string") {
      subscriptions = [{ table: tables, handler: () => callbackRef.current?.() }];
    } else if (Array.isArray(tables)) {
      subscriptions = tables.map(t => ({ table: t, handler: () => callbackRef.current?.() }));
    } else if (typeof tables === "object" && tables !== null) {
      subscriptions = Object.entries(tables).map(([t, fn]) => ({
        table: t,
        handler: () => fn?.(),
      }));
    }

    // Register postgres_changes listener for each table
    for (const { table, handler } of subscriptions) {
      channel.on(
        "postgres_changes",
        { event: "*", schema: "public", table },
        () => handler()
      );
    }

    channel.subscribe((status) => {
      if (status === "SUBSCRIBED") {
        // Channel is live — no-op, just confirming
      }
    });

    return () => {
      supabase.removeChannel(channel);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentionally empty — tables config is static per mount
}