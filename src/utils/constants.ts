export const ETHICAL_SCREENING_TYPES = {
  islamic: {
    name: 'Islamic Finance',
    description: 'Sharia-compliant investing principles',
    methodologies: ['AAOIFI', 'DJIM', 'FTSE', 'MSCI', 'SP500', 'INDONESIA', 'MALAYSIA']
  },
  esg: {
    name: 'ESG (Environmental, Social, Governance)',
    description: 'Sustainable and responsible investing',
    methodologies: ['MSCI_ESG', 'SUSTAINALYTICS', 'FTSE4GOOD', 'CUSTOM_ESG']
  },
  christian: {
    name: 'Christian Values',
    description: 'Faith-based investing aligned with Christian principles',
    methodologies: ['SRI', 'CATHOLIC', 'PROTESTANT', 'CUSTOM_CHRISTIAN']
  },
  jewish: {
    name: 'Jewish Values (Kosher)',
    description: 'Investments aligned with Jewish ethical principles',
    methodologies: ['ORTHODOX', 'CONSERVATIVE', 'REFORM', 'CUSTOM_JEWISH']
  },
  custom: {
    name: 'Custom Criteria',
    description: 'Build your own ethical screening criteria',
    methodologies: ['USER_DEFINED']
  }
};

export const ISLAMIC_METHODOLOGIES = {
  AAOIFI: {
    name: 'AAOIFI / Philippines',
    type: 'islamic',
    criteria: {
      cash_limit: 30,
      debt_limit: 30,
      receivables_limit: 67,
      impermissible_income_limit: 5,
      use_total_assets: false
    },
    prohibited_sectors: ['financial_services', 'banks', 'insurance', 'alcohol', 'tobacco', 'gambling', 'adult_entertainment', 'defense', 'pork']
  },
  DJIM: {
    name: 'Dow Jones Islamic Market',
    type: 'islamic',
    criteria: {
      cash_limit: 33,
      debt_limit: 33,
      receivables_limit: 33,
      impermissible_income_limit: 5,
      use_total_assets: false
    },
    prohibited_sectors: ['financial_services', 'banks', 'insurance', 'alcohol', 'tobacco', 'gambling', 'adult_entertainment', 'defense', 'pork']
  }
  // ... other Islamic methodologies
};

export const ESG_METHODOLOGIES = {
  MSCI_ESG: {
    name: 'MSCI ESG Ratings',
    type: 'esg',
    criteria: {
      min_esg_score: 7.0,
      max_carbon_intensity: 100,
      min_board_diversity: 30,
      exclude_controversies: true
    },
    prohibited_sectors: ['tobacco', 'weapons', 'thermal_coal', 'oil_sands']
  },
  SUSTAINALYTICS: {
    name: 'Sustainalytics ESG Risk',
    type: 'esg',
    criteria: {
      max_esg_risk: 25,
      min_governance_score: 60,
      exclude_severe_controversies: true
    },
    prohibited_sectors: ['tobacco', 'weapons', 'gambling', 'adult_entertainment']
  }
};

export const CHRISTIAN_METHODOLOGIES = {
  SRI: {
    name: 'Socially Responsible Investing',
    type: 'christian',
    criteria: {
      exclude_sin_stocks: true,
      min_community_impact_score: 6.0,
      support_human_dignity: true
    },
    prohibited_sectors: ['alcohol', 'tobacco', 'gambling', 'adult_entertainment', 'abortion_services'],
    preferred_sectors: ['healthcare', 'education', 'clean_energy', 'community_development']
  }
};

export const JEWISH_METHODOLOGIES = {
  ORTHODOX: {
    name: 'Orthodox Jewish Values',
    type: 'jewish',
    criteria: {
      kosher_food_only: true,
      sabbath_observant: true,
      exclude_mixed_textiles: true
    },
    prohibited_sectors: ['pork', 'shellfish', 'non_kosher_food', 'mixed_textiles', 'gambling'],
    preferred_sectors: ['kosher_food', 'technology', 'healthcare', 'education']
  }
};

export const SECTOR_CLASSIFICATIONS = {
  // Prohibited sectors mapping
  financial_services: ['Banks', 'Insurance', 'Financial Services', 'Credit Services'],
  alcohol: ['Alcoholic Beverages', 'Distillers & Vintners', 'Brewers'],
  tobacco: ['Tobacco', 'Cigarettes'],
  gambling: ['Casinos & Gaming', 'Gambling', 'Lottery'],
  adult_entertainment: ['Adult Entertainment'],
  defense: ['Defense', 'Aerospace & Defense', 'Weapons'],
  pork: ['Pork Processing', 'Pork Products'],
  // ... more mappings
};