export function analyzeSentiment(reviews) {
  let positive = 0;
  let negative = 0;
  let mixed = 0;

  const positiveKeywords = ["good", "great", "amazing", "excellent", "outstanding", "brilliant", "phenomenal", "stunning", "engaging", "masterpiece", "brilliant", "exceptional"];
  const negativeKeywords = ["bad", "boring", "terrible", "poor", "weak", "disappointing", "confusing", "inadequate", "underwhelming", "forgettable"];
  const mixedKeywords = ["okay", "alright", "decent", "average", "confusing", "mixed", "decent", "entertaining", "flawed", "interesting"];

  reviews.forEach((r) => {
    const text = r.toLowerCase();

    const hasPositive = positiveKeywords.some(keyword => text.includes(keyword));
    const hasNegative = negativeKeywords.some(keyword => text.includes(keyword));
    const hasMixed = mixedKeywords.some(keyword => text.includes(keyword));

    // If review contains both positive and negative keywords, it's mixed
    if (hasPositive && hasNegative) {
      mixed++;
    } else if (hasMixed || (!hasPositive && !hasNegative)) {
      // If it has mixed keywords or doesn't match either category, count as mixed
      mixed++;
    } else if (hasPositive) {
      positive++;
    } else if (hasNegative) {
      negative++;
    } else {
      // Default to mixed if no keywords match
      mixed++;
    }
  });

  let sentiment = "Mixed";
  if (positive > negative && positive > mixed) sentiment = "Positive";
  if (negative > positive && negative > mixed) sentiment = "Negative";

  return {
    sentiment,
    positive,
    mixed,
    negative
  };
}