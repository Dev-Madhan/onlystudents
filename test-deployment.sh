#!/bin/bash

echo "======================================"
echo "Deployment Readiness Test"
echo "======================================"
echo ""

# Test 1: TypeScript Check
echo "Test 1: TypeScript Validation..."
if npx tsc --noEmit 2>&1 | grep -q "error"; then
    echo "❌ TypeScript errors found"
    exit 1
else
    echo "✅ TypeScript validation passed"
fi
echo ""

# Test 2: ESLint Check
echo "Test 2: ESLint Validation..."
npm run lint 2>&1 > /tmp/lint-output.txt
if grep -q "Error" /tmp/lint-output.txt; then
    echo "❌ ESLint errors found"
    cat /tmp/lint-output.txt
    exit 1
else
    echo "✅ ESLint validation passed"
fi
echo ""

# Test 3: Build Test (Vercel environment)
echo "Test 3: Build Test (Vercel Environment)..."
if VERCEL=1 npm run build 2>&1 | grep -q "Failed to compile"; then
    echo "❌ Build failed"
    exit 1
else
    echo "✅ Build completed successfully"
fi
echo ""

echo "======================================"
echo "✅ All Tests Passed!"
echo "======================================"
echo ""
echo "Your application is ready for Vercel deployment!"
echo ""
echo "Next steps:"
echo "1. Set up PostgreSQL database"
echo "2. Push code to GitHub"
echo "3. Deploy to Vercel"
echo "4. Add environment variables in Vercel dashboard"
echo ""
echo "See VERCEL_DEPLOYMENT_SUMMARY.md for detailed instructions"
