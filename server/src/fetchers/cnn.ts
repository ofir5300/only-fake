import axios from "axios";
import { parseStringPromise } from "xml2js";

const RSS_URL = "http://rss.cnn.com/rss/edition.rss";

export const fetchCNNRss = async () => {
  try {
    const { data: xml } = await axios.get(RSS_URL, {
      responseType: "text",
    });

    const result = await parseStringPromise(xml);
    const items = result.rss.channel[0].item;

    const parsed = items.map((item: any) => ({
      title: item.title[0],
      link: item.link[0],
      pubDate: item.pubDate?.[0],
      description: item.description?.[0],
    }));

    return parsed;
  } catch (error) {
    console.error("Failed to fetch CNN RSS feed:", error);
    return [];
  }
};

export const articles = async () => {
  const articles = await fetchCNNRss();
  console.log("CNN Top Headlines:");
  articles.forEach((a: any, i: number) => {
    console.log(`${i + 1}. ${a.title}`);
  });
};
