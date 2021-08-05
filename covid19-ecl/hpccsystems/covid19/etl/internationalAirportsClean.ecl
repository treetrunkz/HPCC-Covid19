IMPORT hpccsystems.covid19.file.raw.InternationalAirports as rawAirports;
IMPORT hpccsystems.covid19.file.public.InternationalAirports as publicAirports;
IMPORT hpccsystems.covid19.utils.CatalogCountries as Cat;
IMPORT Std;


intlds := PROJECT
    (
        rawAirports.ds(airport_type = 'large_airport'),
            TRANSFORM(publicAirports.layout,
                SELF.iata := LEFT.gps_code;
                SELF.name := LEFT.name;
                SELF.latitude := (REAL)LEFT.latitude_deg;
                SELF.longitude := (REAL)LEFT.longitude_deg;
                SELF.countryCode := LEFT.iso_country;
                SELF.countryname := Cat.toCountry(LEFT.iso_country);
                name0 := REGEXREPLACE('[A-Z]{2}-', LEFT.iso_region, '');
                SELF.state := name0;
                SELF.city := LEFT.municipality;
    )
);

OUTPUT(intlds, ,publicAirports.filePath, OVERWRITE, COMPRESSED);