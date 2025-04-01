import { SSEEvent } from "@only-fake/shared";
import { useEffect, useRef, useCallback } from "react";

type UseSSEOptions = {
  onMessage?: (event: any) => void;
  onError?: (error: Event) => void;
  onOpen?: () => void;
  onClose?: () => void;
};

export const useSSE = (url: string, options: UseSSEOptions = {}) => {
  const eventSourceRef = useRef<EventSource | null>(null);

  const streamFromBackend = useCallback(() => {
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
  }, [url, options.onMessage, options.onError, options.onOpen]);

  useEffect(() => {
    return () => {
      eventSourceRef.current?.close();
    };
  }, []);

  return { streamFromBackend };
};
