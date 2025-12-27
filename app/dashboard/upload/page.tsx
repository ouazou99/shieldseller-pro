import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import CSVUploadForm from '@/components/dashboard/CSVUploadForm';
import { Upload, FileSpreadsheet, AlertCircle } from 'lucide-react';

export default async function UploadPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return null;
  }

  // Get user's shops
  const shops = await prisma.shop.findMany({
    where: { userId: session.user.id },
    select: {
      id: true,
      shopName: true,
      platform: true,
    },
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Upload Listings</h1>
        <p className="text-gray-600 mt-1">
          Import your product listings from CSV to start risk analysis
        </p>
      </div>

      {/* No Shops Warning */}
      {shops.length === 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="py-4">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
              <div>
                <p className="text-sm font-medium text-yellow-800">
                  No shops connected
                </p>
                <p className="text-xs text-yellow-700 mt-1">
                  Please <a href="/dashboard/shops" className="underline">add a shop</a> before uploading listings
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upload Form */}
      {shops.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Upload CSV File</CardTitle>
                <CardDescription>
                  Upload a CSV file containing your product listings. The file will be analyzed for violations.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CSVUploadForm shops={shops} />
              </CardContent>
            </Card>
          </div>

          {/* Instructions */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-base">
                  <FileSpreadsheet className="h-5 w-5 mr-2 text-brand-600" />
                  CSV Format
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-3">
                <p className="text-gray-700">Your CSV file should include these columns:</p>
                <ul className="space-y-2 text-gray-600">
                  <li>• <strong>product_id</strong> (required)</li>
                  <li>• <strong>title</strong> (required)</li>
                  <li>• <strong>description</strong> (required)</li>
                  <li>• <strong>category</strong> (optional)</li>
                  <li>• <strong>price</strong> (optional)</li>
                  <li>• <strong>image_url</strong> (optional)</li>
                  <li>• <strong>views</strong> (optional)</li>
                  <li>• <strong>orders</strong> (optional)</li>
                  <li>• <strong>return_rate</strong> (optional)</li>
                  <li>• <strong>rating</strong> (optional)</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-base">
                  <Upload className="h-5 w-5 mr-2 text-brand-600" />
                  What Happens Next
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2 text-gray-600">
                <p>1. File is validated and parsed</p>
                <p>2. Each listing is analyzed for violations</p>
                <p>3. Risk scores are calculated (0-100)</p>
                <p>4. Violations are detected and categorized</p>
                <p>5. You'll see results in the Listings page</p>
              </CardContent>
            </Card>

            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="py-4">
                <p className="text-sm text-blue-800">
                  <strong>Pro Tip:</strong> Export your listings from TikTok Seller Center, 
                  then upload here for instant analysis.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Sample CSV Download */}
      <Card>
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Need a sample CSV?</p>
              <p className="text-sm text-gray-600 mt-1">
                Download our template to see the correct format
              </p>
            </div>
            <a
              href="/sample-listings.csv"
              download
              className="inline-flex items-center px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition text-sm font-medium"
            >
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Download Sample
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
