import EventSource from "eventsource";
import { useEffect, useState } from "react";

import { DefaultUser } from "@/types/DefaultUser";

export const useEventStream = <Type>(endpoint: string, user: DefaultUser | null): Type | undefined => {
  const [value, setValue] = useState<Type>();

  useEffect(() => {
    console.log(`Opening stream for endpoint keep state ${endpoint}...`);

    const eventSource = new EventSource(endpoint, {
      headers: {
        Authorization: `Bearer ${user?.accessToken}`,
      },
    });

    eventSource.onopen = (_: Event) => {
      console.log("Open connection");
    };

    eventSource.onmessage = (event: MessageEvent) => {
      const obj = JSON.parse(event.data);
      setValue(obj);
    };

    eventSource.onerror = (event: Event) => {
      console.error("Event source has failed");
      if ((event as unknown as EventSource).readyState === EventSource.CLOSED) {
        (eventSource as EventSource).close();
      }
    };

    return () => {
      console.log(`Closing stream for endpoint ${endpoint}...`);
      eventSource.close();
    };
  }, []);

  return value;
};

export const useEventStreamBreakState = <Type>(endpoint: string, user: DefaultUser | null): Type | undefined => {
  const [value, setValue] = useState<Type>();

  useEffect(() => {
    console.log(`Opening stream for endpoint ${endpoint}...`);

    const eventSource = new EventSource(endpoint, {
      headers: {
        Authorization: `Bearer ${user?.accessToken}`,
      },
    });

    eventSource.onopen = (_: Event) => {
      console.log("Open connection");
    };

    eventSource.onmessage = (event: MessageEvent) => {
      const obj = JSON.parse(event.data);
      setValue(obj);
    };

    eventSource.onerror = (event: Event) => {
      console.error("Event source has failed");
      if ((event as unknown as EventSource).readyState === EventSource.CLOSED) {
        (eventSource as EventSource).close();
      }
    };

    return () => {
      console.log(`Closing stream for endpoint ${endpoint}...`);
      eventSource.close();
    };
  }, [endpoint]);

  return value;
};
