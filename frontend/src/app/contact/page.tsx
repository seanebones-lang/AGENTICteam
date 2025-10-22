import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/Button'
import { 
  Globe, 
  Phone, 
  Mail, 
  MessageSquare, 
  Clock,
  MapPin,
  HeadphonesIcon,
  Shield
} from 'lucide-react'

export default function ContactPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Badge className="mb-4 px-4 py-1.5 text-sm font-semibold">
              Get In Touch
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6">
              Contact Us
            </h1>
            <p className="text-lg leading-8 text-gray-700 dark:text-gray-300 mb-8">
              Ready to transform your operations with AI agents? We&apos;re here to help you get started.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            <Card className="p-8 text-center hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 mb-4">
                <Globe className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Visit Our Website</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Explore our full range of AI automation solutions
              </p>
              <Button asChild className="w-full">
                <a href="https://bizbot.store" target="_blank" rel="noopener noreferrer">
                  BizBot.store
                </a>
              </Button>
            </Card>

            <Card className="p-8 text-center hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 mb-4">
                <Phone className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Call Us</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Speak directly with our team
              </p>
              <Button asChild className="w-full bg-green-600 hover:bg-green-700">
                <a href="mailto:support@bizbot.store">
                  support@bizbot.store
                </a>
              </Button>
            </Card>

            <Card className="p-8 text-center hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900 mb-4">
                <MessageSquare className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Contact Form</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Send us a message through our website
              </p>
              <Button asChild className="w-full bg-purple-600 hover:bg-purple-700">
                <a href="https://bizbot.store/contact" target="_blank" rel="noopener noreferrer">
                  Send Message
                </a>
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Support Options */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How Can We Help?</h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
              Choose the support channel that works best for you
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="p-6">
              <HeadphonesIcon className="h-10 w-10 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Sales Inquiries</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Interested in purchasing or licensing Agent Marketplace? Our sales team is ready to discuss pricing, features, and custom enterprise solutions.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <Phone className="h-4 w-4" />
                  <a href="mailto:support@bizbot.store" className="hover:text-blue-600">support@bizbot.store</a>
                </div>
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <Globe className="h-4 w-4" />
                  <a href="https://bizbot.store" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">bizbot.store</a>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <Shield className="h-10 w-10 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Technical Support</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Need help with implementation, integration, or troubleshooting? Our technical team provides comprehensive support for all licensed customers.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <Phone className="h-4 w-4" />
                  <a href="mailto:support@bizbot.store" className="hover:text-blue-600">support@bizbot.store</a>
                </div>
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <Globe className="h-4 w-4" />
                  <a href="https://bizbot.store/support" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">Support Portal</a>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <Clock className="h-10 w-10 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Business Hours</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Our team is available during the following hours:
              </p>
              <div className="space-y-2 text-gray-700 dark:text-gray-300">
                <div className="flex justify-between">
                  <span className="font-medium">Monday - Friday:</span>
                  <span>9:00 AM - 6:00 PM CST</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Saturday:</span>
                  <span>10:00 AM - 4:00 PM CST</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Sunday:</span>
                  <span>Closed</span>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm">
                    <strong>Emergency Support:</strong> 24/7 for Enterprise customers
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <MapPin className="h-10 w-10 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Location</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Proudly serving clients worldwide from our headquarters in Texas, USA.
              </p>
              <div className="space-y-2 text-gray-700 dark:text-gray-300">
                <p className="font-medium">BizBot</p>
                <p>Texas, United States</p>
                <p className="mt-4">
                  <strong>Phone:</strong> <a href="mailto:support@bizbot.store" className="hover:text-blue-600">support@bizbot.store</a>
                </p>
                <p>
                  <strong>Web:</strong> <a href="https://bizbot.store" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">bizbot.store</a>
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Quick Links */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Quick Answers</h2>
            <p className="text-lg text-gray-700 dark:text-gray-300">
              Common questions about Agent Marketplace
            </p>
          </div>
          <Card className="p-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">How do I purchase a license?</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Contact us at <a href="mailto:support@bizbot.store" className="text-blue-600 hover:underline">support@bizbot.store</a> or visit <a href="https://bizbot.store" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">bizbot.store</a> to discuss licensing options. We offer flexible plans for businesses of all sizes.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Is there a free trial available?</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Please contact our sales team to discuss trial options and demo access for your organization.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">What support is included?</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  All licenses include technical support. Enterprise customers receive 24/7 priority support with dedicated account management.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Can I customize agents for my needs?</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Yes! We offer custom agent development and integration services. Contact us to discuss your specific requirements.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 dark:bg-blue-700">
        <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Let&apos;s Start a Conversation
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Our team is ready to help you transform your operations with AI agents
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
        </div>
      </section>
    </div>
  )
}

