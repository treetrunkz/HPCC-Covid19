
EXPORT internationalMeasure:= MODULE

EXPORT aldFilePath :='~hpccsystems::covid19::file::public::airports::airportsoxford.flat';


EXPORT layout := RECORD

    STRING iata;
    STRING name;
    REAL latitude;
    REAL longitude;
    STRING countryCode;
    STRING country;
    STRING city;
    STRING state;
    REAL E1_Income_support;
    REAL C6_Stay_at_home_requirements;
    STRING C2_Flag;
    REAL C1_School_closing;
    REAL ConfirmedCases;
    REAL vacc_complete_pct;
    REAL H6_Facial_Coverings;
    REAL C4_Restrictions_on_gatherings;
    REAL8 deaths,
    REAL8 new_deaths,
    REAL8 contagionrisk,
    REAL8 active,
    REAL8 recovered,
    REAL8 cases_per_capita,
    REAL8 deaths_per_capita,
    REAL8 vacc_total_people,    
    unsigned4 enddate;
    REAL8 new_cases,

END;

  EXPORT ds := DATASET(aldFilePath, layout, FLAT);

END;