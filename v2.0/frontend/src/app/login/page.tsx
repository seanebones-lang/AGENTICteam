"use client";

import { useState } from "react";
import Link from "next/link";
import { CleanLayout, CleanCard } from "@/components/clean-layout";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // TODO: Implement actual login API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      window.location.href = "/dashboard";
    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      backgroundColor: '#ffffff', 
      minHeight: '100vh', 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ 
            fontSize: '32px', 
            fontWeight: '600', 
            color: '#000000', 
            marginBottom: '8px'
          }}>
            Welcome back
          </h1>
          <p style={{ fontSize: '16px', color: '#666666' }}>
            Sign in to access all 10 AI agents
          </p>
        </div>

        {/* Login Form */}
        <CleanCard>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {error && (
              <div style={{ 
                padding: '12px', 
                backgroundColor: '#fef2f2', 
                border: '1px solid #fecaca',
                borderRadius: '6px',
                color: '#dc2626',
                fontSize: '14px'
              }}>
                {error}
              </div>
            )}
            
            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '14px', 
                fontWeight: '500', 
                color: '#000000', 
                marginBottom: '6px'
              }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  fontSize: '16px',
                  backgroundColor: '#ffffff',
                  color: '#000000'
                }}
              />
            </div>
            
            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '14px', 
                fontWeight: '500', 
                color: '#000000', 
                marginBottom: '6px'
              }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  fontSize: '16px',
                  backgroundColor: '#ffffff',
                  color: '#000000'
                }}
              />
            </div>
            
            <button 
              type="submit" 
              disabled={loading || !email || !password}
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '16px',
                fontWeight: '500',
                color: '#ffffff',
                backgroundColor: loading || !email || !password ? '#cccccc' : '#0070f3',
                border: 'none',
                borderRadius: '6px',
                cursor: loading || !email || !password ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </CleanCard>

        {/* Links */}
        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px' }}>
          <span style={{ color: '#666666' }}>Don't have an account? </span>
          <Link href="/signup" style={{ color: '#0070f3', textDecoration: 'none', fontWeight: '500' }}>
            Sign up
          </Link>
        </div>

        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '8px',
            padding: '8px 16px',
            backgroundColor: '#f0f9ff',
            borderRadius: '20px',
            fontSize: '14px',
            color: '#0070f3'
          }}>
            <span>🎁</span>
            <span>3 free queries without signup</span>
          </div>
          <div style={{ marginTop: '8px' }}>
            <Link href="/agents" style={{ fontSize: '14px', color: '#666666', textDecoration: 'none' }}>
              Try agents now →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}