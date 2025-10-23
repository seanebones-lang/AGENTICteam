"use client";

import Link from "next/link";
import { CleanLayout, CleanCard } from "@/components/clean-layout";

export default function DashboardPage() {
  const user = {
    name: "Sean McDonnell",
    email: "seanebones@gmail.com",
    tier: "Basic",
    credits: 25.0,
    totalQueries: 47,
    successRate: 98.7
  };

  const recentActivity = [
    { agent: "Ticket Resolver", query: "Customer billing issue", time: "2 minutes ago", status: "success" },
    { agent: "Security Scanner", query: "Code vulnerability scan", time: "15 minutes ago", status: "success" },
    { agent: "Knowledge Base", query: "API documentation lookup", time: "1 hour ago", status: "success" },
    { agent: "Data Processor", query: "CSV data transformation", time: "2 hours ago", status: "success" },
  ];

  return (
    <CleanLayout title="Dashboard" subtitle={`Welcome back, ${user.name}`}>
      {/* Stats Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '20px',
        marginBottom: '40px'
      }}>
        <CleanCard>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', fontWeight: '700', color: '#0070f3', marginBottom: '8px' }}>
              {user.credits}
            </div>
            <div style={{ fontSize: '14px', color: '#666666' }}>Credits Available</div>
          </div>
        </CleanCard>

        <CleanCard>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', fontWeight: '700', color: '#0070f3', marginBottom: '8px' }}>
              {user.totalQueries}
            </div>
            <div style={{ fontSize: '14px', color: '#666666' }}>Total Queries</div>
          </div>
        </CleanCard>

        <CleanCard>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', fontWeight: '700', color: '#0070f3', marginBottom: '8px' }}>
              {user.successRate}%
            </div>
            <div style={{ fontSize: '14px', color: '#666666' }}>Success Rate</div>
          </div>
        </CleanCard>

        <CleanCard>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', fontWeight: '700', color: '#0070f3', marginBottom: '8px' }}>
              {user.tier}
            </div>
            <div style={{ fontSize: '14px', color: '#666666' }}>
              <Link href="/pricing" style={{ color: '#0070f3', textDecoration: 'none' }}>
                Upgrade →
              </Link>
            </div>
          </div>
        </CleanCard>
      </div>

      {/* Recent Activity */}
      <CleanCard>
        <h2 style={{ 
          fontSize: '20px', 
          fontWeight: '600', 
          color: '#000000', 
          marginBottom: '20px'
        }}>
          Recent Activity
        </h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {recentActivity.map((activity, index) => (
            <div key={index} style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              padding: '12px 0',
              borderBottom: index < recentActivity.length - 1 ? '1px solid #f1f5f9' : 'none'
            }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '500', color: '#000000' }}>
                  {activity.agent}
                </div>
                <div style={{ fontSize: '12px', color: '#666666' }}>
                  {activity.query}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '12px', color: '#666666' }}>{activity.time}</div>
                <div style={{ 
                  fontSize: '12px', 
                  color: '#059669',
                  backgroundColor: '#ecfdf5',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  marginTop: '2px'
                }}>
                  {activity.status}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <Link 
            href="/agents"
            style={{
              display: 'inline-block',
              padding: '10px 20px',
              fontSize: '14px',
              fontWeight: '500',
              color: '#0070f3',
              backgroundColor: '#f0f9ff',
              borderRadius: '6px',
              textDecoration: 'none'
            }}
          >
            Use Agents
          </Link>
        </div>
      </CleanCard>
    </CleanLayout>
  );
}