"use client";

import { useState } from "react";
import Link from "next/link";
import { CleanCard } from "@/components/clean-layout";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    company: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      setLoading(false);
      return;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      window.location.href = "/dashboard";
    } catch (err) {
      setError("Signup failed. Please try again.");
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
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ 
            fontSize: '32px', 
            fontWeight: '600', 
            color: '#000000', 
            marginBottom: '8px'
          }}>
            Create account
          </h1>
          <p style={{ fontSize: '16px', color: '#666666' }}>
            Get started with 10 free credits
          </p>
        </div>

        <CleanCard>
          <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
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
                Full Name
              </label>
              <input
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
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
                Email
              </label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
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
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Create a secure password"
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
              <p style={{ fontSize: '12px', color: '#999999', marginTop: '4px' }}>
                Must be at least 8 characters long
              </p>
            </div>
            
            <button 
              type="submit" 
              disabled={loading || !formData.name || !formData.email || !formData.password}
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '16px',
                fontWeight: '500',
                color: '#ffffff',
                backgroundColor: loading || !formData.name || !formData.email || !formData.password ? '#cccccc' : '#0070f3',
                border: 'none',
                borderRadius: '6px',
                cursor: loading || !formData.name || !formData.email || !formData.password ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>
        </CleanCard>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px' }}>
          <span style={{ color: '#666666' }}>Already have an account? </span>
          <Link href="/login" style={{ color: '#0070f3', textDecoration: 'none', fontWeight: '500' }}>
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}