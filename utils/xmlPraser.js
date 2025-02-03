import { XMLParser } from "fast-xml-parser";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { parseMessage } from "./parserMessage.js";
import supabase from "./supabase.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const parser = new XMLParser();
const filePath = path.resolve(__dirname, "..", "data", "test.xml");

const pushNewOrder = async (order, id) => {
  const { data, error } = await supabase
    .from("indicators_order_start")
    .insert([
      {
        orderid: id,
        instrument: order.asset,
        tradeType: order.type,
        entryprice: order.prixEntree,
        targetPrice: order.target,
        stopPrice: order.stop,
        orderTime: order.date,
      },
    ])
    .select();
};

const xmlData = fs.readFileSync(filePath, "utf8");
const jsonData = parser.parse(xmlData);
// const fullObj = parseMessage(jsonData.Alert[10].Message);
// const objId = jsonData;

console.log(jsonData.Alert[1].TradeID);

// pushNewOrder();

const pushEndOrder = async (order) => {};

fs.watchFile(filePath, { interval: 1000 }, (curr, prev) => {
  if (curr.mtime > prev.mtime) {
    console.log("File changed, processing new XML...");
    try {
      const xmlData = fs.readFileSync(filePath, "utf8");
      const jsonData = parser.parse(xmlData);
      const fullObj = parseMessage(jsonData.Alert[0].Message);
      const objId = jsonData.TradeID;
      pushNewOrder(fullObj, objId);
    } catch (error) {
      console.error("Error processing XML:", error);
    }
  }
});
