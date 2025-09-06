// types.ts - Define interfaces first
export interface ScreeningCriteria {
  // Islamic/Financial criteria
  cash_limit?: number;
  debt_limit?: number;
  receivables_limit?: number;
  impermissible_income_limit?: number;
  use_total_assets?: boolean;
  
  // ESG criteria
  min_esg_score?: number;
  max_esg_risk?: number;
  max_carbon_intensity?: number;
  min_board_diversity?: number;
  min_governance_score?: number;
  exclude_controversies?: boolean;
  exclude_severe_controversies?: boolean;
  
  // Faith-based criteria
  exclude_sin_stocks?: boolean;
  min_community_impact_score?: number;
  support_human_dignity?: boolean;
  kosher_food_only?: boolean;
  sabbath_observant?: boolean;
  exclude_mixed_textiles?: boolean;
  
  // Custom criteria
  custom_rules?: Record<string, any>;
}

export interface Methodology {
  name: string;
  type: string;
  description?: string;
  criteria: ScreeningCriteria;
  prohibited_sectors: string[];
  preferred_sectors?: string[];
  region?: string;
  authority?: string;
  year_established?: number;
  last_updated?: string;
}

export interface ScreeningType {
  name: string;
  description: string;
  icon: string;
  color: string;
  methodologies: string[];
  market_size?: string;
  global_assets?: string;
}

// constants.ts - Improved structure
export const ETHICAL_SCREENING_TYPES: Record<string, ScreeningType> = {
  islamic: {
    name: 'Islamic Finance',
    description: 'Sharia-compliant investing principles based on Islamic law',
    icon: '🕌',
    color: 'emerald',
    methodologies: ['AAOIFI', 'DJIM', 'FTSE', 'MSCI', 'MSCI_M_SERIES', 'SP500', 'INDONESIA', 'MALAYSIA'],
    market_size: '$2.4 trillion',
    global_assets: 'Growing 10-15% annually'
  },
  esg: {
    name: 'ESG',
    description: 'Environmental, Social, and Governance focused sustainable investing',
    icon: '🌱',
    color: 'green',
    methodologies: ['MSCI_ESG', 'SUSTAINALYTICS', 'FTSE4GOOD', 'REFINITIV_ESG', 'CUSTOM_ESG'],
    market_size: '$35 trillion',
    global_assets: '33% of global assets under management'
  },
  christian: {
    name: 'Christian Values',
    description: 'Faith-based investing aligned with Christian ethical principles',
    icon: '✝️',
    color: 'blue',
    methodologies: ['SRI', 'CATHOLIC', 'PROTESTANT', 'EVANGELICAL', 'CUSTOM_CHRISTIAN'],
    market_size: '$1.2 trillion',
    global_assets: 'Largest faith-based investing segment'
  },
  jewish: {
    name: 'Jewish Values',
    description: 'Kosher investing aligned with Jewish ethical and dietary laws',
    icon: '✡️',
    color: 'indigo',
    methodologies: ['ORTHODOX', 'CONSERVATIVE', 'REFORM', 'CUSTOM_JEWISH'],
    market_size: '$150 billion',
    global_assets: 'Fastest growing faith-based segment'
  },
  custom: {
    name: 'Custom Criteria',
    description: 'Build your own ethical screening methodology',
    icon: '🎯',
    color: 'purple',
    methodologies: ['USER_DEFINED'],
    market_size: 'Unlimited potential',
    global_assets: 'Personalized investing approach'
  }
};

// Consolidated methodologies with complete data
export const ALL_METHODOLOGIES: Record<string, Methodology> = {
  // ISLAMIC METHODOLOGIES
  AAOIFI: {
    name: 'AAOIFI',
    type: 'islamic',
    description: 'Accounting and Auditing Organization for Islamic Financial Institutions standard',
    criteria: {
      cash_limit: 30,
      debt_limit: 30,
      receivables_limit: 67,
      impermissible_income_limit: 5,
      use_total_assets: false
    },
    prohibited_sectors: [
      'financial_services', 'banks', 'insurance', 'alcohol', 'tobacco', 
      'gambling', 'adult_entertainment', 'defense', 'pork', 'interest_based_activities'
    ],
    region: 'Global',
    authority: 'AAOIFI',
    year_established: 1991,
    last_updated: '2020'
  },
  
  DJIM: {
    name: 'Dow Jones Islamic Market',
    type: 'islamic',
    description: 'S&P Dow Jones Indices Sharia screening methodology',
    criteria: {
      cash_limit: 33,
      debt_limit: 33,
      receivables_limit: 33,
      impermissible_income_limit: 5,
      use_total_assets: false
    },
    prohibited_sectors: [
      'financial_services', 'banks', 'insurance', 'alcohol', 'tobacco',
      'gambling', 'adult_entertainment', 'defense', 'pork'
    ],
    region: 'Global',
    authority: 'S&P Dow Jones Indices',
    year_established: 1999,
    last_updated: '2023'
  },

  FTSE: {
    name: 'FTSE Shariah',
    type: 'islamic',
    description: 'FTSE Russell Shariah screening methodology',
    criteria: {
      cash_limit: 33,
      debt_limit: 33,
      receivables_limit: 50,
      impermissible_income_limit: 5,
      use_total_assets: true
    },
    prohibited_sectors: [
      'financial_services', 'banks', 'insurance', 'alcohol', 'tobacco',
      'gambling', 'adult_entertainment', 'defense', 'pork'
    ],
    region: 'Global',
    authority: 'FTSE Russell',
    year_established: 1998,
    last_updated: '2023'
  },

  MSCI: {
    name: 'MSCI Islamic',
    type: 'islamic',
    description: 'MSCI Islamic screening methodology',
    criteria: {
      cash_limit: 33.33,
      debt_limit: 33.33,
      receivables_limit: 33.33,
      impermissible_income_limit: 5,
      use_total_assets: true
    },
    prohibited_sectors: [
      'financial_services', 'banks', 'insurance', 'alcohol', 'tobacco',
      'gambling', 'adult_entertainment', 'defense', 'pork'
    ],
    region: 'Global',
    authority: 'MSCI Inc',
    year_established: 2007,
    last_updated: '2023'
  },

  MSCI_M_SERIES: {
    name: 'MSCI Islamic M-Series',
    type: 'islamic',
    description: 'MSCI Islamic M-Series with market cap based calculations',
    criteria: {
      cash_limit: 33.33,
      debt_limit: 33.33,
      receivables_limit: 49,
      impermissible_income_limit: 5,
      use_total_assets: false // Uses market cap
    },
    prohibited_sectors: [
      'financial_services', 'banks', 'insurance', 'alcohol', 'tobacco',
      'gambling', 'adult_entertainment', 'defense', 'pork'
    ],
    region: 'Global',
    authority: 'MSCI Inc',
    year_established: 2018,
    last_updated: '2023'
  },

  SP500: {
    name: 'S&P 500 Shariah',
    type: 'islamic',
    description: 'S&P 500 Shariah compliant screening methodology',
    criteria: {
      cash_limit: 33,
      debt_limit: 33,
      receivables_limit: 49,
      impermissible_income_limit: 5,
      use_total_assets: false
    },
    prohibited_sectors: [
      'financial_services', 'banks', 'insurance', 'alcohol', 'tobacco',
      'gambling', 'adult_entertainment', 'defense', 'pork'
    ],
    region: 'US',
    authority: 'S&P Dow Jones Indices',
    year_established: 2006,
    last_updated: '2023'
  },

  INDONESIA: {
    name: 'Indonesia Islamic',
    type: 'islamic',
    description: 'Indonesian Islamic capital market screening standards',
    criteria: {
      debt_limit: 45,
      impermissible_income_limit: 10,
      use_total_assets: true
    },
    prohibited_sectors: [
      'financial_services', 'banks', 'insurance', 'alcohol', 'tobacco',
      'gambling', 'adult_entertainment', 'defense', 'pork'
    ],
    region: 'Indonesia',
    authority: 'OJK (Financial Services Authority)',
    year_established: 2012,
    last_updated: '2023'
  },

  MALAYSIA: {
    name: 'Malaysia SC Shariah',
    type: 'islamic',
    description: 'Securities Commission Malaysia Shariah screening methodology',
    criteria: {
      cash_limit: 33,
      debt_limit: 33,
      impermissible_income_limit: 25, // Higher tolerance for mixed businesses
      use_total_assets: true
    },
    prohibited_sectors: [
      'financial_services', 'banks', 'insurance', 'alcohol', 'tobacco',
      'gambling', 'adult_entertainment', 'defense', 'pork'
    ],
    preferred_sectors: ['islamic_banking', 'halal_food', 'technology', 'healthcare'],
    region: 'Malaysia',
    authority: 'Securities Commission Malaysia',
    year_established: 1997,
    last_updated: '2023'
  },

  // ESG METHODOLOGIES
  MSCI_ESG: {
    name: 'MSCI ESG Ratings',
    type: 'esg',
    description: 'MSCI ESG Research ratings methodology',
    criteria: {
      min_esg_score: 7.0,
      max_carbon_intensity: 100,
      min_board_diversity: 30,
      exclude_controversies: true
    },
    prohibited_sectors: ['tobacco', 'weapons', 'thermal_coal', 'oil_sands', 'arctic_drilling'],
    preferred_sectors: ['clean_energy', 'water_tech', 'sustainable_agriculture', 'green_building'],
    region: 'Global',
    authority: 'MSCI Inc',
    year_established: 2010,
    last_updated: '2024'
  },

  SUSTAINALYTICS: {
    name: 'Sustainalytics ESG Risk',
    type: 'esg',
    description: 'Sustainalytics ESG Risk Rating methodology',
    criteria: {
      max_esg_risk: 25,
      min_governance_score: 60,
      exclude_severe_controversies: true
    },
    prohibited_sectors: ['tobacco', 'weapons', 'gambling', 'adult_entertainment', 'predatory_lending'],
    preferred_sectors: ['renewable_energy', 'healthcare', 'education', 'sustainable_tech'],
    region: 'Global',
    authority: 'Sustainalytics',
    year_established: 2009,
    last_updated: '2024'
  },

  FTSE4GOOD: {
    name: 'FTSE4Good',
    type: 'esg',
    description: 'FTSE Russell sustainable investment index series',
    criteria: {
      min_esg_score: 6.5,
      exclude_controversies: true,
      min_board_diversity: 25
    },
    prohibited_sectors: ['tobacco', 'weapons', 'nuclear_power', 'adult_entertainment'],
    preferred_sectors: ['clean_technology', 'healthcare', 'education'],
    region: 'Global',
    authority: 'FTSE Russell',
    year_established: 2001,
    last_updated: '2024'
  },

  // CHRISTIAN METHODOLOGIES
  SRI: {
    name: 'Socially Responsible Investing',
    type: 'christian',
    description: 'General Christian socially responsible investing principles',
    criteria: {
      exclude_sin_stocks: true,
      min_community_impact_score: 6.0,
      support_human_dignity: true
    },
    prohibited_sectors: [
      'alcohol', 'tobacco', 'gambling', 'adult_entertainment', 'abortion_services',
      'predatory_lending', 'private_prisons'
    ],
    preferred_sectors: ['healthcare', 'education', 'clean_energy', 'community_development', 'affordable_housing'],
    region: 'Global',
    authority: 'Various Christian organizations',
    year_established: 1970,
    last_updated: '2024'
  },

  CATHOLIC: {
    name: 'Catholic Social Teaching',
    type: 'christian',
    description: 'Catholic Church social teaching principles for investing',
    criteria: {
      exclude_sin_stocks: true,
      min_community_impact_score: 7.0,
      support_human_dignity: true
    },
    prohibited_sectors: [
      'alcohol', 'tobacco', 'gambling', 'adult_entertainment', 'abortion_services',
      'contraceptives', 'embryonic_stem_cell', 'predatory_lending'
    ],
    preferred_sectors: ['healthcare', 'education', 'community_development', 'fair_trade', 'microfinance'],
    region: 'Global',
    authority: 'Vatican/Catholic Church',
    year_established: 1891,
    last_updated: '2024'
  },

  // JEWISH METHODOLOGIES
  ORTHODOX: {
    name: 'Orthodox Jewish Values',
    type: 'jewish',
    description: 'Orthodox Jewish halachic principles for investing',
    criteria: {
      kosher_food_only: true,
      sabbath_observant: true,
      exclude_mixed_textiles: true
    },
    prohibited_sectors: [
      'pork', 'shellfish', 'non_kosher_food', 'mixed_textiles', 'gambling',
      'adult_entertainment', 'interest_based_lending'
    ],
    preferred_sectors: ['kosher_food', 'technology', 'healthcare', 'education', 'israel_bonds'],
    region: 'Global',
    authority: 'Orthodox rabbinical authorities',
    year_established: 1980,
    last_updated: '2024'
  },

  CONSERVATIVE: {
    name: 'Conservative Jewish Values',
    type: 'jewish',
    description: 'Conservative Jewish movement ethical investing principles',
    criteria: {
      kosher_food_only: false, // More flexible
      sabbath_observant: false,
      exclude_mixed_textiles: false
    },
    prohibited_sectors: ['pork', 'gambling', 'adult_entertainment', 'weapons'],
    preferred_sectors: ['technology', 'healthcare', 'education', 'social_justice'],
    region: 'Global',
    authority: 'Conservative Jewish movement',
    year_established: 1985,
    last_updated: '2024'
  }
};

// Comprehensive sector classifications
export const SECTOR_CLASSIFICATIONS: Record<string, string[]> = {
  // Financial Services
  financial_services: ['Banks', 'Insurance', 'Financial Services', 'Credit Services', 'Investment Banking'],
  banks: ['Commercial Banks', 'Investment Banks', 'Regional Banks', 'Savings Banks'],
  insurance: ['Life Insurance', 'Property Insurance', 'Health Insurance', 'Reinsurance'],
  
  // Prohibited Substances
  alcohol: ['Alcoholic Beverages', 'Distillers & Vintners', 'Brewers', 'Wine & Spirits'],
  tobacco: ['Tobacco', 'Cigarettes', 'E-cigarettes', 'Tobacco Products'],
  pork: ['Pork Processing', 'Pork Products', 'Pig Farming'],
  
  // Activities
  gambling: ['Casinos & Gaming', 'Gambling', 'Lottery', 'Sports Betting', 'Online Gaming'],
  adult_entertainment: ['Adult Entertainment', 'Strip Clubs', 'Adult Content'],
  defense: ['Defense', 'Aerospace & Defense', 'Weapons', 'Military Equipment'],
  
  // Food & Agriculture
  kosher_food: ['Kosher Food Products', 'Kosher Restaurants', 'Kosher Certification'],
  non_kosher_food: ['Pork Products', 'Shellfish', 'Mixed Meat & Dairy'],
  shellfish: ['Shellfish Processing', 'Crab', 'Lobster', 'Shrimp'],
  
  // ESG Related
  clean_energy: ['Solar Energy', 'Wind Energy', 'Hydroelectric', 'Geothermal', 'Clean Technology'],
  fossil_fuels: ['Oil & Gas', 'Coal', 'Oil Refining', 'Natural Gas'],
  thermal_coal: ['Coal Mining', 'Coal Power', 'Thermal Coal'],
  weapons: ['Weapons Manufacturing', 'Military Contractors', 'Defense Systems'],
  
  // Social Good
  healthcare: ['Pharmaceuticals', 'Medical Devices', 'Healthcare Services', 'Biotechnology'],
  education: ['Education Services', 'Online Education', 'Educational Technology'],
  community_development: ['Community Banks', 'Affordable Housing', 'Microfinance'],
  
  // Textiles (Jewish)
  mixed_textiles: ['Mixed Fiber Clothing', 'Linen-Wool Blends'],
  
  // Christian Specific
  abortion_services: ['Abortion Clinics', 'Abortion Pharmaceuticals'],
  contraceptives: ['Contraceptive Manufacturing', 'Birth Control'],
  predatory_lending: ['Payday Loans', 'Title Loans', 'High-Interest Lending'],
  
  // Technology & Modern
  technology: ['Software', 'Hardware', 'Internet Services', 'Cloud Computing'],
  sustainable_tech: ['Clean Technology', 'Energy Efficiency', 'Sustainable Materials']
};

// Helper functions for methodology management
export const getMethodologiesByType = (type: string): Record<string, Methodology> => {
  return Object.fromEntries(
    Object.entries(ALL_METHODOLOGIES).filter(([_, methodology]) => methodology.type === type)
  );
};

export const getMethodologyByKey = (key: string): Methodology | undefined => {
  return ALL_METHODOLOGIES[key];
};

export const getSectorClassification = (sectorKey: string): string[] => {
  return SECTOR_CLASSIFICATIONS[sectorKey] || [];
};

// Validation helpers
export const validateMethodology = (methodology: Methodology): boolean => {
  return !!(methodology.name && methodology.type && methodology.criteria && methodology.prohibited_sectors);
};

export const isSectorProhibited = (stockSector: string, prohibitedSectors: string[]): boolean => {
  return prohibitedSectors.some(prohibitedSector => 
    getSectorClassification(prohibitedSector).includes(stockSector)
  );
};