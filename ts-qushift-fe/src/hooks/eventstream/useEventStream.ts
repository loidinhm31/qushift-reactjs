import { useEffect, useState } from "react";


export const useEventStream = <Type>(endpoint: string): Type | undefined => {
  const [value, setValue] = useState<Type>();

  useEffect(() => {
    console.log(`Opening stream for endpoint keep state ${endpoint}...`);

    const eventSource = new EventSource(endpoint);

    eventSource.onopen = (event: Event) => {
      console.log("open", event);
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

export const useEventStreamBreakState = <Type>(endpoint: string): Type | undefined => {
  const [value, setValue] = useState<Type>();

  useEffect(() => {
    console.log(`Opening stream for endpoint ${endpoint}...`);

    const eventSource = new EventSource(endpoint);

    eventSource.onopen = (event: Event) => {
      console.log("open", event);
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