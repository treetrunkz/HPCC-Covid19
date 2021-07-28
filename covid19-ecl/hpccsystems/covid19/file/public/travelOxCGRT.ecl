EXPORT travelOxCGRT := MODULE;

EXPORT layout := RECORD

    REAL E1_Income_support;
    REAL C6_Stay_at_home_requirements;
    STRING C2_Flag;
    REAL C1_School_closing;
    REAL ConfirmedCases;
    REAL H6_Facial_Coverings;
    REAL C4_Restrictions_on_gatherings;

END;

  EXPORT ds := DATASET( layout);

END;