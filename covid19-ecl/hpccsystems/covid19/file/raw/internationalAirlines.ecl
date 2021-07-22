EXPORT internationalAirlines := MODULE;

EXPORT filepath := '~hpccsystems::covid19::file::raw::intl_airports.csv';

EXPORT layout := RECORD

    STRING iata;
    STRING name;
    STRING latitude;
    STRING longitude;
    STRING country;
    STRING state;
    STRING city;
    
END;

EXPORT ds := DATASET(filepath, layout, CSV(HEADING(1)));

END;