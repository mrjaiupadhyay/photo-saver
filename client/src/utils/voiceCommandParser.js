const numberWords = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10
};

const parseQuantity = (text) => {
  const match = text.match(/\b(\d+)\b/);
  if (match) return Number(match[1]);

  const word = Object.keys(numberWords).find((w) => text.includes(w));
  return word ? numberWords[word] : 1;
};

export const parseVoiceCommand = (rawText) => {
  const text = rawText.toLowerCase().trim();

  if (text.includes("show my orders")) {
    return { action: "navigate_orders" };
  }

  if (text.startsWith("order ")) {
    const itemsText = text.replace("order ", "");
    const names = itemsText.split(" and ").map((name) => name.trim()).filter(Boolean);
    return { action: "order_items", productNames: names, quantity: 1 };
  }

  if (text.includes("add") && text.includes("to cart")) {
    const qty = parseQuantity(text);
    const productName = text
      .replace("add", "")
      .replace("to cart", "")
      .replace(/\b\d+\b/g, "")
      .replace(
        /\b(one|two|three|four|five|six|seven|eight|nine|ten)\b/g,
        ""
      )
      .trim();

    return { action: "add_to_cart", productName, quantity: qty };
  }

  if (text.startsWith("search ")) {
    return { action: "search", query: text.replace("search ", "").trim() };
  }

  return { action: "unknown" };
};
