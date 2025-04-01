import axios from "axios";
import { useState, useEffect, useCallback, useRef } from "react";
import {
  API_BASE_URL,
  API_ENDPOINTS,
  FakeArticle,
  SOURCES,
  NewsSource,
} from "@only-fake/shared";
import { useSSE } from "./useSSE";

const fetchEndpoint = `${API_BASE_URL}/api${API_ENDPOINTS.ARTICLES}/${SOURCES.CNN}`;
const streamEndpoint = `${API_BASE_URL}/api${API_ENDPOINTS.ARTICLES_STREAM}/${SOURCES.CNN}`;

export const useArticles = (source: NewsSource) => {
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
    },
    onError: () => {
      setStatus("Disconnected");
      setLoading(false);
    },
    onClose: () => {
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
