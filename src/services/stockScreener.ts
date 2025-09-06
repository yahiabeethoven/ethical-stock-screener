import { 
  ETHICAL_SCREENING_TYPES, 
  ISLAMIC_METHODOLOGIES, 
  ESG_METHODOLOGIES,
  CHRISTIAN_METHODOLOGIES,
  JEWISH_METHODOLOGIES,
  SECTOR_CLASSIFICATIONS 
} from '../utils/constants';

export class EthicalStockScreener {
  constructor(screeningType = 'islamic', methodology = 'AAOIFI') {
    this.screeningType = screeningType;
    this.methodology = this.getMethodology(screeningType, methodology);
  }

  getMethodology(screeningType, methodologyKey) {
    const methodologyMaps = {
      islamic: ISLAMIC_METHODOLOGIES,
      esg: ESG_METHODOLOGIES,
      christian: CHRISTIAN_METHODOLOGIES,
      jewish: JEWISH_METHODOLOGIES
    };

    return methodologyMaps[screeningType]?.[methodologyKey] || ISLAMIC_METHODOLOGIES.AAOIFI;
  }

  screenStock(stock) {
    const sectorCompliant = this.checkSectorCompliance(stock);
    const quantitativeCompliant = this.checkQuantitativeCompliance(stock);
    const qualitativeCompliant = this.checkQualitativeCompliance(stock);
    
    return {
      isCompliant: sectorCompliant.passed && quantitativeCompliant.passed && qualitativeCompliant.passed,
      sectorCheck: sectorCompliant,
      quantitativeCheck: quantitativeCompliant,
      qualitativeCheck: qualitativeCompliant,
      screeningType: this.screeningType,
      methodology: this.methodology.name
    };
  }

  checkSectorCompliance(stock) {
    const { prohibited_sectors = [], preferred_sectors = [] } = this.methodology;
    
    const isProhibited = prohibited_sectors.some(prohibitedSector => 
      SECTOR_CLASSIFICATIONS[prohibitedSector]?.includes(stock.sector)
    );
    
    const isPreferred = preferred_sectors.length === 0 || preferred_sectors.some(preferredSector =>
      SECTOR_CLASSIFICATIONS[preferredSector]?.includes(stock.sector)
    );
    
    return {
      passed: !isProhibited && isPreferred,
      details: {
        sector: stock.sector,
        isProhibited,
        isPreferred,
        prohibitedCategories: prohibited_sectors.filter(ps => 
          SECTOR_CLASSIFICATIONS[ps]?.includes(stock.sector)
        )
      }
    };
  }

  checkQuantitativeCompliance(stock) {
    const { criteria } = this.methodology;
    const { financials } = stock;

    let checks = {};

    // Islamic/Financial criteria
    if (criteria.cash_limit !== undefined) {
      checks.cash = financials.cash_ratio <= criteria.cash_limit;
    }
    if (criteria.debt_limit !== undefined) {
      checks.debt = financials.debt_ratio <= criteria.debt_limit;
    }
    if (criteria.receivables_limit !== undefined) {
      checks.receivables = financials.receivables_ratio <= criteria.receivables_limit;
    }
    if (criteria.impermissible_income_limit !== undefined) {
      checks.income = financials.impermissible_income <= criteria.impermissible_income_limit;
    }

    // ESG criteria
    if (criteria.min_esg_score !== undefined) {
      checks.esg_score = (financials.esg_score || 0) >= criteria.min_esg_score;
    }
    if (criteria.max_carbon_intensity !== undefined) {
      checks.carbon = (financials.carbon_intensity || Infinity) <= criteria.max_carbon_intensity;
    }
    if (criteria.min_board_diversity !== undefined) {
      checks.diversity = (financials.board_diversity || 0) >= criteria.min_board_diversity;
    }

    // Other ethical criteria can be added here

    return {
      passed: Object.values(checks).every(check => check),
      checks,
      failedCriteria: Object.entries(checks)
        .filter(([_, passed]) => !passed)
        .map(([criteria]) => criteria)
    };
  }

  checkQualitativeCompliance(stock) {
    // This can be expanded for qualitative assessments
    // For now, just check if there are any severe controversies
    const hasControversies = stock.controversies && stock.controversies.severity === 'severe';
    
    return {
      passed: !hasControversies,
      details: {
        controversies: stock.controversies || null,
        hasControversies
      }
    };
  }

  // Static method to get available methodologies for a screening type
  static getAvailableMethodologies(screeningType) {
    const methodologyMaps = {
      islamic: ISLAMIC_METHODOLOGIES,
      esg: ESG_METHODOLOGIES,
      christian: CHRISTIAN_METHODOLOGIES,
      jewish: JEWISH_METHODOLOGIES
    };

    return methodologyMaps[screeningType] || {};
  }

  // Static method to get all screening types
  static getScreeningTypes() {
    return ETHICAL_SCREENING_TYPES;
  }
}
