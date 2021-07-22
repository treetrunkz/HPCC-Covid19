#WORKUNIT('name', 'hpccsystems_covid19_query_travel_form');

IMPORT hpccsystems.covid19.file.public.travelFormClean as public;
IMPORT hpccsystems.covid19.file.public.LevelMeasures as measures;

IMPORT Std;
IMPORT $;

QueryRec := RECORD  
STRING city;  
STRING state;  
STRING country; 
INTEGER itemCount;
END; 

compareRecs := DATASET([],QueryRec) : STORED('recs'); 
//create a new join condition for these datas STD.Date.Second()


// );
outdataset := JOIN(public.ds, compareRecs,
    STD.STR.TOUPPERCASE(TRIM(LEFT.city, LEFT, RIGHT)) = 
    STD.STR.TOUPPERCASE(TRIM(RIGHT.city, LEFT, RIGHT)) AND
    STD.STR.TOUPPERCASE(TRIM(LEFT.state, LEFT, RIGHT)) = 
    STD.STR.TOUPPERCASE(TRIM(RIGHT.state, LEFT, RIGHT)) AND
    STD.STR.TOUPPERCASE(TRIM(LEFT.country, LEFT, RIGHT)) = 
    STD.STR.TOUPPERCASE(TRIM(RIGHT.country, LEFT, RIGHT)),
    TRANSFORM(LEFT));

sortedRecords := DEDUP(SORT(outdataset, country, state, city), country, state, city);

OUTPUT(sortedRecords, NAMED('outDataset'), ALL);
