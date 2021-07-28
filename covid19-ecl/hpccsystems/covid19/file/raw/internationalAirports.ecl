EXPORT internationalAirports := MODULE;

EXPORT filepath := '~hpccsystems::covid19::file::raw::airports::intl_airports.csv';

EXPORT layout := RECORD

    STRING id; 
    STRING ident;
    STRING airport_type; 
    STRING name; 
    STRING latitude_deg; 
    STRING longitude_deg; 
    STRING elevation_ft; 
    STRING continent; 
    STRING iso_country; 
    STRING iso_region;
    STRING municipality; 
    STRING scheduled_service; 
    STRING gps_code; 
    STRING iata_code;
    STRING local_code; 
    STRING home_link; 
    STRING wikipedia_link; 
    STRING keywords;  

END;


EXPORT ds := DATASET(filepath, layout, CSV(HEADING(1)));

END;