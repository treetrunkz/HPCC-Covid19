IMPORT STD;

EXPORT travelForm := MODULE

EXPORT filepath2 := '~hpccsystems::covid19::file::public::oxcgrt::v2::oxcgrt.flat';
EXPORT filepath := '~hpccsystems::covid19::file::public::airports.flat';

EXPORT layout := RECORD
        STRING iata;
        STRING name;
        STRING city;
        STRING state;
        STRING country;
        STRING latitude;
        STRING longitude;
        STRING CountryName;
        STRING CountryCode;
        STRING RegionName;
        STRING RegionCode;
        STRING Jurisdiction;
        STRING Date;
END;

    EXPORT travelForm := DATASET(filepath, layout, FLAT);
 
END;