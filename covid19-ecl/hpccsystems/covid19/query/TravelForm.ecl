#WORKUNIT('name', 'hpccsystems_covid19_query_travel_form');

IMPORT hpccsystems.covid19.file.public.LevelMeasures as measures;
IMPORT hpccsystems.covid19.file.public.internationalMeasure as internationalMeasure;


IMPORT Std;
IMPORT $;

QueryRec := RECORD  
STRING city;  
STRING countryCode; 
INTEGER itemCount;
END; 

compareRecs := DATASET([],QueryRec) : STORED('recs'); 


outdataset := JOIN(internationalMeasure.ds, compareRecs,
    STD.STR.TOUPPERCASE(TRIM(LEFT.city, LEFT, RIGHT)) = 
    STD.STR.TOUPPERCASE(TRIM(RIGHT.city, LEFT, RIGHT)) AND
    STD.STR.TOUPPERCASE(TRIM(LEFT.countryCode, LEFT, RIGHT)) = 
    STD.STR.TOUPPERCASE(TRIM(RIGHT.countryCode, LEFT, RIGHT)),
    TRANSFORM(LEFT));

sortedRecords := DEDUP(SORT(outdataset, countryCode, city), countryCode, city);

OUTPUT(sortedRecords, NAMED('travel_search'), ALL);
