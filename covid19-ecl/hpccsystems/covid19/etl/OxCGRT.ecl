IMPORT hpccsystems.covid19.file.raw.OxCGRT as raw;
IMPORT hpccsystems.covid19.file.public.OxCGRT as public;
IMPORT hpccsystems.covid19.utils.CatalogISO as Cat;
IMPORT STD;

ds := raw.ds;

cleanDS := PROJECT(ds, TRANSFORM(public.layout,
                                  SELF.Date := Std.Date.FromStringToDate(LEFT.Date, '%Y%m%d');
                                  SELF.countryname := IF(LEFT.countrycode='USA','US',Std.Str.ToUpperCase(LEFT.countryname)),
                                  SELF.countrycode := Cat.toCode(LEFT.countrycode),
                                  SELF.regionname := STD.Str.ToUpperCase(LEFT.regionname),
                                  SELF.regioncode := STD.Str.ToUpperCase(LEFT.regioncode),
                                  SELF := LEFT));
OUTPUT(cleands, , public.filepath, OVERWRITE, COMPRESSED);

cleanDS;