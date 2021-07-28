EXPORT Airports := MODULE;

    EXPORT filepath := '~hpccsystems::covid19::file::public::airports::airports.flat';


EXPORT layout := RECORD

    STRING iata;
    STRING name;
    STRING city;    
    STRING state;
    STRING countryCode;
    REAL latitude;
    REAL longitude;
    
END;

    EXPORT ds := DATASET(filepath, layout, thor);

END;