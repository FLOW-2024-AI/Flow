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
    <div className="bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-3xl p-8 md:p-12 shadow-lg transition-colors duration-300">
      <h3 className="text-3xl font-bold mb-8 text-center text-text-primary-light dark:text-text-primary-dark">Calcula tu ROI</h3>
      
      <div className="space-y-6 mb-8">
        {/* Employees Slider */}
        <div>
          <div className="flex justify-between mb-3">
            <label className="text-text-secondary-light dark:text-text-secondary-dark">Empleados en finanzas</label>
            <span className="text-text-primary-light dark:text-text-primary-dark font-bold">{employees}</span>
          </div>
          <input
            type="range"
            min="1"
            max="50"
            value={employees}
            onChange={(e) => setEmployees(Number(e.target.value))}
            className="w-full h-2 bg-border-light dark:bg-border-dark rounded-lg appearance-none cursor-pointer slider"
          />
        </div>

        {/* Hours Slider */}
        <div>
          <div className="flex justify-between mb-3">
            <label className="text-text-secondary-light dark:text-text-secondary-dark">Horas manuales por semana</label>
            <span className="text-text-primary-light dark:text-text-primary-dark font-bold">{hoursPerWeek}h</span>
          </div>
          <input
            type="range"
            min="1"
            max="40"
            value={hoursPerWeek}
            onChange={(e) => setHoursPerWeek(Number(e.target.value))}
            className="w-full h-2 bg-border-light dark:bg-border-dark rounded-lg appearance-none cursor-pointer slider"
          />
        </div>

        {/* Hourly Rate Slider */}
        <div>
          <div className="flex justify-between mb-3">
            <label className="text-text-secondary-light dark:text-text-secondary-dark">Costo por hora (USD)</label>
            <span className="text-text-primary-light dark:text-text-primary-dark font-bold">${hourlyRate}</span>
          </div>
          <input
            type="range"
            min="10"
            max="100"
            value={hourlyRate}
            onChange={(e) => setHourlyRate(Number(e.target.value))}
            className="w-full h-2 bg-border-light dark:bg-border-dark rounded-lg appearance-none cursor-pointer slider"
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
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-6 text-center">
          <div className="text-sm text-blue-400 mb-2">Ahorro Mensual</div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white">
            ${monthlySavings.toLocaleString()}
          </div>
        </div>

        <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-6 text-center">
          <div className="text-sm text-green-400 mb-2">Ahorro Anual</div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white">
            ${yearlySavings.toLocaleString()}
          </div>
        </div>

        <div className="bg-purple-500/10 border border-purple-500/30 rounded-2xl p-6 text-center">
          <div className="text-sm text-purple-400 mb-2">ROI Anual</div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white">
            {yearlyROI.toFixed(0)}%
          </div>
        </div>
      </motion.div>

      <p className="text-center text-text-secondary-light dark:text-text-secondary-dark text-sm mt-6">
        * Cálculo basado en automatización del 80% de tareas manuales
      </p>
    </div>
  )
}
