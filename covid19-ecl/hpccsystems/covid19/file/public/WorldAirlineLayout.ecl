IMPORT STD;

EXPORT WorldAirlineLayout := MODULE

EXPORT filepath := '~hpccsystems::covid19::file::public::airports::intl_airports.flat';
// IATA,name,latitude,longitude,country,region,municipality
    EXPORT layout := RECORD
        STRING iata;
        STRING name;
        INTEGER latitude;
        INTEGER longitude;
        STRING country;
        STRING state;
        STRING city;
        END;

    EXPORT intlLayout := DATASET(filepath, layout, FLAT);

END;