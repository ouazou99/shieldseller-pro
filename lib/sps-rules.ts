/**
 * ShieldSeller Risk Engine
 * 
 * This is the CORE of ShieldSeller - the brain that detects violations
 * and calculates risk scores for TikTok Shop listings.
 * 
 * Risk Score Formula: 0-100 (higher = more dangerous)
 * - 0-30: Safe (green)
 * - 31-60: Warning (yellow)
 * - 61-85: High Risk (orange)
 * - 86-100: Critical (red)
 */

export interface ListingData {
  productId: string;
  title: string;
  description: string;
  category?: string;
  price?: number;
  imageUrl?: string;
  
  // Performance metrics
  views?: number;
  orders?: number;
  returnRate?: number;
  rating?: number;
  reviewCount?: number;
  
  // Shipping
  shippingDays?: number;
  lateShipmentRate?: number;
}

export interface Violation {
  type: string;
  severity: 'info' | 'warning' | 'critical';
  title: string;
  description: string;
  suggestion?: string;
}

export interface RiskAnalysis {
  riskScore: number;
  riskLevel: 'safe' | 'low' | 'medium' | 'high' | 'critical';
  violations: Violation[];
  factors: {
    contentRisk: number;
    performanceRisk: number;
    complianceRisk: number;
  };
}

// ============================================================================
// FORBIDDEN KEYWORDS & PATTERNS
// ============================================================================

const FORBIDDEN_KEYWORDS = [
  // Health claims
  'cure', 'treat', 'diagnose', 'heal', 'medical grade',
  'fda approved', 'clinically proven', 'doctor recommended',
  
  // Misleading terms
  'guaranteed', 'risk-free', '100% effective', 'miracle',
  'instant results', 'overnight', 'revolutionary',
  
  // Prohibited items
  'weapon', 'drug', 'prescription', 'tobacco', 'vape',
  'alcohol', 'counterfeit', 'replica', 'fake',
  
  // IP violations
  'authentic', 'original', 'genuine' + ' brand name', 'official',
  
  // Dangerous products
  'flammable', 'toxic', 'hazardous', 'explosive',
];

const HIGH_RISK_PATTERNS = [
  /\b(lose|lost)\s+\d+\s*(lbs?|pounds|kg)\b/i, // Weight loss claims
  /\b(money|income|profit)\s+guarantee/i,
  /\b(100%|totally|completely)\s+(safe|natural|organic)\b/i,
  /\b(before|after)\s+(photo|picture|result)/i,
  /\bget\s+rich\b/i,
  /\b(unlimited|instant)\s+(money|cash|income)/i,
];

const SUSPICIOUS_CATEGORIES = [
  'health', 'supplements', 'medicine', 'beauty treatments',
  'weight loss', 'muscle building', 'gambling', 'cryptocurrency',
];

// ============================================================================
// RISK CALCULATION FUNCTIONS
// ============================================================================

/**
 * Analyze content for forbidden keywords and patterns
 */
function analyzeContentRisk(listing: ListingData): { score: number; violations: Violation[] } {
  const violations: Violation[] = [];
  let riskScore = 0;
  
  const fullText = `${listing.title} ${listing.description}`.toLowerCase();
  
  // Check forbidden keywords
  FORBIDDEN_KEYWORDS.forEach(keyword => {
    if (fullText.includes(keyword.toLowerCase())) {
      riskScore += 15;
      violations.push({
        type: 'keyword',
        severity: 'critical',
        title: `Forbidden keyword detected: "${keyword}"`,
        description: `Your listing contains "${keyword}" which violates TikTok Shop policies. This can lead to immediate suspension.`,
        suggestion: `Remove "${keyword}" and rephrase using compliant language. Avoid making absolute claims.`,
      });
    }
  });
  
  // Check high-risk patterns
  HIGH_RISK_PATTERNS.forEach(pattern => {
    if (pattern.test(fullText)) {
      riskScore += 10;
      violations.push({
        type: 'pattern',
        severity: 'warning',
        title: 'Suspicious claim detected',
        description: 'Your listing contains language that may be flagged as misleading or making unverified claims.',
        suggestion: 'Rewrite this section using factual, measurable descriptions without guarantees.',
      });
    }
  });
  
  // Check title length (TikTok prefers 20-60 chars)
  if (listing.title.length < 20) {
    riskScore += 5;
    violations.push({
      type: 'title_length',
      severity: 'info',
      title: 'Title too short',
      description: 'Titles under 20 characters may perform poorly and look spammy.',
      suggestion: 'Expand your title to 20-60 characters with descriptive keywords.',
    });
  }
  
  if (listing.title.length > 100) {
    riskScore += 5;
    violations.push({
      type: 'title_length',
      severity: 'info',
      title: 'Title too long',
      description: 'Very long titles may be truncated and look unprofessional.',
      suggestion: 'Shorten your title to 60-80 characters focusing on key features.',
    });
  }
  
  // Check for excessive capitalization
  const capsRatio = (listing.title.match(/[A-Z]/g) || []).length / listing.title.length;
  if (capsRatio > 0.5) {
    riskScore += 8;
    violations.push({
      type: 'caps',
      severity: 'warning',
      title: 'Excessive capitalization',
      description: 'Too many capital letters can be flagged as spammy or shouting.',
      suggestion: 'Use normal sentence case with capitals only for proper nouns.',
    });
  }
  
  // Check for excessive exclamation marks
  const exclamationCount = (fullText.match(/!/g) || []).length;
  if (exclamationCount > 3) {
    riskScore += 5;
    violations.push({
      type: 'punctuation',
      severity: 'info',
      title: 'Too many exclamation marks',
      description: 'Excessive exclamation marks look unprofessional and may trigger spam filters.',
      suggestion: 'Limit exclamation marks to 1-2 per listing.',
    });
  }
  
  // Check category alignment
  if (listing.category && SUSPICIOUS_CATEGORIES.some(cat => 
    listing.category?.toLowerCase().includes(cat.toLowerCase())
  )) {
    riskScore += 12;
    violations.push({
      type: 'category',
      severity: 'warning',
      title: 'High-risk category detected',
      description: 'This product category is heavily regulated and frequently flagged for violations.',
      suggestion: 'Ensure all claims are factual, avoid health/medical language, and include required warnings.',
    });
  }
  
  return { score: Math.min(riskScore, 60), violations };
}

/**
 * Analyze performance metrics for risk
 */
function analyzePerformanceRisk(listing: ListingData): { score: number; violations: Violation[] } {
  const violations: Violation[] = [];
  let riskScore = 0;
  
  // High return rate (>15% is concerning)
  if (listing.returnRate && listing.returnRate > 0.15) {
    const returnPercent = (listing.returnRate * 100).toFixed(1);
    riskScore += 20;
    violations.push({
      type: 'return_rate',
      severity: 'critical',
      title: `High return rate: ${returnPercent}%`,
      description: 'Return rates above 15% signal product quality issues or misleading descriptions.',
      suggestion: 'Review product quality, improve descriptions, and consider removing this listing if returns continue.',
    });
  } else if (listing.returnRate && listing.returnRate > 0.08) {
    const returnPercent = (listing.returnRate * 100).toFixed(1);
    riskScore += 10;
    violations.push({
      type: 'return_rate',
      severity: 'warning',
      title: `Elevated return rate: ${returnPercent}%`,
      description: 'Return rate is higher than average. Monitor closely.',
      suggestion: 'Check product descriptions match actual product. Consider adding more photos.',
    });
  }
  
  // Low rating (<4.0 is bad)
  if (listing.rating && listing.reviewCount && listing.reviewCount > 10) {
    if (listing.rating < 3.5) {
      riskScore += 25;
      violations.push({
        type: 'rating',
        severity: 'critical',
        title: `Low rating: ${listing.rating.toFixed(1)}/5.0`,
        description: 'Ratings below 3.5 can trigger account reviews and hurt visibility.',
        suggestion: 'Address customer complaints, improve product quality, or consider removing this listing.',
      });
    } else if (listing.rating < 4.0) {
      riskScore += 12;
      violations.push({
        type: 'rating',
        severity: 'warning',
        title: `Below average rating: ${listing.rating.toFixed(1)}/5.0`,
        description: 'Ratings below 4.0 may affect account health over time.',
        suggestion: 'Monitor reviews, respond to complaints, and work to improve customer satisfaction.',
      });
    }
  }
  
  // Late shipment rate
  if (listing.lateShipmentRate && listing.lateShipmentRate > 0.10) {
    riskScore += 15;
    violations.push({
      type: 'shipping',
      severity: 'critical',
      title: `High late shipment rate: ${(listing.lateShipmentRate * 100).toFixed(1)}%`,
      description: 'Late shipments above 10% violate TikTok Shop performance standards.',
      suggestion: 'Improve fulfillment speed, adjust handling time, or use faster shipping methods.',
    });
  }
  
  // Slow shipping
  if (listing.shippingDays && listing.shippingDays > 7) {
    riskScore += 8;
    violations.push({
      type: 'shipping_time',
      severity: 'warning',
      title: `Slow shipping: ${listing.shippingDays} days`,
      description: 'Shipping times over 7 days can lead to customer complaints and cancellations.',
      suggestion: 'Consider using faster shipping methods or partnering with fulfillment services.',
    });
  }
  
  return { score: Math.min(riskScore, 40), violations };
}

/**
 * Check compliance with platform policies
 */
function analyzeComplianceRisk(listing: ListingData): { score: number; violations: Violation[] } {
  const violations: Violation[] = [];
  let riskScore = 0;
  
  // Missing description
  if (!listing.description || listing.description.length < 50) {
    riskScore += 10;
    violations.push({
      type: 'missing_info',
      severity: 'warning',
      title: 'Description too short',
      description: 'Detailed descriptions improve conversions and reduce violations.',
      suggestion: 'Add at least 200 characters describing features, materials, dimensions, and use cases.',
    });
  }
  
  // Price checks
  if (listing.price) {
    if (listing.price < 1) {
      riskScore += 15;
      violations.push({
        type: 'price',
        severity: 'critical',
        title: 'Suspiciously low price',
        description: 'Prices under $1 may be flagged as scams or test listings.',
        suggestion: 'Set a realistic price that covers costs and appears legitimate.',
      });
    }
    
    if (listing.price > 10000) {
      riskScore += 8;
      violations.push({
        type: 'price',
        severity: 'warning',
        title: 'Very high price',
        description: 'Extremely high prices may require additional verification.',
        suggestion: 'Ensure pricing is accurate. High-value items may need extra documentation.',
      });
    }
  }
  
  // Missing image
  if (!listing.imageUrl) {
    riskScore += 12;
    violations.push({
      type: 'missing_image',
      severity: 'warning',
      title: 'Missing product image',
      description: 'Listings without images perform poorly and may be flagged as incomplete.',
      suggestion: 'Add at least 3-5 high-quality product images.',
    });
  }
  
  return { score: Math.min(riskScore, 30), violations };
}

// ============================================================================
// MAIN RISK ANALYSIS FUNCTION
// ============================================================================

/**
 * Perform complete risk analysis on a listing
 */
export function analyzeListingRisk(listing: ListingData): RiskAnalysis {
  // Analyze each risk category
  const contentAnalysis = analyzeContentRisk(listing);
  const performanceAnalysis = analyzePerformanceRisk(listing);
  const complianceAnalysis = analyzeComplianceRisk(listing);
  
  // Combine scores (weighted)
  const totalRiskScore = Math.min(
    contentAnalysis.score * 1.2 +     // Content is most important
    performanceAnalysis.score * 1.0 +  // Performance matters
    complianceAnalysis.score * 0.8,    // Compliance is baseline
    100
  );
  
  // Determine risk level
  let riskLevel: RiskAnalysis['riskLevel'];
  if (totalRiskScore < 30) riskLevel = 'safe';
  else if (totalRiskScore < 50) riskLevel = 'low';
  else if (totalRiskScore < 70) riskLevel = 'medium';
  else if (totalRiskScore < 85) riskLevel = 'high';
  else riskLevel = 'critical';
  
  // Combine all violations
  const allViolations = [
    ...contentAnalysis.violations,
    ...performanceAnalysis.violations,
    ...complianceAnalysis.violations,
  ];
  
  return {
    riskScore: Math.round(totalRiskScore),
    riskLevel,
    violations: allViolations,
    factors: {
      contentRisk: Math.round(contentAnalysis.score),
      performanceRisk: Math.round(performanceAnalysis.score),
      complianceRisk: Math.round(complianceAnalysis.score),
    },
  };
}

/**
 * Generate AI-powered fix suggestions for a listing
 */
export function generateFixSuggestions(analysis: RiskAnalysis, listing: ListingData): string {
  if (analysis.violations.length === 0) {
    return 'Your listing looks great! No immediate fixes needed.';
  }
  
  let suggestions = '📋 Recommended Fixes:\n\n';
  
  // Group by severity
  const critical = analysis.violations.filter(v => v.severity === 'critical');
  const warnings = analysis.violations.filter(v => v.severity === 'warning');
  const info = analysis.violations.filter(v => v.severity === 'info');
  
  if (critical.length > 0) {
    suggestions += '🚨 CRITICAL (Fix Immediately):\n';
    critical.forEach((v, i) => {
      suggestions += `${i + 1}. ${v.title}\n   → ${v.suggestion}\n\n`;
    });
  }
  
  if (warnings.length > 0) {
    suggestions += '⚠️  WARNINGS (Fix Soon):\n';
    warnings.forEach((v, i) => {
      suggestions += `${i + 1}. ${v.title}\n   → ${v.suggestion}\n\n`;
    });
  }
  
  if (info.length > 0) {
    suggestions += 'ℹ️  IMPROVEMENTS (Optimize):\n';
    info.forEach((v, i) => {
      suggestions += `${i + 1}. ${v.title}\n   → ${v.suggestion}\n\n`;
    });
  }
  
  return suggestions;
}

/**
 * Calculate shop-level risk score from all listings
 */
export function calculateShopRisk(listings: RiskAnalysis[]): number {
  if (listings.length === 0) return 0;
  
  // Weight recent high-risk items more heavily
  const weights = listings.map((analysis, index) => {
    let weight = 1;
    
    // High/critical listings get more weight
    if (analysis.riskLevel === 'critical') weight = 3;
    else if (analysis.riskLevel === 'high') weight = 2;
    
    return weight;
  });
  
  const weightedSum = listings.reduce((sum, analysis, index) => 
    sum + (analysis.riskScore * weights[index]), 0
  );
  
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  
  return Math.round(weightedSum / totalWeight);
}
