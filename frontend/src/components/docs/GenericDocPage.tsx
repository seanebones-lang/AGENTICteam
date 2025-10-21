import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { FileText, ArrowRight } from 'lucide-react'

interface GenericDocPageProps {
  title: string
  category: string
  description: string
  content: {
    sections: Array<{
      title: string
      content: string | React.ReactNode
    }>
  }
}

export function GenericDocPage({ title, category, description, content }: GenericDocPageProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-4xl px-6 py-12 lg:px-8">
        <div className="mb-8">
          <Link href="/docs" className="text-sm text-blue-600 hover:underline mb-4 inline-block">
            ← Back to Documentation
          </Link>
          <Badge className="mb-4">{category}</Badge>
          <h1 className="text-4xl font-bold mb-4">{title}</h1>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            {description}
          </p>
        </div>

        <div className="space-y-8">
          {content.sections.map((section, index) => (
            <Card key={index} className="p-8">
              <h2 className="text-2xl font-bold mb-4">{section.title}</h2>
              {typeof section.content === 'string' ? (
                <p className="text-gray-700 dark:text-gray-300">{section.content}</p>
              ) : (
                section.content
              )}
            </Card>
          ))}

          <Card className="p-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="h-8 w-8 text-blue-600" />
              <h2 className="text-2xl font-bold">Need More Information?</h2>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              For detailed implementation guidance or custom solutions, contact our team.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild>
                <a href="https://bizbot.store" target="_blank" rel="noopener noreferrer">
                  Contact Support <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/playground">
                  Try Interactive Demo
                </Link>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

