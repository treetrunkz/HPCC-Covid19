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
                        SELF.country := RIGHT.countryName;
                        SELF.city := LEFT.city;
                        SELF.countryCode := LEFT.countryCode;
                        SELF := LEFT,
                        SELF := RIGHT
                    ), 
                    LEFT OUTER
                );

level1 := Measures.level1_metrics(period = 1);
//level1;

OUTPUT(worldDs,,NAMED('airports_joined_oxid'));
OUTPUT(worldDs(countrycode = 'GB'),NAMED('airports_joined_oxid_by_GB'));

AirportsxALD := JOIN(worldDS, level1,
                        RIGHT.location = Cat.toCountry(LEFT.country),
                        TRANSFORM
                        (
                            internationalMeasure.layout,
                            SELF.enddate := RIGHT.enddate;
                            SELF.new_deaths := RIGHT.deaths;
                            SELF.new_cases := RIGHT.cases;
                            SELF.vacc_total_people := RIGHT.vacc_total_people; 
                            SELF.vacc_complete_pct := RIGHT.vacc_complete_pct;
                            SELF.E1_Income_support := LEFT.E1_Income_support;
                            SELF.contagionrisk := RIGHT.contagionrisk;
                            SELF.C6_Stay_at_home_requirements := LEFT.C6_Stay_at_home_requirements;
                            SELF.C2_flag := LEFT.C2_flag;
                            SELF.C1_School_Closing := LEFT.C1_School_Closing;
                            SELF.ConfirmedCases := LEFT.ConfirmedCases;
                            SELF.H6_Facial_Coverings := LEFT.H6_Facial_Coverings;
                            SELF.C4_Restrictions_on_gatherings := LEFT.C4_Restrictions_on_gatherings;
                            SELF := LEFT,
                            SELF := RIGHT
                        ), 
                        LEFT OUTER
                    );
OUTPUT(AirportsxALD, , AirportsOxford.filepath, COMPRESSED, OVERWRITE );
OUTPUT(AirportsxALD(countrycode = 'GB'),,NAMED('all_by_GB'));