export function calculateSwapFee(amount: number, percentage = 3) {
  const fee = Number(((amount * percentage) / 100).toFixed(2));
  const finalAmount = Number((amount + fee).toFixed(2));
  return { fee, finalAmount };
}

export function convertSypToUsd(amountSyp: number, exchangeRate: number) {
  if (!exchangeRate) return 0;
  return Number((amountSyp / exchangeRate).toFixed(2));
}
