#WORKUNIT('name', 'hpccsystems_covid19_query_travel_countries');

IMPORT hpccsystems.covid19.file.public.LevelMeasures as measures;

OUTPUT(measures.level1_metrics(period=1),{location, vacc_complete_pct, contagionrisk}, NAMED('countries_metrics'), ALL);