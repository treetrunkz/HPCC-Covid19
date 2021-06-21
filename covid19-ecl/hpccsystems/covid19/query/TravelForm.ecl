#WORKUNIT('name', 'hpccsystems_covid19_query_travel_form');

IMPORT hpccsystems.covid19.file.public.travelFormClean as public;

IMPORT Std;
IMPORT $;

//generate a name that is TravelQuery or something that is useful

// _stateFilter := 'states':STORED('statesFilter');
// based on what is passed in the data set will be filtered when it is output FILTER of city state
// query will give back only what we need on the javascript side. this is for plotting the lat lon tap into other datasets later
// for the rest of the data. for now only plot the airports.

//provide info i already have here* the ALDxData

//we are using list that is passed in != STORED(city, etc) 
//join to my dataset 
QueryRec := RECORD  
STRING city;  
STRING state;  
STRING country; 
END; 


//const dataset from the records
//create array [], QueryRec and have it stored as recs
pRecs := DATASET([],QueryRec) : STORED('recs'); 
//city, state, country array[]


//statement
outdataset := JOIN(public.ds, pRecs,
    STD.STR.TOUPPERCASE(TRIM(LEFT.city, LEFT, RIGHT)) = 
    STD.STR.TOUPPERCASE(TRIM(RIGHT.city, LEFT, RIGHT)) AND
    STD.STR.TOUPPERCASE(TRIM(LEFT.state, LEFT, RIGHT)) = 
    STD.STR.TOUPPERCASE(TRIM(RIGHT.state, LEFT, RIGHT)) AND
    STD.STR.TOUPPERCASE(TRIM(LEFT.country, LEFT, RIGHT)) = 
    STD.STR.TOUPPERCASE(TRIM(RIGHT.country, LEFT, RIGHT)),
    TRANSFORM(public.layout, SELF:= LEFT), LEFT only);

OUTPUT(public.ds(city = 'SEATTLE' AND state = 'WA' AND country = 'USA'));
OUTPUT(pRecs, NAMED('inputRecords'), ALL);
OUTPUT(public.ds(country != ''), NAMED('publicRecords'), ALL);
OUTPUT(outdataset, NAMED('recs'), ALL);