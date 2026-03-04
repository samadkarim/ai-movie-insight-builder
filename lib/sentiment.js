export function analyzeSentiment(reviews) {

  let positive = 0;
  let negative = 0;

  reviews.forEach((r) => {

    const text = r.toLowerCase();

    if (text.includes("good") || text.includes("great") || text.includes("amazing")) {
      positive++;
    } 
    else if (text.includes("bad") || text.includes("boring") || text.includes("terrible")) {
      negative++;
    }

  });

  let sentiment = "Mixed";

  if (positive > negative) sentiment = "Positive";
  if (negative > positive) sentiment = "Negative";

  return {
    sentiment,
    positive,
    negative
  };
}