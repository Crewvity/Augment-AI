export enum CurrencyId {
  Dash = 'dash',
  Sentinel = 'sentinel',
  Qtum = 'qtum',
  Persistence = 'persistence',
  Zcash = 'zcash',
  MultiCollateralDai = 'multi-collateral-dai',
  Waves = 'waves',
  Dogecoin = 'dogecoin',
  CryptoComCoin = 'crypto-com-coin',
  Litecoin = 'litecoin',
  Tether = 'tether',
  Eos = 'eos',
  BinanceCoin = 'binance-coin',
  Thorchain = 'thorchain',
  BitcoinCash = 'bitcoin-cash',
  Ethereum = 'ethereum',
  Bitcoin = 'bitcoin',
}

const CURRENCIES_SYMBOL: Record<CurrencyId, string> = {
  [CurrencyId.Dash]: 'DASH',
  [CurrencyId.Sentinel]: 'DVPN',
  [CurrencyId.Qtum]: 'QTUM',
  [CurrencyId.Persistence]: 'XPRT',
  [CurrencyId.Zcash]: 'ZEC',
  [CurrencyId.MultiCollateralDai]: 'DAI',
  [CurrencyId.Waves]: 'WAVES',
  [CurrencyId.Dogecoin]: 'DOGE',
  [CurrencyId.CryptoComCoin]: 'CRO',
  [CurrencyId.Litecoin]: 'LTC',
  [CurrencyId.Tether]: 'USDT',
  [CurrencyId.Eos]: 'EOS',
  [CurrencyId.BinanceCoin]: 'BNB',
  [CurrencyId.Thorchain]: 'RUNE',
  [CurrencyId.BitcoinCash]: 'BCH',
  [CurrencyId.Ethereum]: 'ETH',
  [CurrencyId.Bitcoin]: 'BTC',
};

export const CurrencySymbol = CURRENCIES_SYMBOL;

export enum CandleInterval {
  OneMinute = 'm1',
  FiveMinutes = 'm5',
  FifteenMinutes = 'm15',
  ThirtyMinutes = 'm30',
  OneHour = 'h1',
  TwoHours = 'h2',
  FourHours = 'h4',
  EightHours = 'h8',
  TwelveHours = 'h12',
  OneDay = 'd1',
  OneWeek = 'w1',
}

export enum MembershipType {
  Free = 'free',
  Premium = 'premium',
}

export enum PositionDirection {
  Long = 'long',
  Short = 'short',
}

export enum PositionSize {
  One = 1,
  Two = 2,
  Three = 3,
  Four = 4,
  Five = 5,
}

export enum StrategyStatus {
  Active = 'active',
  Inactive = 'inactive',
  Deleted = 'deleted',
}

export enum TradeDirection {
  Buy = 'buy',
  Sell = 'sell',
}
