import axios from "axios";
import { useState, useEffect, useRef } from "react";
import {
  API_BASE_URL,
  API_ENDPOINTS,
  FakeArticle,
  NewsSource,
  SOURCES,
} from "@only-fake/shared";
import { useSSE } from "./useSSE";

const getEndpoints = (source: NewsSource, streaming: boolean) =>
  `${API_BASE_URL}/api${
    streaming ? API_ENDPOINTS.ARTICLES_STREAM : API_ENDPOINTS.ARTICLES
  }/${source}`;

export const useArticles = () => {
  const [selectedSource, setSelectedSource] = useState<NewsSource>(SOURCES.CNN);
  const [data, setData] = useState<FakeArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("Disconnected");
  const eventSourceRef = useRef<EventSource | null>(null);

  const { streamFromBackend } = useSSE({
    onOpen: () => {
      setStatus("Connected");
      setLoading(true);
      setData([]); // Reset data on new connection
      setError(null);
    },
    onMessage: (event) => {
      console.log("Received event:", event);
      setData((prev) => [...prev, event as FakeArticle]);
    },
    onError: () => {
      setStatus("Disconnected");
      setError(`Failed to fetch articles from ${selectedSource}`);
      setLoading(false);
    },
    onClose: () => {
      setStatus("Disconnected");
      setLoading(false);
    },
  });

  const fetchArticles = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await axios.get<FakeArticle[]>(
        getEndpoints(selectedSource, false)
      );
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
    setData,
    loading,
    setLoading,
    error,
    status,
    fetchArticles,
    streamArticles: (source: NewsSource) =>
      streamFromBackend(getEndpoints(source, true)),
    selectedSource,
    setSelectedSource,
  };
};
