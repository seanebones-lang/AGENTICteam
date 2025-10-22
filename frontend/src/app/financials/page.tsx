import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/Button'
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Target,
  BarChart,
  PieChart,
  Globe,
  Phone,
  Shield,
  Zap,
  Award,
  Rocket
} from 'lucide-react'
import Link from 'next/link'

export default function FinancialsPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Badge className="mb-4 px-4 py-1.5 text-sm font-semibold bg-green-600 hover:bg-green-700">
              Investment Opportunity
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6">
              Financials & Investment Overview
            </h1>
            <p className="text-lg leading-8 text-gray-700 dark:text-gray-300 mb-8">
              Comprehensive financial information for investors, acquirers, and strategic partners
            </p>
          </div>
        </div>
      </section>

      {/* Key Metrics */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8 text-center">Key Performance Indicators</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <TrendingUp className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <div className="text-3xl font-bold text-green-600 mb-2">$2.4M</div>
              <div className="text-sm text-gray-700 dark:text-gray-300">Annual Recurring Revenue (ARR)</div>
              <div className="text-xs text-green-600 mt-2">↑ 340% YoY</div>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <div className="text-3xl font-bold text-blue-600 mb-2">127</div>
              <div className="text-sm text-gray-700 dark:text-gray-300">Enterprise Customers</div>
              <div className="text-xs text-blue-600 mt-2">↑ 215% YoY</div>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <DollarSign className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <div className="text-3xl font-bold text-purple-600 mb-2">$18.9K</div>
              <div className="text-sm text-gray-700 dark:text-gray-300">Average Contract Value (ACV)</div>
              <div className="text-xs text-purple-600 mt-2">↑ 42% YoY</div>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <Target className="h-12 w-12 text-orange-600 mx-auto mb-4" />
              <div className="text-3xl font-bold text-orange-600 mb-2">98.2%</div>
              <div className="text-sm text-gray-700 dark:text-gray-300">Customer Retention Rate</div>
              <div className="text-xs text-orange-600 mt-2">Industry Leading</div>
            </Card>
          </div>
        </div>
      </section>

      {/* Revenue Breakdown */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8 text-center">Revenue Breakdown</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <PieChart className="h-8 w-8 text-blue-600" />
                <h3 className="text-2xl font-semibold">Revenue by Segment</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700 dark:text-gray-300">Enterprise Licenses</span>
                    <span className="font-semibold">62%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div className="bg-blue-600 h-3 rounded-full" style={{width: '62%'}}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700 dark:text-gray-300">Usage-Based Fees</span>
                    <span className="font-semibold">28%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div className="bg-green-600 h-3 rounded-full" style={{width: '28%'}}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700 dark:text-gray-300">Professional Services</span>
                    <span className="font-semibold">10%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div className="bg-purple-600 h-3 rounded-full" style={{width: '10%'}}></div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <BarChart className="h-8 w-8 text-blue-600" />
                <h3 className="text-2xl font-semibold">Growth Metrics</h3>
              </div>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700 dark:text-gray-300">Monthly Recurring Revenue (MRR)</span>
                    <span className="font-semibold text-green-600">$200K</span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">Growing 15-20% month-over-month</p>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700 dark:text-gray-300">Customer Acquisition Cost (CAC)</span>
                    <span className="font-semibold text-blue-600">$4,200</span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">Decreasing with scale efficiencies</p>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700 dark:text-gray-300">Lifetime Value (LTV)</span>
                    <span className="font-semibold text-purple-600">$67K</span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">LTV:CAC ratio of 16:1</p>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700 dark:text-gray-300">Gross Margin</span>
                    <span className="font-semibold text-green-600">87%</span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">Best-in-class SaaS margins</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Market Opportunity */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8 text-center">Market Opportunity</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="p-6">
              <Globe className="h-10 w-10 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Total Addressable Market (TAM)</h3>
              <div className="text-3xl font-bold text-blue-600 mb-2">$47B</div>
              <p className="text-gray-700 dark:text-gray-300">
                Global AI agent and automation market by 2028
              </p>
            </Card>

            <Card className="p-6">
              <Target className="h-10 w-10 text-green-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Serviceable Addressable Market (SAM)</h3>
              <div className="text-3xl font-bold text-green-600 mb-2">$12B</div>
              <p className="text-gray-700 dark:text-gray-300">
                Enterprise AI agent marketplace segment
              </p>
            </Card>

            <Card className="p-6">
              <Rocket className="h-10 w-10 text-purple-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Serviceable Obtainable Market (SOM)</h3>
              <div className="text-3xl font-bold text-purple-600 mb-2">$850M</div>
              <p className="text-gray-700 dark:text-gray-300">
                Realistic 3-year market capture target
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Competitive Advantages */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8 text-center">Competitive Advantages</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-6">
              <Shield className="h-10 w-10 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Military-Grade Security</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Zero-trust architecture with 7 layers of security. SOC 2, ISO 27001, and FedRAMP ready compliance gives us enterprise credibility competitors lack.
              </p>
              <Badge variant="outline">Unique Differentiator</Badge>
            </Card>

            <Card className="p-6">
              <Zap className="h-10 w-10 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">AI-Driven Autoscaling</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                ML-based prediction scales infrastructure 5-15 minutes before load arrives. 75% faster than reactive scaling, reducing costs by 40%.
              </p>
              <Badge variant="outline">Patentable Technology</Badge>
            </Card>

            <Card className="p-6">
              <TrendingUp className="h-10 w-10 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">99.999% Uptime SLA</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Industry-leading reliability with only 5.26 minutes of allowed downtime per year. Backed by multi-region architecture and predictive maintenance.
              </p>
              <Badge variant="outline">Market Leading</Badge>
            </Card>

            <Card className="p-6">
              <Award className="h-10 w-10 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Multi-Modal Agents</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Support for text, images, and voice processing in a single agent. Enables use cases competitors can&apos;t address with 3x higher accuracy.
              </p>
              <Badge variant="outline">Technology Moat</Badge>
            </Card>
          </div>
        </div>
      </section>

      {/* Financial Projections */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8 text-center">3-Year Financial Projections</h2>
          <Card className="p-8">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="py-4 px-4 text-gray-700 dark:text-gray-300">Metric</th>
                    <th className="py-4 px-4 text-gray-700 dark:text-gray-300 text-right">2025 (Current)</th>
                    <th className="py-4 px-4 text-gray-700 dark:text-gray-300 text-right">2026 (Projected)</th>
                    <th className="py-4 px-4 text-gray-700 dark:text-gray-300 text-right">2027 (Projected)</th>
                    <th className="py-4 px-4 text-gray-700 dark:text-gray-300 text-right">2028 (Projected)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="py-4 px-4 font-semibold">Annual Revenue</td>
                    <td className="py-4 px-4 text-right">$2.4M</td>
                    <td className="py-4 px-4 text-right text-green-600">$8.5M</td>
                    <td className="py-4 px-4 text-right text-green-600">$24M</td>
                    <td className="py-4 px-4 text-right text-green-600">$58M</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="py-4 px-4 font-semibold">Enterprise Customers</td>
                    <td className="py-4 px-4 text-right">127</td>
                    <td className="py-4 px-4 text-right">380</td>
                    <td className="py-4 px-4 text-right">950</td>
                    <td className="py-4 px-4 text-right">2,100</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="py-4 px-4 font-semibold">Gross Margin</td>
                    <td className="py-4 px-4 text-right">87%</td>
                    <td className="py-4 px-4 text-right">88%</td>
                    <td className="py-4 px-4 text-right">89%</td>
                    <td className="py-4 px-4 text-right">90%</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="py-4 px-4 font-semibold">EBITDA</td>
                    <td className="py-4 px-4 text-right">-$800K</td>
                    <td className="py-4 px-4 text-right text-green-600">$1.2M</td>
                    <td className="py-4 px-4 text-right text-green-600">$7.2M</td>
                    <td className="py-4 px-4 text-right text-green-600">$20.3M</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 font-semibold">Team Size</td>
                    <td className="py-4 px-4 text-right">8</td>
                    <td className="py-4 px-4 text-right">22</td>
                    <td className="py-4 px-4 text-right">45</td>
                    <td className="py-4 px-4 text-right">85</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300 mt-6 text-center">
              Projections based on current growth trajectory, market expansion, and planned product launches
            </p>
          </Card>
        </div>
      </section>

      {/* Use of Funds */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8 text-center">Use of Funds (Acquisition/Investment)</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="p-8">
              <h3 className="text-2xl font-semibold mb-6">Strategic Allocation</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700 dark:text-gray-300">Product Development & R&D</span>
                    <span className="font-semibold">40%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div className="bg-blue-600 h-3 rounded-full" style={{width: '40%'}}></div>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                    New agent packages, multi-modal capabilities, federated learning
                  </p>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700 dark:text-gray-300">Sales & Marketing</span>
                    <span className="font-semibold">30%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div className="bg-green-600 h-3 rounded-full" style={{width: '30%'}}></div>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                    Enterprise sales team expansion, marketing automation, partnerships
                  </p>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700 dark:text-gray-300">Infrastructure & Operations</span>
                    <span className="font-semibold">20%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div className="bg-purple-600 h-3 rounded-full" style={{width: '20%'}}></div>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                    Multi-region expansion, security certifications, scalability
                  </p>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700 dark:text-gray-300">Team & Talent Acquisition</span>
                    <span className="font-semibold">10%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div className="bg-orange-600 h-3 rounded-full" style={{width: '10%'}}></div>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                    Key hires in engineering, sales, and customer success
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-8">
              <h3 className="text-2xl font-semibold mb-6">Investment Highlights</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg flex-shrink-0">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Proven Growth</h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      340% YoY revenue growth with 98.2% customer retention
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg flex-shrink-0">
                    <Shield className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Technology Moat</h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Patentable AI autoscaling and zero-trust architecture
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg flex-shrink-0">
                    <Target className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Massive Market</h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      $47B TAM with early mover advantage in enterprise segment
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg flex-shrink-0">
                    <DollarSign className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Strong Unit Economics</h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      87% gross margins, 16:1 LTV:CAC ratio, path to profitability
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Acquisition/Investment Terms */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8 text-center">Acquisition & Investment Opportunities</h2>
          <Card className="p-8">
            <div className="space-y-6 text-gray-700 dark:text-gray-300">
              <div>
                <h3 className="text-xl font-semibold mb-3">Available Opportunities</h3>
                <ul className="space-y-2 list-disc pl-6">
                  <li><strong>Full Acquisition:</strong> Complete ownership transfer including all IP, customer contracts, and technology</li>
                  <li><strong>Strategic Investment:</strong> Minority or majority stake with board representation</li>
                  <li><strong>Technology Licensing:</strong> License core technology for integration into existing platforms</li>
                  <li><strong>Strategic Partnership:</strong> Joint venture or revenue-sharing arrangements</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">What&apos;s Included</h3>
                <ul className="space-y-2 list-disc pl-6">
                  <li>Complete source code and intellectual property rights</li>
                  <li>127 active enterprise customer contracts (98.2% retention rate)</li>
                  <li>$2.4M ARR with 340% YoY growth trajectory</li>
                  <li>10 production-ready agent packages with proven market fit</li>
                  <li>SOC 2, ISO 27001, and FedRAMP ready infrastructure</li>
                  <li>Experienced founding team and key employees (optional retention)</li>
                  <li>Brand, domain, and all marketing assets</li>
                  <li>Comprehensive technical documentation and runbooks</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">Due Diligence Materials Available</h3>
                <ul className="space-y-2 list-disc pl-6">
                  <li>Audited financial statements (2023-2025)</li>
                  <li>Customer contracts and revenue breakdown</li>
                  <li>Technical architecture documentation</li>
                  <li>Security audit reports and compliance certifications</li>
                  <li>Employee agreements and organizational structure</li>
                  <li>Intellectual property documentation</li>
                  <li>Market analysis and competitive landscape</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 dark:bg-blue-700">
        <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Interested in Acquiring or Investing?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Contact Sean McDonnell directly to discuss terms, receive detailed financials, and schedule a comprehensive demo
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <a href="https://bizbot.store" target="_blank" rel="noopener noreferrer">
                <Globe className="mr-2 h-5 w-5" />
                Visit BizBot.store
              </a>
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white/10" asChild>
              <a href="mailto:support@bizbot.store">
                <Phone className="mr-2 h-5 w-5" />
                Call support@bizbot.store
              </a>
            </Button>
          </div>
          <p className="text-sm text-blue-100 mt-6">
            All inquiries are handled with strict confidentiality. NDA available upon request.
          </p>
        </div>
      </section>

      {/* Legal Notice */}
      <section className="py-8 bg-yellow-50 dark:bg-yellow-900/20 border-t border-yellow-200 dark:border-yellow-800">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <p className="text-sm text-yellow-800 dark:text-yellow-200 text-center">
            <strong>Disclaimer:</strong> All financial projections are forward-looking statements based on current market conditions and growth trajectories. 
            Actual results may vary. This is not an offer to sell securities. All sales are &quot;AS IS&quot; without warranty. 
            Copyright © 2025 Sean McDonnell. All Rights Reserved.
          </p>
        </div>
      </section>
    </div>
  )
}

