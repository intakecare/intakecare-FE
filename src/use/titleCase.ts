export default function titleCase(sentence: string): string {
  const sentenceArray: string[] = sentence.toLowerCase().split(" ");
  for (let i = 0; i < sentenceArray.length; i++) {
    sentenceArray[i] =
      sentenceArray[i].charAt(0).toUpperCase() + sentenceArray[i].substring(1);
  }

  return sentenceArray.join(" ");
}
