// IMPORT hpccsystems.covid19.file.public.OxCGRT as Ox;
// IMPORT hpccsystems.covid19.file.public.AirlineLayout;

IMPORT Std;

EXPORT travelformClean:= MODULE

EXPORT filepath2 := '~hpccsystems::covid19::file::public::oxcgrt::v2::oxcgrt.flat';
EXPORT aldFilePath :='~hpccsystems::covid19::file::public::aldxdata.flat';

EXPORT layout := RECORD

    Std.Date.Date_t Date := 0;
    REAL E1_Income_support := 0;
    REAL C6_Stay_at_home_requirements := 0;
    INTEGER C2_Flag := 0;
    REAL C1_School_closing := 0;
    REAL ConfirmedCases := 0;
    REAL H6_Facial_Coverings := 0;
    REAL C4_Restrictions_on_gatherings := 0;
    STRING iata;
    STRING name;
    STRING city;
    STRING state;
    STRING statename;
    STRING country;
    INTEGER latitude;
    INTEGER longitude;

END;

  EXPORT ds := DATASET(aldFilePath, layout, FLAT);

END;