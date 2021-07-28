IMPORT hpccsystems.covid19.file.public.LevelMeasures as Measures;
IMPORT hpccsystems.covid19.file.public.internationalMeasure as internationalMeasure;
IMPORT hpccsystems.covid19.file.public.internationalAirports as PublicAirports;
IMPORT hpccsystems.covid19.file.public.travelFormAirportOx as AirportsOxford;
IMPORT hpccsystems.covid19.utils.CatalogCountries as Cat;
IMPORT hpccsystems.covid19.file.public.OxCGRT as ox; 

IMPORT Std;

maxDate := MAX(Ox.ds, date);

worldDs := JOIN(PublicAirports.ds,  ox.ds(date = maxDate AND jurisdiction = 'NAT_TOTAL'),
                    LEFT.countryCode = RIGHT.countryCode,
                    TRANSFORM
                    (
                        AirportsOxford.layout,
                        SELF.country := LEFT.countryName;
                        SELF.city := LEFT.city;
                        SELF := LEFT,
                        SELF := RIGHT
                    ), 
                    LEFT OUTER
                    );

level1 := Measures.level1_metrics(period = 1);

AirportsxALD := JOIN(level1, worldDS,
                        LEFT.location = Cat.toCountry(RIGHT.country),
                        TRANSFORM
                        (
                            internationalMeasure.layout,
                            SELF.enddate := LEFT.enddate;
                            SELF.new_deaths := LEFT.deaths;
                            SELF.new_cases := LEFT.cases;
                            SELF.E1_Income_support := RIGHT.E1_Income_support;
                            SELF.C6_Stay_at_home_requirements := RIGHT.C6_Stay_at_home_requirements;
                            SELF.C2_flag := RIGHT.C2_flag;
                            SELF.C1_School_Closing := RIGHT.C1_School_Closing;
                            SELF.ConfirmedCases := RIGHT.ConfirmedCases;
                            SELF.H6_Facial_Coverings := RIGHT.H6_Facial_Coverings;
                            SELF.C4_Restrictions_on_gatherings := RIGHT.C4_Restrictions_on_gatherings;
                            SELF := LEFT,
                            SELF := RIGHT
                        ), 
                        LEFT OUTER
                    );
OUTPUT(AirportsxALD, , AirportsOxford.filepath, COMPRESSED, OVERWRITE );
