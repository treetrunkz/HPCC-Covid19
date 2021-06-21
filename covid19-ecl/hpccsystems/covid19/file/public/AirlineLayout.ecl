EXPORT AirlineLayout := MODULE;

    EXPORT filepath := '~hpccsystems::covid19::file::raw::airports.flat';

    EXPORT layout := RECORD
        STRING iata;
        STRING name;
        STRING city;
        STRING state;
        STRING country;
        STRING latitude;
        STRING longitude;

    END;

        EXPORT ds := DATASET(filepath, layout, FLAT);

    END;

