EXPORT Paths := MODULE
  // Input Superfiles
  EXPORT InputLevel1 := '~hpccsystems::covid19::file::input::level1';
  EXPORT InputLevel2 := '~hpccsystems::covid19::file::input::level2';
  EXPORT InputLevel3 := '~hpccsystems::covid19::file::input::level3';
  // Johns Hopkins Input subfiles
  EXPORT JHLevel1 := '~hpccsystems::covid19::file::input::source::jh::level1';
  EXPORT JHLevel2 := '~hpccsystems::covid19::file::input::source::jh::level2';
  EXPORT JHLevel3 := '~hpccsystems::covid19::file::input::source::jh::level3';

  // Vaccine data (L1 and L2 only)
  EXPORT VaccLevel1 := '~hpccsystems::covid19::file::public::owid::v2::vaccinations.flat';
  EXPORT VaccLevel2 := '~hpccsystems::covid19::file::public::owid::v2::us_states_vaccinations.flat';
  
  // Add other Input sources here
  
  // Stats Files
  EXPORT StatsLevel0 := '~hpccsystems::covid19::file::public::stats::Level0.flat';
  EXPORT StatsLevel1 := '~hpccsystems::covid19::file::public::stats::Level1.flat';
  EXPORT StatsLevel2 := '~hpccsystems::covid19::file::public::stats::Level2.flat';
  EXPORT StatsLevel3 := '~hpccsystems::covid19::file::public::stats::Level3.flat';

  // Metrics Files
  EXPORT MetricsLevel0 := '~hpccsystems::covid19::file::public::metrics::Level0.flat';
  EXPORT MetricsLevel1 := '~hpccsystems::covid19::file::public::metrics::Level1.flat';
  EXPORT MetricsLevel2 := '~hpccsystems::covid19::file::public::metrics::Level2.flat';
  EXPORT MetricsLevel3 := '~hpccsystems::covid19::file::public::metrics::Level3.flat';

  // Metrics Evolution Files
  EXPORT MetricsEvolLevel0 := '~hpccsystems::covid19::file::public::metricsevol::Level0.flat';
  EXPORT MetricsEvolLevel1 := '~hpccsystems::covid19::file::public::metricsevol::Level1.flat';
  EXPORT MetricsEvolLevel2 := '~hpccsystems::covid19::file::public::metricsevol::Level2.flat';
  EXPORT MetricsEvolLevel3 := '~hpccsystems::covid19::file::public::metricsevol::Level3.flat';
END;