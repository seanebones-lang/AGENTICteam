/**
 * Agent Card Component
 */

import { FC } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../ui/Card';
import { Button } from '../ui/Button';
import { AgentPackage } from '@/types';

interface AgentCardProps {
  agent: AgentPackage;
}

export const AgentCard: FC<AgentCardProps> = ({ agent }) => {
  const formatPrice = (price?: number) => {
    if (!price) return 'Free';
    return `$${price.toFixed(2)}`;
  };

  return (
    <Card hover>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>{agent.name}</CardTitle>
            <p className="text-sm text-gray-500 mt-1">{agent.category}</p>
          </div>
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
            v{agent.version}
          </span>
        </div>
      </CardHeader>

      <CardContent>
        <p className="text-sm mb-4">{agent.description}</p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm">
            <span className="font-medium mr-2">Engine:</span>
            <span className="text-gray-600">{agent.engine_type}</span>
          </div>
          <div className="flex items-center text-sm">
            <span className="font-medium mr-2">Success Rate:</span>
            <span className="text-green-600">{agent.performance_metrics.success_rate}</span>
          </div>
          <div className="flex items-center text-sm">
            <span className="font-medium mr-2">Avg Time:</span>
            <span className="text-gray-600">{agent.performance_metrics.avg_execution_time}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mb-4">
          {agent.features.slice(0, 3).map((feature, idx) => (
            <span
              key={idx}
              className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
            >
              {feature}
            </span>
          ))}
          {agent.features.length > 3 && (
            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
              +{agent.features.length - 3} more
            </span>
          )}
        </div>
      </CardContent>

      <CardFooter>
        <div className="flex items-center justify-between">
          <div className="text-sm">
            {agent.pricing.per_task && (
              <p className="font-semibold text-gray-900">
                {formatPrice(agent.pricing.per_task)}/task
              </p>
            )}
            {agent.pricing.monthly && (
              <p className="text-gray-500">
                or {formatPrice(agent.pricing.monthly)}/month
              </p>
            )}
          </div>
          <Link href={`/agents/${agent.package_id}`}>
            <Button size="sm">View Details</Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};

