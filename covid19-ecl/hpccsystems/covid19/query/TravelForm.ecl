#WORKUNIT('name', 'hpccsystems_covid19_query_travel_form');

IMPORT hpccsystems.covid19.file.public.travelFormClean as public;

IMPORT Std;
IMPORT $;

QueryRec := RECORD  
STRING city;  
STRING state;  
STRING country; 
END; 

compareRecs := DATASET([],QueryRec) : STORED('recs'); 

outdataset := JOIN(public.ds, compareRecs,
    STD.STR.TOUPPERCASE(TRIM(LEFT.city, LEFT, RIGHT)) = 
    STD.STR.TOUPPERCASE(TRIM(RIGHT.city, LEFT, RIGHT)) AND
    STD.STR.TOUPPERCASE(TRIM(LEFT.state, LEFT, RIGHT)) = 
    STD.STR.TOUPPERCASE(TRIM(RIGHT.state, LEFT, RIGHT)) AND
    STD.STR.TOUPPERCASE(TRIM(LEFT.country, LEFT, RIGHT)) = 
    STD.STR.TOUPPERCASE(TRIM(RIGHT.country, LEFT, RIGHT)),
    TRANSFORM(LEFT));

OUTPUT(compareRecs, NAMED('compareRecs'), ALL);
OUTPUT(outDataset, NAMED('outDataset'), ALL);
