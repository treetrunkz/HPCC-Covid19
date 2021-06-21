IMPORT hpccsystems.covid19.file.public.travelFormClean as public;
IMPORT hpccsystems.covid19.file.raw.travelFormAirlines as raw;

IMPORT Std;

ds := PROJECT
    (
        raw.ds, 
        TRANSFORM 
        (public.layout,
            SELF.name := STD.Str.ToUpperCase(LEFT.name);
            SELF.city := STD.Str.ToUpperCase(LEFT.city);
            SELF.latitude := (INTEGER) LEFT.latitude;
            SELF.longitude := (INTEGER) LEFT.longitude;
            SELF:= LEFT
        )
    );


OUTPUT(ds, , public.aldFilePath, OVERWRITE, COMPRESSED);