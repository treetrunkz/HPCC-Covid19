
EXPORT internationalAirports := MODULE;

    EXPORT filepath := '~hpccsystems::covid19::file::public::airports::intl_airports.flat';


EXPORT layout := RECORD

    STRING iata;
    STRING name;
    REAL latitude;
    REAL longitude;
    STRING countryCode;
    STRING countryName;
    STRING state;
    STRING city;

END;

    EXPORT ds := DATASET(filepath, layout, thor);

END;