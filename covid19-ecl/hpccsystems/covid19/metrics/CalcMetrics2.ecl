﻿IMPORT $ AS COVID19;
IMPORT COVID19.Types2 AS Types;
IMPORT COVID19.Configuration AS config;
IMPORT Python3 AS Python;
metric_t := Types.metric_t;
statsRec := Types.statsRec;
metricsRec := Types.metricsRec;
populationRec := Types.populationRec;

EXPORT CalcMetrics2 := MODULE
  SHARED InfectionPeriod := Config.InfectionPeriod;
  SHARED PeriodDaysDefault := Config.PeriodDays;
  SHARED ScaleFactor := Config.ScaleFactor;  // Lower will give more hot spots.
  SHARED MinActDefault := Config.MinActDefault; // Minimum cases to be considered emerging, by default.
  SHARED MinActPer100k := Config.MinActPer100k; // Minimum active per 100K population to be considered emerging.
  SHARED infectedConfirmedRatio := Config.InfectedConfirmedRatio; // Calibrated by early antibody testing (rough estimate),
                                                                  // and ILI Surge statistics.
  SHARED locDelim := Config.LocDelim; // Delimiter between location terms.


  // Calculate Metrics, given input Stats Data.
  EXPORT DATASET(metricsRec) WeeklyMetrics(DATASET(statsRec) stats, UNSIGNED minActive = minActDefault, DECIMAL5_3 parentCFR = 0, periodDaysOverride = 0) := FUNCTION
    // Allow override of period days for certain uses
    PeriodDays := IF(periodDaysOverride > 0, periodDaysOverride, PeriodDaysDefault);
    // First add a period to records for each location
    statsGrpd0 := GROUP(stats, location);
    statsGrpd1 := PROJECT(statsGrpd0, TRANSFORM(RECORDOF(LEFT), SELF.period := (COUNTER-1) DIV periodDays + 1, SELF := LEFT));
    statsGrpd := GROUP(statsGrpd1, location, period);
    metricsRec doRollup(statsRec r, DATASET(statsRec) recs) := TRANSFORM
        SELF.location := r.location;
        SELF.fips := r.fips;
        SELF.period := r.period;
        SELF.Country := r.Country;
        SELF.Level2 := r.Level2;
        SELF.Level3 := r.Level3;
        cRecs := recs(cumCases > 0);
        mRecs := recs(cumDeaths > 0);
        cCount := COUNT(crecs);
        lastC := cRecs[1];
        firstC := cRecs[cCount];
        mCount := COUNT(mrecs);
        lastM := mRecs[1];
        firstM := mRecs[mCount];
        SELF.startDate := firstC.date; 
        SELF.endDate := lastC.date;
        SELF.periodDays := IF(cCount = 0, SKIP, cCount);
        SELF.cases := lastC.cumCases;
        SELF.deaths := lastM.cumDeaths;
        // Make sure distribution data doesn't roll up to level0 (World) because it is only valid for US.
        SELF.vacc_total_dist := IF(LENGTH(SELF.Country) > 0, lastM.vacc_total_dist, 0);
        SELF.vacc_total_admin := lastM.vacc_total_admin;
        SELF.vacc_total_people := lastM.vacc_total_people;
        SELF.vacc_people_complete := lastM.vacc_people_complete;
        // Use Adjusted counts for all non-cumulative attributes.  These have untimely bursts filtered out.
        SELF.newCases := IF(lastC.adjCumCases > firstC.adjPrevCases, lastC.adjCumCases - firstC.adjPrevCases, 0);
        SELF.newDeaths := IF(lastM.adjCumDeaths > firstM.adjPrevDeaths, lastM.adjCumDeaths - firstM.adjPrevDeaths, 0);
        SELF.newCasesDaily := IF(lastC.adjCumCases > lastC.adjPrevCases, lastC.adjCumCases - lastC.adjPrevCases, 0);
        SELF.newDeathsDaily := IF(lastM.adjCumDeaths > lastM.adjPrevDeaths, lastM.adjCumDeaths - lastM.adjPrevDeaths, 0);
        SELF.vacc_period_dist := IF(lastC.vacc_total_dist > firstC.vacc_total_dist, lastC.vacc_total_dist - firstC.vacc_total_dist, 0);
        SELF.vacc_period_admin := IF(lastC.vacc_total_admin > firstC.vacc_total_admin, lastC.vacc_total_admin - firstC.vacc_total_admin, 0);
        SELF.vacc_period_people := IF(lastC.vacc_total_people > firstC.vacc_total_people, lastC.vacc_total_people - firstC.vacc_total_people, 0);
        SELF.vacc_period_complete := IF(lastC.vacc_people_complete > firstC.vacc_people_complete, lastC.vacc_people_complete - firstC.vacc_people_complete, 0);
        SELF.vacc_admin_pct := IF(SELF.vacc_total_dist > 0, SELF.vacc_total_admin / (REAL)SELF.vacc_total_dist * 100, 0.0);
        SELF.active := lastC.active,
        SELF.recovered := lastC.recovered,
        SELF.cfr := lastC.cfr,
        SELF.ifr := SELF.cfr / infectedConfirmedRatio;
        cGrowth := SELF.newCases / firstC.active;
        cR_old := POWER(cGrowth, InfectionPeriod/cCount);  // Old CR calc might be useful later
        SELF.cR_old := MIN(cR_old, 9.99);
        SELF.population := IF(r.population = 0, 1, r.population);
        SELF.cases_per_capita := IF(SELF.population > 1, SELF.cases * 100000 / SELF.population, 0);
        SELF.deaths_per_capita := IF(SELF.population > 1, SELF.deaths * 100000 / SELF.population, 0);
        SELF.contagionRisk := IF(SELF.population > 1, 1 - (POWER(1 - (SELF.active * infectedConfirmedRatio / SELF.population), 100)), 0);
        vacc_complete_pct := IF(SELF.population > 1, SELF.vacc_people_complete / SELF.population, 0.0);
        // Calculate immune percent as: fraction of population infected + fraction of population vaccinated - fraction of vaccinated who were infected
        // We assume that vaccinated has the same proportion if previously infected as the general population, so the calculation becomes:
        // infectedPct + (100 - infectedPct) * vacc_complete_pct
        infectedPct := IF(SELF.population > 1, SELF.recovered / SELF.population * infectedConfirmedRatio, 0);
        SELF.immunePct := MIN((infectedPct + (1 - infectedPct) * vacc_complete_pct) * 100, 100);
        SELF.vacc_complete_pct := MIN(vacc_complete_pct * 100, 100);
    END;
    metrics0 := ROLLUP(statsGrpd, GROUP, doRollup(LEFT, ROWS(LEFT)));

    metricsRec calc1(metricsRec l, metricsRec r) := TRANSFORM
        prevNewCases := IF(r.newCases > 0, r.newCases, 1);
        cGrowth := l.newCases / prevNewCases;
        cR := MIN(POWER(cGrowth, InfectionPeriod/periodDays), 9.00);
        SELF.cR := cR;
        prevNewDeaths := IF(r.newDeaths > 0, r.newDeaths, 1);
        mGrowth :=  l.newDeaths / prevNewDeaths;
        mR := MIN(POWER(mGrowth, InfectionPeriod/periodDays), 9.99);
        SELF.mR := mR;
        // Use Geometric Mean of cR and mR to compute an estimate of R,
        // since we're working with growth statistics.
        R1 := IF(SELF.mR > 0 AND SELF.cR > 0, POWER(MIN(SELF.cR, SELF.mR + 1) * MIN(SELF.mR, SELF.cR + 1), .5), IF(SELF.cR > 0, SELF.cR, SELF.mR));
        SELF.R := R1;
        SELF.cmRatio := IF(mR > 0, cR / mR, 0);
        SELF.dcR := IF(r.cR > 0, cR / r.cR, 0);
        SELF.dmR := IF (r.mR > 0, l.mR / r.mR, 0);
        //SELF.medIndicator := IF(R1 > 1 AND SELF.cmRatio > 0 AND r.cmRatio > 0, l.cmRatio / r.cmRatio - 1, 0);
        medIndicator := IF(cR > 1.1 AND SELF.cmRatio < 1 AND SELF.cmRatio > 0, -(1/SELF.cmRatio - 1), IF(SELF.cmRatio > 1, SELF.cmRatio - 1, 0));
        SELF.medIndicator := MAX(MIN(medIndicator, 5), -5); 
        //SELF.sdIndicator := IF(R1 > 1, -SELF.dcR, 0);
        SELF.sdIndicator := MAX(MIN(IF(SELF.dcR >= 1, -(SELF.dcR - 1), 1/SELF.dcR - 1), 5), -5);
        // Assume that cR decreases with the inverse log of time.  First we calculate the base of the log
        b := POWER(10, (l.cR/r.cR * LOG(periodDays)));
        wtp0 := POWER(b, l.cR - 1);
        // Don't project beyond 10 weeks
        wtp := IF(wtp0 > 10, 999, wtp0);
        SELF.weeksToPeak := IF(l.cR > 1, IF(l.cR < r.cR, wtp, 999), 0);  // Needs to move to later.
        cSTI := IF(l.newCases > 0, l.newCasesDaily / (l.newCases / l.periodDays), 1);
        mSTI := IF(l.newDeaths > 0,  l.newDeathsDaily / (l.newDeaths / l.periodDays), 1);
        // Average case and death indicators and bound to range (.1, 10)
        STI0 := MIN(MAX((cSTI + mSTI) / 2.0, .1), 10);
        // Convert from ratio to indicator  (Negative is bad -- more than average cases on last day)
        STI := IF(STI0 <= 1.0, (1 / STI0) - 1, -(STI0 - 1));
        SELF.sti := STI;
        SELF.currCFR := l.newDeaths / r.active;
        EWI := IF(SELF.sdIndicator < -.2 AND SELF.medIndicator > .2, SELF.sdIndicator - SELF.medIndicator,
                  IF(SELF.sdIndicator > .2 AND SELF.medIndicator < -.2, SELF.sdIndicator - SELF.medIndicator, 0));
        SELF.ewi := EWI;
        SELF := l;
    END;
    // Join with previous period twice to force all of the dependent calculations to be there.
    metrics1 := JOIN(metrics0, metrics0, LEFT.location = RIGHT.location AND LEFT.period = RIGHT.period - 1,
                        calc1(LEFT, RIGHT), LEFT OUTER);
    metrics2 := JOIN(metrics1, metrics1, LEFT.location = RIGHT.location AND LEFT.period = RIGHT.period - 1,
                        calc1(LEFT, RIGHT), LEFT OUTER);

    // Gavin, why is this calculation wrong occasionally?
    metrics3 := ASSERT(PROJECT(metrics2, TRANSFORM(RECORDOF(LEFT),
                                    SELF.heatIndex := LOG(LEFT.active) * (IF(LEFT.cR > 1, LEFT.cR - 1, 0) +
                                            IF(LEFT.mr > 1,LEFT.mR - 1, 0) +
                                            IF(LEFT.medIndicator < 0, -LEFT.medIndicator, 0) +
                                            IF(LEFT.sdIndicator < 0, -LEFT.sdIndicator, 0))  / scaleFactor,
                                    SELF := LEFT)), heatIndex = 0 OR (cR > 0 OR mR > 0 OR medIndicator < 0 OR sdIndicator < 0 ), 'hi: ' + location + ',' + heatIndex + ',' + active + ',' + cR + ',' + mR + ',' + medIndicator + ',' + sdIndicator);
    metricsRec calc2(metricsRec l, metricsRec r) := TRANSFORM
        prevState := IF(l.location = r.location, l.iState, 'Initial');
        SELF.prevState := prevState;
        prevInfectCount := IF(l.location = r.location, l.infectionCount, 1);
        R1 := r.R;
        isOverMin := IF(r.population > 1, r.active / r.population * 100000 > minActPer100k OR r.active > minActive, r.active > minActive);
        SELF.iState := MAP(
            //prevState in ['Recovered', 'Recovering'] AND R1 >= 1.1 => 'Regressing',
            prevState = 'Initial' AND r.active = 0 => 'Initial',
            //prevState in ['Initial', 'Recovered', 'Recovering'] AND R1 > 1.1 AND r.active >= 1 AND r.active < minActive => 'Emerging',
            R1 > 1.5 AND r.active >= 1 AND NOT isOverMin => 'Emerging',
            R1 >= 1.5 => 'Spreading',
            R1 >= 1.1 AND R1 < 1.5 => 'Stabilizing',
            R1 >= .9 AND R1 < 1.1 => 'Stabilized',
            prevState != 'Initial' AND (R1 > .1 OR isOverMin) => 'Recovering',
            prevState != 'Initial' AND R1 <= .1 AND NOT isOverMin => 'Recovered',
            'Initial');
        wasRecovering := IF(l.location = r.location, IF(SELF.iState IN ['Recovered', 'Recovering'], TRUE, l.wasRecovering), FALSE);
        SELF.infectionCount := IF(wasRecovering AND self.iState IN ['Stabilizing', 'Emerging', 'Spreading'], prevInfectCount + 1, prevInfectCount);
        SELF.wasRecovering := IF(SELF.infectionCount > prevInfectCount, FALSE, wasRecovering);
        SELF.surgeStart := IF(SELF.prevState = 'Initial' OR SELF.infectionCount > prevInfectCount, r.startDate, l.surgeStart);
        SELF.peakCases := IF(l.location = r.location, IF(r.newCases > l.peakCases OR SELF.infectionCount > prevInfectCount, r.newCases, l.peakCases), r.newCases);
        SELF.peakDeaths := IF(l.location = r.location, IF(r.newDeaths > l.peakDeaths OR SELF.infectionCount > prevInfectCount, r.newDeaths, l.peakDeaths), r.newDeaths);			
        cR := IF(r.cR > 1, r.cR - 1, 0);
        mR := IF(r.mR > 1, r.mR - 1, 0);
        mi := IF(r.medIndicator < 0, -r.medIndicator / 2.5, 0);
        sdi := IF(r.sdIndicator < 0, -r.sdIndicator / 2.5, 0);
        SELF.heatIndex := LOG(r.active) * (MIN(cR, mR + 1) + MIN(mR, cR+1) + mi + sdi + r.contagionRisk) / scaleFactor;
        SELF := r;          
    END;
    metrics4 := SORT(metrics3, location, -period);
    metrics5 := ITERATE(metrics4, calc2(LEFT, RIGHT));
    metricsRec addCommentary(metricsRec rec) := TRANSFORM
      SELF.commentary := COVID19.GenerateCommentary(DATASET([rec], metricsRec), minActive, InfectionPeriod, parentCFR);
      SELF := rec;
    END;
    metrics6 := PROJECT(metrics5, addCommentary(LEFT));
    metrics := SORT(metrics6, location, period);
    return metrics;
  END;  // Weekly metrics
END; // CalcMetrics