import { useEffect, useState } from "react";

export const useEventStream = <Type extends any>(streamUrl: string, endpoint: string): Type => {
	const [value, setValue] = useState<Type>();

	useEffect(() => {
		console.log(`Opening stream for endpoint keep state ${endpoint}...`);

		const url = `${streamUrl}/${endpoint}`;
		const eventSource = new EventSource(url);

		eventSource.onopen = (event: any) => {
			console.log("open", event);
		};

		eventSource.onmessage = (event: any) => {
			const obj = JSON.parse(event.data);
			setValue(obj);
		};

		eventSource.onerror = (event: any) => {
			console.error(
				`Event source has failed for reason: ${JSON.stringify(event)}`
			);
			if (event.readyState === EventSource.CLOSED) {
				eventSource.close();
			}
		};

		return () => {
			console.log(`Closing stream for endpoint ${endpoint}...`);
			eventSource.close();
		};
	}, []);

	return value;
};

export const useEventStreamBreakState = <Type extends any>(streamUrl: string, endpoint: string): Type => {
	const [value, setValue] = useState<Type>();

	useEffect(() => {
		console.log(`Opening stream for endpoint ${endpoint}...`);

		const url = `${streamUrl}/${endpoint}`;
		const eventSource = new EventSource(url);

		eventSource.onopen = (event: any) => {
			console.log("open", event);
		};

		eventSource.onmessage = (event: any) => {
			const obj = JSON.parse(event.data);
			setValue(obj);
		};

		eventSource.onerror = (event: any) => {
			console.error(
				`Event source has failed for reason: ${JSON.stringify(event)}`
			);
			if (event.readyState === EventSource.CLOSED) {
				eventSource.close();
			}
		};

		return () => {
			console.log(`Closing stream for endpoint ${endpoint}...`);
			eventSource.close();
		};

	}, [endpoint]);

	return value;
};