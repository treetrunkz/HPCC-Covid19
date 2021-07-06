IMPORT hpccsystems.covid19.file.public.travelFormClean as public;
IMPORT hpccsystems.covid19.file.raw.travelFormAirlines as raw;
IMPORT hpccsystems.covid19.file.raw.OxCGRT as OxRaw;
IMPORT hpccsystems.covid19.file.public.OxCGRT as Ox;
IMPORT hpccsystems.covid19.utils.CatalogUSStates as Cat;

IMPORT Std;

ds := PROJECT
    (
        raw.ds,
        TRANSFORM 
        (public.layout,
            SELF.country:= 'US';
            //change this @ worldwide airport data
            SELF.statename := Cat.toState(LEFT.state);
            SELF.name := STD.Str.ToUpperCase(LEFT.name);
            SELF.city := STD.Str.ToUpperCase(LEFT.city);
            SELF.latitude := (INTEGER) LEFT.latitude;
            SELF.longitude := (INTEGER) LEFT.longitude;
            SELF:= LEFT
        )
    );
    //toState
maxDate := MAX(ox.ds, date);
maxDate;
appendSocialDistancing := JOIN(
    ds, Ox.ds(date = maxDate), 
    LEFT.statename = RIGHT.RegionName AND LEFT.country = RIGHT.countryname, 
    TRANSFORM(public.layout,
            SELF.C1_School_Closing := RIGHT.C1_School_Closing;
            SELF.ConfirmedCases := RIGHT.ConfirmedCases;
            SELF.H6_Facial_Coverings := RIGHT.H6_Facial_Coverings;
            SELF.C4_Restrictions_on_gatherings := RIGHT.C4_Restrictions_on_gatherings,
            SELF := LEFT), LEFT outer);
            OUTPUT(Ox.ds(countryname = 'US'));
            OUTPUT(ds);
            OUTPUT(oxRaw.ds);
            OUTPUT(appendSocialDistancing, , public.aldFilePath, OVERWRITE, COMPRESSED);
        // raw.ds, Oath, OVERWRITE, COMPRESSED);