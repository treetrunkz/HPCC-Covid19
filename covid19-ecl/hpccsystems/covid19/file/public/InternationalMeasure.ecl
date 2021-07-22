// IMPORT hpccsystems.covid19.file.public.OxCGRT as Ox;
// IMPORT hpccsystems.covid19.file.public.AirlineLayout;

IMPORT Std;

EXPORT internationalMeasure:= MODULE

EXPORT filepath2 := '~hpccsystems::covid19::file::public::oxcgrt::v2::oxcgrt.flat';
EXPORT aldFilePath :='~hpccsystems::covid19::file::public::aldxdataxmeasure.flat';

EXPORT layout := RECORD

    REAL8 deaths,
    REAL8 new_deaths,
    REAL8 active,
    REAL8 recovered,
    REAL8 cases_per_capita,
    REAL8 deaths_per_capita,    
    unsigned4 enddate;
    REAL8 new_cases,
    STRING iata;
    STRING name;
    STRING city;
    STRING state;
    STRING country;
    INTEGER latitude;
    INTEGER longitude;

END;

  EXPORT ds := DATASET(aldFilePath, layout, FLAT);

END;