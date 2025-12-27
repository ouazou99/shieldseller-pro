'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Shield, AlertTriangle, CheckCircle, TrendingUp, TrendingDown } from 'lucide-react';

interface RiskScoreCardsProps {
  totalListings: number;
  safeCount: number;
  lowRiskCount: number;
  mediumRiskCount: number;
  highRiskCount: number;
  criticalCount: number;
  avgRiskScore: number;
  trend?: {
    change: number; // percentage change
    direction: 'up' | 'down' | 'stable';
  };
}

export default function RiskScoreCards({
  totalListings,
  safeCount,
  lowRiskCount,
  mediumRiskCount,
  highRiskCount,
  criticalCount,
  avgRiskScore,
  trend,
}: RiskScoreCardsProps) {
  const dangerousCount = highRiskCount + criticalCount;
  const dangerousPercentage = totalListings > 0 
    ? Math.round((dangerousCount / totalListings) * 100) 
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Overall Risk Score */}
      <Card className="border-2 border-brand-200 bg-gradient-to-br from-brand-50 to-white">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
            <span>Average Risk Score</span>
            <Shield className="h-4 w-4 text-brand-600" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline space-x-2">
            <span className="text-4xl font-bold text-gray-900">
              {Math.round(avgRiskScore)}
            </span>
            <span className="text-2xl text-gray-500">/100</span>
          </div>
          
          {trend && (
            <div className="flex items-center mt-2 text-sm">
              {trend.direction === 'down' ? (
                <>
                  <TrendingDown className="h-4 w-4 text-green-600 mr-1" />
                  <span className="text-green-600 font-medium">
                    {trend.change}% lower
                  </span>
                </>
              ) : trend.direction === 'up' ? (
                <>
                  <TrendingUp className="h-4 w-4 text-red-600 mr-1" />
                  <span className="text-red-600 font-medium">
                    {trend.change}% higher
                  </span>
                </>
              ) : (
                <span className="text-gray-500">No change</span>
              )}
              <span className="text-gray-500 ml-1">vs last week</span>
            </div>
          )}
          
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">
                {getRiskLevelText(avgRiskScore)}
              </span>
              <span className={`font-semibold ${getRiskColor(avgRiskScore)}`}>
                {getRiskLabel(avgRiskScore)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Safe Listings */}
      <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-white">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
            <span>Safe Listings</span>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline space-x-2">
            <span className="text-4xl font-bold text-green-600">
              {safeCount + lowRiskCount}
            </span>
            <span className="text-2xl text-gray-500">
              /{totalListings}
            </span>
          </div>
          
          <div className="mt-2 text-sm text-gray-600">
            {totalListings > 0 
              ? `${Math.round(((safeCount + lowRiskCount) / totalListings) * 100)}%`
              : '0%'
            } of your products
          </div>
          
          <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-green-500 transition-all duration-500"
              style={{ 
                width: totalListings > 0 
                  ? `${((safeCount + lowRiskCount) / totalListings) * 100}%` 
                  : '0%' 
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* At Risk Listings */}
      <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-white">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
            <span>At Risk</span>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline space-x-2">
            <span className="text-4xl font-bold text-orange-600">
              {mediumRiskCount}
            </span>
            <span className="text-2xl text-gray-500">
              /{totalListings}
            </span>
          </div>
          
          <div className="mt-2 text-sm text-gray-600">
            Medium risk listings
          </div>
          
          <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-orange-500 transition-all duration-500"
              style={{ 
                width: totalListings > 0 
                  ? `${(mediumRiskCount / totalListings) * 100}%` 
                  : '0%' 
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Dangerous Listings */}
      <Card className="border-2 border-red-200 bg-gradient-to-br from-red-50 to-white">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
            <span>Dangerous</span>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline space-x-2">
            <span className="text-4xl font-bold text-red-600">
              {dangerousCount}
            </span>
            <span className="text-2xl text-gray-500">
              /{totalListings}
            </span>
          </div>
          
          <div className="mt-2 text-sm text-gray-600">
            High risk + Critical
          </div>
          
          <div className="mt-4">
            {dangerousCount > 0 ? (
              <div className="text-xs text-red-700 bg-red-100 px-2 py-1 rounded">
                ⚠️ {dangerousPercentage}% of your store needs attention
              </div>
            ) : (
              <div className="text-xs text-green-700 bg-green-100 px-2 py-1 rounded">
                ✓ All listings are safe!
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function getRiskLevelText(score: number): string {
  if (score < 30) return 'Your store is healthy';
  if (score < 50) return 'Minor issues detected';
  if (score < 70) return 'Action recommended';
  if (score < 85) return 'Urgent attention needed';
  return 'Critical violations';
}

function getRiskLabel(score: number): string {
  if (score < 30) return 'SAFE';
  if (score < 50) return 'LOW RISK';
  if (score < 70) return 'MEDIUM RISK';
  if (score < 85) return 'HIGH RISK';
  return 'CRITICAL';
}

function getRiskColor(score: number): string {
  if (score < 30) return 'text-green-600';
  if (score < 50) return 'text-yellow-600';
  if (score < 70) return 'text-orange-600';
  return 'text-red-600';
}
