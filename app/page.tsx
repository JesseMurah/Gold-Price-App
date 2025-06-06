"use client"

import type React from "react"

import { useState } from "react"
import { Gem, Settings, TrendingUp, TrendingDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"

interface FormData {
  spotPrice: string
  dubaiDiscount: string
  transportCost: string
  meltingLoss: string
  karatLoss: string
  ghanaMarketPrice: string
  cediDollarRate: string
}

interface Results {
  finalDubaiPriceAED: number
  profitGHS: number
}

export default function GoldCalculatorPage() {
  const [formData, setFormData] = useState<FormData>({
    spotPrice: "",
    dubaiDiscount: "",
    transportCost: "",
    meltingLoss: "",
    karatLoss: "",
    ghanaMarketPrice: "",
    cediDollarRate: "",
  })

  const [results, setResults] = useState<Results | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Add this new function above your GoldCalculatorPage component or import it
  function translateJavaCalculation(
      P_spotPrice: number, // World Market Spot Price (per gram) (e.g., from formData.spotPrice)
      D_dubaiDiscountPercent: number, // Dubai Discount (%, e.g., 5 for 5% from formData.dubaiDiscount)
      T_transportCost: number, // Transportation Cost (per gram) (e.g., from formData.transportCost)
      X_meltingLossPercent: number, // Melting Loss (%, e.g., 2 for 2% from formData.meltingLoss)
      Y_karatLossPercent: number, // Karat Loss (%, e.g., 1 for 1% from formData.karatLoss)
      ghanaMarketPrice_GHS: number, // Ghana Market Price (per gram) (GHS)
      R_cediDollarRate: number, // Cedi/Dollar Exchange Rate
  ): { calculatedPriceGHS: number; profitOrLossGHS: number } {
    // These are the parameters P, D, T, X, Y as used in your Java formula's structure
    const P = P_spotPrice
    const D_param = D_dubaiDiscountPercent // Using the percentage number directly (e.g., 5 if 5%)
    const T = T_transportCost
    const X_param = X_meltingLossPercent // Using the percentage number directly
    const Y_param = Y_karatLossPercent // Using the percentage number directly

    const gramsPerCustomPound = 129.03 // As per your Java code's comment "// Custom pound unit" for T

    // REPLICATING JAVA CALCULATION STRUCTURE:
    // AMOUNT PER "POUND" (or other unit defined by divisors) IN $
    const amountPerPoundWorldMarket = P / 4
    const amountPerPoundDubaiDiscount = D_param / 4 // Note: This adds to cost if D_param is positive.
    const amountPerPoundTransportation = T / gramsPerCustomPound
    const amountPerPoundMeltingLoss = ((P / 32) * X_param) / gramsPerCustomPound
    const amountPerPoundKaratLoss = ((P / 32) * Y_param) / gramsPerCustomPound

    // AMOUNT IN 23K BASE GHC
    const purityFactor23K = 23.0 / 24.0
    const amountGhcWorldMarket = amountPerPoundWorldMarket * purityFactor23K * R_cediDollarRate
    const amountGhcDubaiDiscount = amountPerPoundDubaiDiscount * R_cediDollarRate // In Java, this component is added.
    const amountGhcTransportation = amountPerPoundTransportation * R_cediDollarRate
    const amountGhcMeltingLoss = amountPerPoundMeltingLoss * R_cediDollarRate
    const amountGhcKaratLoss = amountPerPoundKaratLoss * R_cediDollarRate

    // FINAL ESTIMATED DUBAI PRICE (This will be in GHS based on the Java calculation)
    const finalEstimatedDubaiPrice_GHS =
        amountGhcWorldMarket +
        amountGhcDubaiDiscount + // This term is ADDED. If "Dubai Discount" is a true discount, this logic would be different (e.g., subtraction or P*(1-D%)).
        amountGhcTransportation +
        amountGhcMeltingLoss +
        amountGhcKaratLoss

    // PROFIT OR LOSS (GHS)
    const profitOrLoss_GHS = finalEstimatedDubaiPrice_GHS - ghanaMarketPrice_GHS

    return {
      calculatedPriceGHS: finalEstimatedDubaiPrice_GHS,
      profitOrLossGHS: profitOrLoss_GHS,
    }
  }

  // Replace the existing handleCalculate function with this one:
  const handleCalculate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Parse form data to numbers, ensuring they are valid numbers or default to 0.
    const P_val = Number.parseFloat(formData.spotPrice) || 0
    const D_val = Number.parseFloat(formData.dubaiDiscount) || 0 // This is the percentage value, e.g., 5 for 5%
    const T_val = Number.parseFloat(formData.transportCost) || 0
    const X_val = Number.parseFloat(formData.meltingLoss) || 0 // Percentage value, e.g., 2 for 2%
    const Y_val = Number.parseFloat(formData.karatLoss) || 0 // Percentage value, e.g., 1 for 1%
    const ghana_val = Number.parseFloat(formData.ghanaMarketPrice) || 0
    const R_val = Number.parseFloat(formData.cediDollarRate) || 1 // Avoid division by zero if R is used as divisor, ensure it's at least 1 if not set.

    const calcResults = translateJavaCalculation(P_val, D_val, T_val, X_val, Y_val, ghana_val, R_val)

    // Your UI expects results.finalDubaiPriceAED and results.profitGHS
    // The translated calculation (calculatedPriceGHS) produces a GHS value for the "Dubai Price".
    // There's a mismatch if the UI must display AED. For now, I'll put the GHS value.
    // You may need an additional step or a different formula if an AED value is strictly required for "Final Estimated Dubai Price".
    setResults({
      finalDubaiPriceAED: isNaN(calcResults.calculatedPriceGHS) ? 0 : calcResults.calculatedPriceGHS, // Currently displaying GHS value.
      profitGHS: isNaN(calcResults.profitOrLossGHS) ? 0 : calcResults.profitOrLossGHS,
    })
  }

  return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100 flex flex-col text-gray-800">
        <header className="py-4 px-6 md:px-10 shadow-sm bg-white/80 backdrop-blur-md">
          <div className="container mx-auto flex justify-between items-center">
            <Link href="/" className="flex items-center gap-2 text-xl font-semibold text-blue-700">
              <Gem className="w-7 h-7" />
              <span>Gold Price Calculator</span>
            </Link>
            <nav className="flex items-center gap-4 md:gap-6">
              <Link href="/" className="text-sm hover:text-blue-700 transition-colors">
                Home
              </Link>
              <Link href="/about" className="text-sm hover:text-blue-700 transition-colors">
                About
              </Link>
              <Link href="/contact" className="text-sm hover:text-blue-700 transition-colors">
                Contact
              </Link>
              <Button variant="ghost" size="icon" className="text-gray-600 hover:text-blue-700">
                <Settings className="w-5 h-5" />
                <span className="sr-only">Settings</span>
              </Button>
            </nav>
          </div>
        </header>

        <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-center text-blue-800 mb-2">Gold Price Calculator</h1>
            <p className="text-center text-gray-600 mb-8 md:mb-12">
              Calculate the estimated price and profit/loss for your gold transactions.
            </p>

            <form onSubmit={handleCalculate} className="space-y-6 bg-white p-6 md:p-8 rounded-xl shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="spotPrice" className="text-sm font-medium text-gray-700">
                    World Market Spot Price (per gram)
                  </Label>
                  <Input
                      type="number"
                      id="spotPrice"
                      name="spotPrice"
                      value={formData.spotPrice}
                      onChange={handleInputChange}
                      placeholder="Enter spot price"
                      className="mt-1"
                      step="any"
                  />
                </div>
                <div>
                  <Label htmlFor="dubaiDiscount" className="text-sm font-medium text-gray-700">
                    Dubai Discount (%)
                  </Label>
                  <Input
                      type="number"
                      id="dubaiDiscount"
                      name="dubaiDiscount"
                      value={formData.dubaiDiscount}
                      onChange={handleInputChange}
                      placeholder="Enter discount"
                      className="mt-1"
                      step="any"
                  />
                </div>
                <div>
                  <Label htmlFor="transportCost" className="text-sm font-medium text-gray-700">
                    Transportation Cost (per gram)
                  </Label>
                  <Input
                      type="number"
                      id="transportCost"
                      name="transportCost"
                      value={formData.transportCost}
                      onChange={handleInputChange}
                      placeholder="Enter transportation cost"
                      className="mt-1"
                      step="any"
                  />
                </div>
                <div>
                  <Label htmlFor="meltingLoss" className="text-sm font-medium text-gray-700">
                    Melting Loss (%)
                  </Label>
                  <Input
                      type="number"
                      id="meltingLoss"
                      name="meltingLoss"
                      value={formData.meltingLoss}
                      onChange={handleInputChange}
                      placeholder="Enter melting loss"
                      className="mt-1"
                      step="any"
                  />
                </div>
                <div>
                  <Label htmlFor="karatLoss" className="text-sm font-medium text-gray-700">
                    Karat Loss (%)
                  </Label>
                  <Input
                      type="number"
                      id="karatLoss"
                      name="karatLoss"
                      value={formData.karatLoss}
                      onChange={handleInputChange}
                      placeholder="Enter karat loss"
                      className="mt-1"
                      step="any"
                  />
                </div>
                <div>
                  <Label htmlFor="ghanaMarketPrice" className="text-sm font-medium text-gray-700">
                    Ghana Market Price (per gram)
                  </Label>
                  <Input
                      type="number"
                      id="ghanaMarketPrice"
                      name="ghanaMarketPrice"
                      value={formData.ghanaMarketPrice}
                      onChange={handleInputChange}
                      placeholder="Enter Ghana market price"
                      className="mt-1"
                      step="any"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="cediDollarRate" className="text-sm font-medium text-gray-700">
                    Cedi/Dollar Exchange Rate
                  </Label>
                  <Input
                      type="number"
                      id="cediDollarRate"
                      name="cediDollarRate"
                      value={formData.cediDollarRate}
                      onChange={handleInputChange}
                      placeholder="Enter Rate"
                      className="mt-1"
                      step="any"
                  />
                </div>
              </div>
              <Button type="submit" className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white py-3 px-6">
                Calculate
              </Button>
            </form>

            {results && (
                <div className="mt-10 md:mt-12 bg-white p-6 md:p-8 rounded-xl shadow-lg">
                  <h2 className="text-2xl font-semibold text-blue-800 mb-6">Results</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-700">Final Estimated Dubai Price</p>
                      <p className="text-2xl font-bold text-blue-900">AED {results.finalDubaiPriceAED.toFixed(2)}</p>
                    </div>
                    <div className={`p-4 rounded-lg ${results.profitGHS >= 0 ? "bg-green-50" : "bg-red-50"}`}>
                      <p className={`text-sm ${results.profitGHS >= 0 ? "text-green-700" : "text-red-700"}`}>Profit/Loss</p>
                      <div className="flex items-center">
                        {results.profitGHS >= 0 ? (
                            <TrendingUp className="w-6 h-6 text-green-600 mr-2" />
                        ) : (
                            <TrendingDown className="w-6 h-6 text-red-600 mr-2" />
                        )}
                        <p className={`text-2xl font-bold ${results.profitGHS >= 0 ? "text-green-900" : "text-red-900"}`}>
                          GHS {results.profitGHS.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
            )}
          </div>
        </main>

        <footer className="py-6 text-center bg-white/50">
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} Gold Price Calculator. All rights reserved.
          </p>
        </footer>
      </div>
  )
}
