IMPORT hpccsystems.covid19.file.public.internationalAirports as Airports;

EXPORT travelFormAirportOx := MODULE

EXPORT filePath  := '~hpccsystems::covid19::file::public::airports::AirportsOxford.flat';

        EXPORT Layout := RECORD
            STRING iata;
            STRING name;
            INTEGER latitude;
            INTEGER longitude;
            STRING countryCode;
            STRING country;
            STRING state;
            STRING city;
            REAL E1_Income_support;
            REAL C6_Stay_at_home_requirements;
            STRING C2_Flag;
            REAL C1_School_closing;
            REAL ConfirmedCases;
            REAL H6_Facial_Coverings;
            REAL C4_Restrictions_on_gatherings;
            
        END;

        EXPORT ds := DATASET(filePath, Layout, flat );

END;
