import { SSEEvent } from "@only-fake/shared";
import { useEffect, useRef, useCallback } from "react";

type UseSSEOptions = {
  onMessage?: (event: any) => void;
  onError?: (error: Event) => void;
  onOpen?: () => void;
  onClose?: () => void;
};

export const useSSE = (options: UseSSEOptions = {}) => {
  const eventSourceRef = useRef<EventSource | null>(null);

  const streamFromBackend = useCallback(
    (url: string) => {
      // Close existing connection if any
      eventSourceRef.current?.close();

      const eventSource = new EventSource(url);

      eventSource.onopen = () => {
        console.log("SSE connection opened");
        options.onOpen?.();
      };

      eventSource.onmessage = (event: MessageEvent) => {
        try {
          if (event.data) {
            const data = JSON.parse(event.data) as SSEEvent;

            if (data.type === "done") {
              console.log("SSE connection done");
              eventSource.close();
              options.onClose?.();
              return;
            }

            if (data.type === "error") {
              console.error("SSE connection error", data.data);
              eventSource.close();
              options.onError?.(event);
              return;
            }

            options.onMessage?.(JSON.parse(data.data));
          }
        } catch (error) {
          console.error("Error parsing SSE data:", error);
        }
      };

      eventSource.onerror = (error) => {
        console.error("SSE Error:", error);
        eventSource.close();
        options.onError?.(error);
      };

      eventSourceRef.current = eventSource;
    },
    [options]
  );

  useEffect(() => {
    return () => {
      eventSourceRef.current?.close();
    };
  }, []);

  return { streamFromBackend };
};
