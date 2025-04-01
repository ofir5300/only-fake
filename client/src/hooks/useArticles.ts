import axios from "axios";
import { useState, useEffect, useCallback, useRef } from "react";
import {
  API_BASE_URL,
  API_ENDPOINTS,
  FakeArticle,
  SOURCES,
} from "@only-fake/shared";
import { useSSE } from "./useSSE";

const fetchEndpoint = `${API_BASE_URL}/api${API_ENDPOINTS.ARTICLES}/${SOURCES.CNN}`;
const streamEndpoint = `${API_BASE_URL}/api${API_ENDPOINTS.ARTICLES_STREAM}/${SOURCES.CNN}`;

export const useArticles = (source = SOURCES.CNN) => {
  const [data, setData] = useState<FakeArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("Disconnected");
  const eventSourceRef = useRef<EventSource | null>(null);

  const { streamFromBackend } = useSSE(streamEndpoint, {
    onOpen: () => {
      setStatus("Connected");
      setLoading(true);
      setData([]); // Reset data on new connection
    },
    onMessage: (event) => {
      console.log("Received event:", event); // Debug
      const article = event as FakeArticle;
      setData((prev) => [...prev, article]);
      // try {
      // 	const article = JSON.parse(event.data) as FakeArticle;
      // 	setData((prev) => [...prev, article]);
      // } catch (error) {
      // 	console.error("Error parsing SSE data:", error);
      // }
    },
    onError: () => {
      setStatus("Disconnected");
      setLoading(false);
    },
  });

  const fetchArticles = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await axios.get<FakeArticle[]>(fetchEndpoint);
      setData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch articles");
    } finally {
      setLoading(false);
    }
  };

  // Cleanup SSE connection on unmount
  useEffect(() => {
    return () => {
      eventSourceRef.current?.close();
    };
  }, []);

  return {
    data,
    loading,
    error,
    status,
    fetchArticles,
    streamArticles: streamFromBackend,
  };
};
