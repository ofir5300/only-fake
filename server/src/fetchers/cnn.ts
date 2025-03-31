import axios from "axios";
import { parseStringPromise } from "xml2js";
import { Article } from "@only-fake/shared";
const RSS_URL = "http://rss.cnn.com/rss/edition.rss";

export const fetchCNNRss = async (): Promise<Article[]> => {
  try {
    const { data: xml } = await axios.get(RSS_URL, {
      responseType: "text",
    });

    const result = await parseStringPromise(xml);
    const items = result.rss.channel[0].item;

    const parsed: Article[] = items.map((item: any) => ({
      title: item.title[0],
      url: item.link[0],
      date: item.pubDate?.[0],
      description: item.description?.[0],
    }));

    return parsed;
  } catch (error) {
    console.error("Failed to fetch CNN RSS feed:", error);
    return [];
  }
};
