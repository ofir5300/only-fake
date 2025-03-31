import axios from "axios";
import { parseStringPromise } from "xml2js";
import { Article } from "@only-fake/shared";
const RSS_URL = "http://rss.cnn.com/rss/edition.rss";

export const extractCNNRss = async (): Promise<any[]> => {
  try {
    const { data: xml } = await axios.get(RSS_URL, {
      responseType: "text",
    });

    const result = await parseStringPromise(xml);
    return result.rss.channel[0].item;
  } catch (error) {
    console.error("Failed to extract CNN RSS feed:", error);
    return [];
  }
};

export const transformCNNArticles = (data: any[]): Article[] =>
  data.map((item: any) => ({
    title: item.title[0],
    url: item.link[0],
    date: item.pubDate?.[0],
    description: item.description?.[0],
  }));
