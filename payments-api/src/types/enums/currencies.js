// the description property is used to populate a list of currencies
// in the send money page currency select input.
// List taken from PayPal
export const Currencies = new GqlEnum({
  name: `Currencies`,
  description: `A list of Currencies for Payment transactions.`,
  values: {
    USD : { description: `US Dollars` },
    AUD : { description: `Australian Dollars` },
    BRL : { description: `Brazilian Reals` },
    CAD : { description: `Canadian Dollars` },
    CHF : { description: `Swiss Francs` },
    CZK : { description: `Czech Koruna` },
    DKK : { description: `Danish Krone` },
    EUR : { description: `Euros` },
    GBP : { description: `British Pounds` },
    HKD : { description: `Hong Kong Dollars` },
    HUF : { description: `Hungarian Forints` },
    ILS : { description: `Israeli New Shekels` },
    JPY : { description: `Japanese Yen` },
    MXN : { description: `Mexican Pesos` },
    MYR : { description: `Malaysian Ringgit` },
    NOK : { description: `Norwegian Krone` },
    NZD : { description: `New Zealand Dollars` },
    PHP : { description: `Philippine Pesos` },
    PLN : { description: `Polish Zloty` },
    RUB : { description: `Russian Rubles` },
    SEK : { description: `Swedish Krona` },
    SGD : { description: `Singapore Dollars` },
    THB : { description: `Thai Baht` },
    TRY : { description: `Turkish Lira` },
    TWD : { description: `New Taiwan Dollars` }
  }
})
