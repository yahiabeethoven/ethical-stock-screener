import { 
  ETHICAL_SCREENING_TYPES, 
  ALL_METHODOLOGIES,
  SECTOR_CLASSIFICATIONS,
  getMethodologiesByType,
  getMethodologyByKey,
  isSectorProhibited,
  validateMethodology
} from '../utils/constants';

// Types for the screener
interface StockFinancials {
  cash_ratio?: number;
  debt_ratio?: number;
  receivables_ratio?: number;
  impermissible_income?: number;
  esg_score?: number;
  carbon_intensity?: number;
  board_diversity?: number;
  governance_score?: number;
  esg_risk?: number;
  total_assets?: number;
  market_cap?: number;
}

interface StockControversies {
  severity?: 'low' | 'medium' | 'high' | 'severe';
  categories?: string[];
  description?: string;
}

interface Stock {
  symbol: string;
  name: string;
  sector: string;
  financials: StockFinancials;
  controversies?: StockControversies;
  region?: string;
  exchange?: string;
}

interface SectorCheckResult {
  passed: boolean;
  details: {
    sector: string;
    isProhibited: boolean;
    isPreferred: boolean;
    prohibitedCategories: string[];
  };
}

interface QuantitativeCheckResult {
  passed: boolean;
  checks: Record<string, boolean>;
  failedCriteria: string[];
  details?: Record<string, any>;
}

interface QualitativeCheckResult {
  passed: boolean;
  details: {
    controversies: StockControversies | null;
    hasControversies: boolean;
    severityLevel?: string;
    failureReasons?: string[];
  };
}

interface ScreeningResult {
  isCompliant: boolean;
  sectorCheck: SectorCheckResult;
  quantitativeCheck: QuantitativeCheckResult;
  qualitativeCheck: QualitativeCheckResult;
  screeningType: string;
  methodology: string;
  complianceScore?: number;
  recommendations?: string[];
}

export class EthicalStockScreener {
  private screeningType: string;
  private methodology: any; // Using the Methodology interface from constants
  
  constructor(screeningType: string = 'islamic', methodologyKey: string = 'AAOIFI') {
    this.screeningType = screeningType;
    this.methodology = this.getMethodology(screeningType, methodologyKey);
    
    if (!this.methodology) {
      throw new Error(`Invalid methodology: ${methodologyKey} for screening type: ${screeningType}`);
    }
    
    if (!validateMethodology(this.methodology)) {
      throw new Error(`Invalid methodology configuration: ${methodologyKey}`);
    }
  }

  private getMethodology(screeningType: string, methodologyKey: string) {
    // First try to get the specific methodology
    const methodology = getMethodologyByKey(methodologyKey);
    
    if (methodology && methodology.type === screeningType) {
      return methodology;
    }
    
    // If not found or type mismatch, get methodologies for the screening type
    const methodologiesForType = getMethodologiesByType(screeningType);
    const availableKeys = Object.keys(methodologiesForType);
    
    if (availableKeys.length === 0) {
      throw new Error(`No methodologies available for screening type: ${screeningType}`);
    }
    
    // Return the first available methodology for the type, or default to AAOIFI
    return methodologiesForType[methodologyKey] || methodologiesForType[availableKeys[0]] || ALL_METHODOLOGIES.AAOIFI;
  }

  public screenStock(stock: Stock): ScreeningResult {
    const sectorCompliant = this.checkSectorCompliance(stock);
    const quantitativeCompliant = this.checkQuantitativeCompliance(stock);
    const qualitativeCompliant = this.checkQualitativeCompliance(stock);
    
    const isCompliant = sectorCompliant.passed && quantitativeCompliant.passed && qualitativeCompliant.passed;
    
    return {
      isCompliant,
      sectorCheck: sectorCompliant,
      quantitativeCheck: quantitativeCompliant,
      qualitativeCheck: qualitativeCompliant,
      screeningType: this.screeningType,
      methodology: this.methodology.name,
      complianceScore: this.calculateComplianceScore(sectorCompliant, quantitativeCompliant, qualitativeCompliant),
      recommendations: this.generateRecommendations(sectorCompliant, quantitativeCompliant, qualitativeCompliant)
    };
  }

  private checkSectorCompliance(stock: Stock): SectorCheckResult {
    const { prohibited_sectors = [], preferred_sectors = [] } = this.methodology;
    
    // Check if stock sector is prohibited
    const isProhibited = isSectorProhibited(stock.sector, prohibited_sectors);
    
    // Check if stock sector is preferred (if preferred sectors are defined)
    const isPreferred = preferred_sectors.length === 0 || preferred_sectors.some((preferredSector: string | number) =>
      SECTOR_CLASSIFICATIONS[preferredSector]?.includes(stock.sector)
    );
    
    // Find which prohibited categories this sector falls under
    const prohibitedCategories = prohibited_sectors.filter((ps: string | number) => 
      SECTOR_CLASSIFICATIONS[ps]?.includes(stock.sector)
    );
    
    return {
      passed: !isProhibited && isPreferred,
      details: {
        sector: stock.sector,
        isProhibited,
        isPreferred,
        prohibitedCategories
      }
    };
  }

  private checkQuantitativeCompliance(stock: Stock): QuantitativeCheckResult {
    const { criteria } = this.methodology;
    const { financials } = stock;
    const checks: Record<string, boolean> = {};
    const details: Record<string, any> = {};

    // Helper function to get the denominator based on methodology
    const getDenominator = () => {
      if (criteria.use_total_assets && financials.total_assets) {
        return financials.total_assets;
      }
      return financials.market_cap || financials.total_assets || 1;
    };

    // Islamic/Financial criteria
    if (criteria.cash_limit !== undefined) {
      const ratio = (financials.cash_ratio || 0) * 100;
      checks.cash = ratio <= criteria.cash_limit;
      details.cash = { ratio, limit: criteria.cash_limit, passed: checks.cash };
    }
    
    if (criteria.debt_limit !== undefined) {
      const ratio = (financials.debt_ratio || 0) * 100;
      checks.debt = ratio <= criteria.debt_limit;
      details.debt = { ratio, limit: criteria.debt_limit, passed: checks.debt };
    }
    
    if (criteria.receivables_limit !== undefined) {
      const ratio = (financials.receivables_ratio || 0) * 100;
      checks.receivables = ratio <= criteria.receivables_limit;
      details.receivables = { ratio, limit: criteria.receivables_limit, passed: checks.receivables };
    }
    
    if (criteria.impermissible_income_limit !== undefined) {
      const income = (financials.impermissible_income || 0) * 100;
      checks.income = income <= criteria.impermissible_income_limit;
      details.income = { value: income, limit: criteria.impermissible_income_limit, passed: checks.income };
    }

    // ESG criteria
    if (criteria.min_esg_score !== undefined) {
      const score = financials.esg_score || 0;
      checks.esg_score = score >= criteria.min_esg_score;
      details.esg_score = { score, minimum: criteria.min_esg_score, passed: checks.esg_score };
    }
    
    if (criteria.max_esg_risk !== undefined) {
      const risk = financials.esg_risk || 100; // Default to high risk if not available
      checks.esg_risk = risk <= criteria.max_esg_risk;
      details.esg_risk = { risk, maximum: criteria.max_esg_risk, passed: checks.esg_risk };
    }
    
    if (criteria.max_carbon_intensity !== undefined) {
      const intensity = financials.carbon_intensity || Infinity;
      checks.carbon = intensity <= criteria.max_carbon_intensity;
      details.carbon = { intensity, maximum: criteria.max_carbon_intensity, passed: checks.carbon };
    }
    
    if (criteria.min_board_diversity !== undefined) {
      const diversity = financials.board_diversity || 0;
      checks.diversity = diversity >= criteria.min_board_diversity;
      details.diversity = { diversity, minimum: criteria.min_board_diversity, passed: checks.diversity };
    }
    
    if (criteria.min_governance_score !== undefined) {
      const score = financials.governance_score || 0;
      checks.governance = score >= criteria.min_governance_score;
      details.governance = { score, minimum: criteria.min_governance_score, passed: checks.governance };
    }

    // Faith-based criteria (these would need additional data in stock object)
    if (criteria.exclude_sin_stocks !== undefined) {
      // This would require additional logic to identify sin stocks
      checks.sin_stocks = true; // Placeholder - implement based on sector/business model
    }

    return {
      passed: Object.values(checks).every(check => check),
      checks,
      failedCriteria: Object.entries(checks)
        .filter(([_, passed]) => !passed)
        .map(([criteria]) => criteria),
      details
    };
  }

  private checkQualitativeCompliance(stock: Stock): QualitativeCheckResult {
    const { criteria } = this.methodology;
    const failureReasons: string[] = [];
    let passed = true;

    // Check controversies
    if (stock.controversies) {
      const { severity } = stock.controversies;
      
      // Check for severe controversies exclusion
      if (criteria.exclude_severe_controversies && severity === 'severe') {
        passed = false;
        failureReasons.push('Severe controversies detected');
      }
      
      // Check for any controversies exclusion
      if (criteria.exclude_controversies && severity && ['medium', 'high', 'severe'].includes(severity)) {
        passed = false;
        failureReasons.push('Controversies detected');
      }
    }

    // Additional qualitative checks can be added here
    // For example: management quality, business model assessment, etc.

    return {
      passed,
      details: {
        controversies: stock.controversies || null,
        hasControversies: !!stock.controversies,
        severityLevel: stock.controversies?.severity,
        failureReasons: failureReasons.length > 0 ? failureReasons : undefined
      }
    };
  }

  private calculateComplianceScore(
    sector: SectorCheckResult, 
    quantitative: QuantitativeCheckResult, 
    qualitative: QualitativeCheckResult
  ): number {
    let score = 0;
    let maxScore = 3; // Three main categories

    if (sector.passed) score += 1;
    if (quantitative.passed) score += 1;
    if (qualitative.passed) score += 1;

    return Math.round((score / maxScore) * 100);
  }

  private generateRecommendations(
    sector: SectorCheckResult,
    quantitative: QuantitativeCheckResult,
    qualitative: QualitativeCheckResult
  ): string[] {
    const recommendations: string[] = [];

    if (!sector.passed) {
      if (sector.details.isProhibited) {
        recommendations.push(`Consider excluding due to prohibited sector: ${sector.details.sector}`);
      }
      if (!sector.details.isPreferred) {
        recommendations.push(`Consider focusing on preferred sectors for better alignment`);
      }
    }

    if (!quantitative.passed) {
      quantitative.failedCriteria.forEach(criteria => {
        const detail = quantitative.details?.[criteria];
        if (detail) {
          recommendations.push(`${criteria} ratio needs improvement: ${detail.ratio || detail.value}% (limit: ${detail.limit || detail.maximum || detail.minimum}%)`);
        }
      });
    }

    if (!qualitative.passed && qualitative.details.failureReasons) {
      qualitative.details.failureReasons.forEach(reason => {
        recommendations.push(`Address qualitative concern: ${reason}`);
      });
    }

    return recommendations;
  }

  // Utility methods
  public getMethodologyInfo() {
    return {
      name: this.methodology.name,
      type: this.methodology.type,
      description: this.methodology.description,
      authority: this.methodology.authority,
      region: this.methodology.region,
      lastUpdated: this.methodology.last_updated
    };
  }

  public getCriteriaInfo() {
    return this.methodology.criteria;
  }

  public getProhibitedSectors(): string[] {
    return this.methodology.prohibited_sectors || [];
  }

  public getPreferredSectors(): string[] {
    return this.methodology.preferred_sectors || [];
  }

  // Static methods
  static getAvailableMethodologies(screeningType?: string): Record<string, any> {
    if (screeningType) {
      return getMethodologiesByType(screeningType);
    }
    return ALL_METHODOLOGIES;
  }

  static getScreeningTypes(): Record<string, any> {
    return ETHICAL_SCREENING_TYPES;
  }

  static getAvailableScreeningTypes(): string[] {
    return Object.keys(ETHICAL_SCREENING_TYPES);
  }

  static getSectorClassifications(): Record<string, string[]> {
    return SECTOR_CLASSIFICATIONS;
  }

  static validateStock(stock: any): stock is Stock {
    return !!(
      stock &&
      typeof stock.symbol === 'string' &&
      typeof stock.name === 'string' &&
      typeof stock.sector === 'string' &&
      stock.financials &&
      typeof stock.financials === 'object'
    );
  }
}