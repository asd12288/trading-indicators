export function parseMessage(msg) {
  if (!msg) {
    console.error("No message to parse");
    return {};
  }

  const result = {};

  // If the message is a "Signal Short" message, parse accordingly.
  if (msg.startsWith("Signal Short")) {
    // This regex expects the following format:
    // Signal Short : ES 03-25 Entrée : 5963.25 Target : (5903.25) Stop : (5966.25) Heure : 12:03:01 Date : 2025-02-03
    const signalRegex =
      /^Signal\s+Short\s*:\s*([\w\s-]+)\s+Entrée\s*:\s*([0-9.]+)\s+Target\s*:\s*\(([^)]+)\)\s+Stop\s*:\s*\(([^)]+)\)\s+Heure\s*:\s*([0-9:]+)\s+Date\s*:\s*([0-9]{4}-[0-9]{2}-[0-9]{2})/;
    const match = msg.match(signalRegex);

    if (match) {
      result.type = "Signal Short";
      result.asset = match[1].trim();
      result.prixEntree = parseFloat(match[2]);
      result.target = parseFloat(match[3]);
      result.stop = parseFloat(match[4]);
      result.heure = match[5];
      result.date = match[6];
    } else {
      console.error("Signal Short message did not match expected format.");
    }
  } else {
    // Otherwise, parse using the existing logic.
    const dateMatch = msg.match(/Date\s*:\s*([0-9]{4}-[0-9]{2}-[0-9]{2})/);
    if (dateMatch) result.date = dateMatch[1];

    const compteMatch = msg.match(/Compte\s*:\s*([^:]+)/);
    if (compteMatch) result.compte = compteMatch[1].trim();

    const heureSortieMatch = msg.match(/Heure Sortie\s*:\s*([0-9:]+)/);
    if (heureSortieMatch) result.heureSortie = heureSortieMatch[1];

    const traderMatch = msg.match(/Trader\s*:\s*([^.]+)/);
    if (traderMatch) result.trader = traderMatch[1].trim();

    const prixEntreeMatch = msg.match(/Prix Entrée\s*:\s*([0-9.]+)/);
    if (prixEntreeMatch) result.prixEntree = parseFloat(prixEntreeMatch[1]);

    const prixSortieMatch = msg.match(/Prix Sortie\s*:\s*([0-9.]+)/);
    if (prixSortieMatch) result.prixSortie = parseFloat(prixSortieMatch[1]);

    const maeMatch = msg.match(/MAE\s*=\s*([0-9.]+)\s*Ticks/);
    if (maeMatch) result.mae = parseFloat(maeMatch[1]);

    const mfeMatch = msg.match(/MFE\s*=\s*([0-9.]+)\s*Ticks/);
    if (mfeMatch) result.mfe = parseFloat(mfeMatch[1]);

    const resultatMatch = msg.match(/Résultat\s*:\s*([0-9]+)\s*Ticks/);
    if (resultatMatch) result.resultat = parseInt(resultatMatch[1], 10);

    const dureeMatch = msg.match(/Durée\s*:\s*([\w\s]+)\./);
    if (dureeMatch) result.duree = dureeMatch[1].trim();
  }

  return result;
}
