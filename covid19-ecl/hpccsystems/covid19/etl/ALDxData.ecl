IMPORT hpccsystems.covid19.file.public.travelFormClean as public;
IMPORT hpccsystems.covid19.file.raw.travelFormAirlines as raw;
IMPORT hpccsystems.covid19.file.raw.OxCGRT as OxRaw;
IMPORT hpccsystems.covid19.file.public.OxCGRT as Ox;
IMPORT hpccsystems.covid19.utils.CatalogUSStates as Cat;
IMPORT hpccsystems.covid19.file.raw.internationalAirlines as rW;
IMPORT hpccsystems.covid19.file.public.WorldAirlineLayout as World;
IMPORT hpccsystems.covid19.file.public.LevelMeasures as measures;
IMPORT hpccsystems.covid19.file.public.internationalMeasure as mLayout;
IMPORT Std;



intlds := PROJECT
    (
        rW.ds,
        TRANSFORM
        (World.layout,
            SELF.iata := LEFT.iata;
            SELF.name := STD.Str.ToUpperCase(LEFT.name);
            SELF.latitude := (INTEGER) LEFT.latitude;
            SELF.longitude := (INTEGER) LEFT.longitude;
            SELF.country := STD.Str.ToUpperCase(LEFT.country);
            name0 := REGEXREPLACE('[A-Z]{2}-', LEFT.state, '');
            SELF.state := name0;
            SELF.city := STD.Str.ToUpperCase(LEFT.city)
            )
    );

ds := PROJECT
    (
        raw.ds,
        TRANSFORM 
        (public.layout,
            SELF.country:= 'US';
            SELF.statename := Cat.toState(LEFT.state);
            SELF.name := STD.Str.ToUpperCase(LEFT.name);
            SELF.city := STD.Str.ToUpperCase(LEFT.city);
            SELF.latitude := (INTEGER) LEFT.latitude;
            SELF.longitude := (INTEGER) LEFT.longitude;
            SELF:= LEFT
        )
    );

maxDate := MAX(Ox.ds, date);
maxDate;

appendSocialDistancing := JOIN(
    ds, Ox.ds(date = maxDate), 
    LEFT.statename = RIGHT.RegionName AND LEFT.country = RIGHT.countryname, 
    TRANSFORM(public.layout,
            SELF.Date := RIGHT.Date;
            SELF.C1_School_Closing := RIGHT.C1_School_Closing;
            SELF.E1_Income_support := RIGHT.E1_Income_support;
            SELF.ConfirmedCases := RIGHT.ConfirmedCases;
            SELF.H6_Facial_Coverings := RIGHT.H6_Facial_Coverings;
            SELF.C4_Restrictions_on_gatherings := RIGHT.C4_Restrictions_on_gatherings,
            SELF := LEFT), LEFT outer);
            OUTPUT(Ox.ds(countryname = 'US'));
            OUTPUT(ds);
            OUTPUT(oxRaw.ds);
            OUTPUT(appendSocialDistancing, ,public.aldFilePath, OVERWRITE, COMPRESSED);
            OUTPUT(intlds);

// appendInternational := JOIN(
//     intlds, appendSocialDistancing,
//     LEFT.state = LEFT.state AND
//     LEFT.longitude = RIGHT.longitude AND
//     LEFT.latitude = RIGHT.latitude AND
//     LEFT.iata = RIGHT.iata AND
//     LEFT.name = RIGHT.name AND
//     LEFT.country = RIGHT.country AND
//     LEFT.city = RIGHT.city,
//     TRANSFORM(public.layout,
//             SELF.Date := RIGHT.Date;
//             SELF.statename := RIGHT.statename;
//             SELF := LEFT), LEFT outer);
//     OUTPUT(appendInternational, ,public.aldFilePath, OVERWRITE, COMPRESSED);
 
appendInternational := JOIN(
    intlds, appendSocialDistancing,
    LEFT.state = LEFT.state AND
    LEFT.longitude = RIGHT.longitude AND
    LEFT.latitude = RIGHT.latitude AND
    LEFT.iata = RIGHT.iata AND
    LEFT.name = RIGHT.name AND
    LEFT.country = RIGHT.country AND
    LEFT.city = RIGHT.city,
    TRANSFORM(public.layout,
            SELF.Date := RIGHT.Date;
            SELF.statename := RIGHT.statename;
            SELF := LEFT), LEFT outer);
    OUTPUT(appendInternational, ,public.aldFilePath, OVERWRITE, COMPRESSED);

    measureInternational := JOIN(
        measures.level1_metrics, appendInternational,
        LEFT.location = RIGHT.country,
        TRANSFORM(mLayout.layout,
            SELF.iata := RIGHT.iata;
            SELF.name := STD.Str.ToUpperCase(RIGHT.name);
            SELF.latitude := (INTEGER) RIGHT.latitude;
            SELF.longitude := (INTEGER) RIGHT.longitude;
            SELF.country := STD.Str.ToUpperCase(LEFT.country);
            name0 := REGEXREPLACE('[A-Z]{2}-', RIGHT.state, '');
            SELF.state := name0;
            SELF.city := STD.Str.ToUpperCase(RIGHT.city);
            SELF.enddate := LEFT.enddate;
            SELF.new_deaths := LEFT.deaths;
            SELF.new_cases := LEFT.cases;
            SELF := LEFT,
            SELF := RIGHT));
    measureInternational;