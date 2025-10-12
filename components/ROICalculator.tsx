'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

export default function ROICalculator() {
  const [employees, setEmployees] = useState(5)
  const [hoursPerWeek, setHoursPerWeek] = useState(10)
  const [hourlyRate, setHourlyRate] = useState(25)

  const weeklySavings = employees * hoursPerWeek * hourlyRate
  const monthlySavings = weeklySavings * 4
  const yearlySavings = monthlySavings * 12
  const flowMonthlyPrice = 299 // Precio ejemplo
  const yearlyROI = ((yearlySavings - (flowMonthlyPrice * 12)) / (flowMonthlyPrice * 12)) * 100

  return (
    <div className="bg-gradient-to-br from-white to-neutral-50 dark:from-neutral-900 dark:to-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-3xl p-8 md:p-12 shadow-2xl">
      <h3 className="text-3xl font-bold mb-8 text-center text-neutral-900 dark:text-neutral-50">Calcula tu ROI</h3>
      
      <div className="space-y-6 mb-8">
        {/* Employees Slider */}
        <div>
          <div className="flex justify-between mb-3">
            <label className="text-neutral-600 dark:text-neutral-400 font-medium">Empleados en finanzas</label>
            <span className="text-neutral-900 dark:text-neutral-50 font-bold text-lg">{employees}</span>
          </div>
          <input
            type="range"
            min="1"
            max="50"
            value={employees}
            onChange={(e) => setEmployees(Number(e.target.value))}
            className="w-full h-2 bg-neutral-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>

        {/* Hours Slider */}
        <div>
          <div className="flex justify-between mb-3">
            <label className="text-neutral-600 dark:text-neutral-400 font-medium">Horas manuales por semana</label>
            <span className="text-neutral-900 dark:text-neutral-50 font-bold text-lg">{hoursPerWeek}h</span>
          </div>
          <input
            type="range"
            min="1"
            max="40"
            value={hoursPerWeek}
            onChange={(e) => setHoursPerWeek(Number(e.target.value))}
            className="w-full h-2 bg-neutral-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>

        {/* Hourly Rate Slider */}
        <div>
          <div className="flex justify-between mb-3">
            <label className="text-neutral-600 dark:text-neutral-400 font-medium">Costo por hora (USD)</label>
            <span className="text-neutral-900 dark:text-neutral-50 font-bold text-lg">${hourlyRate}</span>
          </div>
          <input
            type="range"
            min="10"
            max="100"
            value={hourlyRate}
            onChange={(e) => setHourlyRate(Number(e.target.value))}
            className="w-full h-2 bg-neutral-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>
      </div>

      {/* Results */}
      <motion.div 
        className="grid md:grid-cols-3 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        key={`${employees}-${hoursPerWeek}-${hourlyRate}`}
      >
        <div className="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-950 dark:to-primary-900 border border-primary-200 dark:border-primary-800 rounded-2xl p-6 text-center">
          <div className="text-sm text-primary-600 dark:text-primary-400 font-semibold mb-2">Ahorro Mensual</div>
          <div className="text-4xl font-bold text-primary-700 dark:text-primary-300">
            ${monthlySavings.toLocaleString()}
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border border-green-200 dark:border-green-800 rounded-2xl p-6 text-center">
          <div className="text-sm text-green-600 dark:text-green-400 font-semibold mb-2">Ahorro Anual</div>
          <div className="text-4xl font-bold text-green-700 dark:text-green-300">
            ${yearlySavings.toLocaleString()}
          </div>
        </div>

        <div className="bg-gradient-to-br from-secondary-50 to-secondary-100 dark:from-secondary-950 dark:to-secondary-900 border border-secondary-200 dark:border-secondary-800 rounded-2xl p-6 text-center">
          <div className="text-sm text-secondary-600 dark:text-secondary-400 font-semibold mb-2">ROI Anual</div>
          <div className="text-4xl font-bold text-secondary-700 dark:text-secondary-300">
            {yearlyROI.toFixed(0)}%
          </div>
        </div>
      </motion.div>

      <p className="text-center text-neutral-500 dark:text-neutral-400 text-sm mt-6">
        * Cálculo basado en automatización del 80% de tareas manuales
      </p>
    </div>
  )
}
