
IMPORT hpccsystems.covid19.file.public.OxCGRT as Ox;
// IMPORT hpccsystems.covid19.file.public.AirlineLayout;

IMPORT Std;

EXPORT travelformClean:= MODULE

EXPORT aldFilePath :='~hpccsystems::covid19::file::public::aldxdata.flat';

EXPORT layout := RECORD

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

