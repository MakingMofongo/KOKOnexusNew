'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { SPRING } from '@/lib/constants/animations'

// ─── Step Data ───────────────────────────────────────────────────────────────

const steps = [
  {
    id: 'template',
    number: '01',
    title: 'Pick a Template',
    subtitle: '30 seconds',
    icon: 'fa-grid-2',
    color: '#a78bfa',
    description: 'Choose an industry blueprint. Every template ships with a trained knowledge base, conversation flows, and tool integrations.',
    terminal: [
      { type: 'prompt', text: '$ koko init --template' },
      { type: 'info', text: '' },
      { type: 'info', text: '  Available templates:' },
      { type: 'info', text: '' },
      { type: 'option', text: '  ● Hotel & Hospitality', active: true },
      { type: 'option', text: '    Medical & Healthcare' },
      { type: 'option', text: '    Real Estate' },
      { type: 'option', text: '    Restaurant & Dining' },
      { type: 'option', text: '    Auto Dealership' },
      { type: 'option', text: '    Custom (blank)' },
      { type: 'info', text: '' },
      { type: 'success', text: '  ✓ Template loaded — 847 knowledge entries' },
    ],
  },
  {
    id: 'voice',
    number: '02',
    title: 'Configure Voice & Language',
    subtitle: '60 seconds',
    icon: 'fa-waveform-lines',
    color: '#60a5fa',
    description: 'Select a voice, set the personality tone, and pick which languages your assistant should handle.',
    terminal: [
      { type: 'prompt', text: '$ koko voice configure' },
      { type: 'info', text: '' },
      { type: 'info', text: '  Voice:       Nova (female, neutral)' },
      { type: 'info', text: '  Provider:    ElevenLabs v3' },
      { type: 'info', text: '  Tone:        Professional, warm' },
      { type: 'info', text: '  Languages:   en, fi, ar, es, fr  (+100 auto-detect)' },
      { type: 'info', text: '  Latency:     < 50ms first byte' },
      { type: 'info', text: '' },
      { type: 'success', text: '  ✓ Voice profile saved' },
      { type: 'success', text: '  ✓ Language routing enabled' },
    ],
  },
  {
    id: 'number',
    number: '03',
    title: 'Assign a Number',
    subtitle: '15 seconds',
    icon: 'fa-phone',
    color: '#34d399',
    description: 'Get a local number in any country instantly, or port your existing business line.',
    terminal: [
      { type: 'prompt', text: '$ koko number assign --country US' },
      { type: 'info', text: '' },
      { type: 'info', text: '  Searching available numbers...' },
      { type: 'info', text: '' },
      { type: 'info', text: '  +1 (775) 571-3834    Reno, NV' },
      { type: 'info', text: '  +1 (415) 555-0192    San Francisco, CA' },
      { type: 'info', text: '  +1 (212) 555-0847    New York, NY' },
      { type: 'info', text: '' },
      { type: 'success', text: '  ✓ +1 (775) 571-3834 assigned' },
      { type: 'success', text: '  ✓ Webhook configured' },
    ],
  },
  {
    id: 'deploy',
    number: '04',
    title: 'Deploy — You\'re Live',
    subtitle: '10 seconds',
    icon: 'fa-rocket',
    color: '#f472b6',
    description: 'One command. Your AI assistant starts answering calls immediately with real-time monitoring.',
    terminal: [
      { type: 'prompt', text: '$ koko deploy --production' },
      { type: 'info', text: '' },
      { type: 'info', text: '  Deploying to edge network...' },
      { type: 'info', text: '' },
      { type: 'info', text: '  Region:      us-west-2 (primary)' },
      { type: 'info', text: '  Failover:    eu-west-1, ap-south-1' },
      { type: 'info', text: '  Health:      all checks passing' },
      { type: 'info', text: '' },
      { type: 'success', text: '  ✓ Deployed successfully' },
      { type: 'success', text: '  ✓ Live — accepting calls now' },
      { type: 'info', text: '' },
      { type: 'link', text: '  Dashboard → https://app.kokonexus.com/live' },
    ],
  },
]

// ─── Typing Terminal ─────────────────────────────────────────────────────────

function Terminal({ stepIndex, allSteps }: { stepIndex: number; allSteps: typeof steps }) {
  const lines = allSteps[stepIndex].terminal
  const color = allSteps[stepIndex].color
  const [visibleCount, setVisibleCount] = useState(0)
  const [prevStepIndex, setPrevStepIndex] = useState(stepIndex)
  const containerRef = useRef<HTMLDivElement>(null)

  // When stepIndex changes, reset visible count and re-type
  useEffect(() => {
    if (stepIndex !== prevStepIndex) {
      setVisibleCount(0)
      setPrevStepIndex(stepIndex)
    }
  }, [stepIndex, prevStepIndex])

  // Typing effect — runs whenever visibleCount resets to 0
  useEffect(() => {
    const total = lines.length
    if (visibleCount >= total) return
    let i = visibleCount
    const timer = setInterval(() => {
      i++
      setVisibleCount(i)
      if (i >= total) clearInterval(timer)
    }, 120)
    return () => clearInterval(timer)
  }, [lines, visibleCount === 0]) // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-scroll to bottom as lines appear
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [visibleCount])

  return (
    <div className="bg-[#0a0a0f] border-[2px] border-white/[0.06] overflow-hidden h-full flex flex-col">
      {/* Title bar — always mounted */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/[0.06] bg-white/[0.02] shrink-0">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 bg-white/10" />
          <div className="w-2.5 h-2.5 bg-white/10" />
          <div className="w-2.5 h-2.5 bg-white/10" />
        </div>
        <span className="text-[11px] font-mono text-white/20 ml-2">terminal</span>
      </div>

      {/* Lines — only content swaps, shell stays */}
      <div ref={containerRef} className="p-5 font-mono text-sm leading-relaxed overflow-y-auto flex-1 no-scrollbar">
        {lines.slice(0, visibleCount).map((line, i) => {
          if (line.text === '') return <div key={i} className="h-3" />

          let textColor = 'text-white/50'
          if (line.type === 'prompt') textColor = 'text-white/90'
          if (line.type === 'success') textColor = ''
          if (line.type === 'link') textColor = ''
          if (line.type === 'option' && line.active) textColor = ''

          return (
            <motion.div
              key={`${stepIndex}-${i}`}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.15 }}
              className={`whitespace-pre ${textColor}`}
              style={
                line.type === 'success'
                  ? { color: '#34d399' }
                  : line.type === 'link'
                    ? { color: color }
                    : line.type === 'option' && (line as any).active
                      ? { color: color }
                      : undefined
              }
            >
              {line.text}
            </motion.div>
          )
        })}
        {/* Blinking cursor */}
        {visibleCount >= lines.length && (
          <motion.span
            className="inline-block w-2 h-4 mt-1"
            style={{ backgroundColor: color }}
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.8, repeat: Infinity, repeatType: 'reverse' }}
          />
        )}
      </div>
    </div>
  )
}

// ─── Timeline connector ──────────────────────────────────────────────────────

function TimelineStep({
  step,
  index,
  isActive,
  isCompleted,
  onClick,
}: {
  step: typeof steps[0]
  index: number
  isActive: boolean
  isCompleted: boolean
  onClick: () => void
}) {
  return (
    <motion.button
      onClick={onClick}
      className="flex items-start gap-4 text-left group w-full"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ ...SPRING, delay: index * 0.08 }}
    >
      {/* Step number */}
      <motion.div
        className="w-11 h-11 border-[3px] flex items-center justify-center font-mono text-sm font-bold transition-all duration-300 shrink-0"
        style={{
          borderColor: isActive || isCompleted ? step.color : 'rgba(255,255,255,0.08)',
          color: isActive || isCompleted ? step.color : 'rgba(255,255,255,0.2)',
          backgroundColor: isActive ? `${step.color}15` : 'transparent',
        }}
      >
        {isCompleted && !isActive ? (
          <i className="fas fa-check text-xs" style={{ color: step.color }} />
        ) : (
          step.number
        )}
      </motion.div>

      {/* Content */}
      <div className="pb-6 pt-1.5 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3
            className="text-base font-bold transition-colors duration-300"
            style={{ color: isActive ? step.color : isCompleted ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.35)' }}
          >
            {step.title}
          </h3>
          <span
            className="text-[10px] font-mono px-1.5 py-0.5 border transition-all duration-300"
            style={{
              borderColor: isActive ? `${step.color}40` : 'rgba(255,255,255,0.06)',
              color: isActive ? step.color : 'rgba(255,255,255,0.2)',
            }}
          >
            {step.subtitle}
          </span>
        </div>
        <p
          className="text-sm leading-relaxed transition-colors duration-300"
          style={{ color: isActive ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.2)' }}
        >
          {step.description}
        </p>
      </div>
    </motion.button>
  )
}

// ─── Main Component ──────────────────────────────────────────────────────────

export function HowItWorksSection() {
  const [activeStep, setActiveStep] = useState(0)

  const active = steps[activeStep]

  // Total time display
  const totalTime = '< 2 min'

  return (
    <section className="py-32 relative overflow-hidden bg-gray-950" id="how-it-works">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 grid-bg opacity-[0.03]" />
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full blur-[180px] opacity-[0.12] top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2"
          animate={{ backgroundColor: active.color }}
          transition={{ duration: 1.2 }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 border-[3px] border-purple-500/30 bg-purple-500/5 mb-6"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ ...SPRING, delay: 0.1 }}
          >
            <i className="fas fa-terminal text-purple-400 text-xs" />
            <span className="text-sm font-mono text-purple-400 tracking-wide uppercase">
              Deploy Flow
            </span>
          </motion.div>

          <motion.h2
            className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ ...SPRING, delay: 0.15 }}
          >
            Zero to Live in{' '}
            <span className="bg-gradient-to-r from-purple-400 to-emerald-400 bg-clip-text text-transparent">
              {totalTime}
            </span>
          </motion.h2>

          <motion.p
            className="text-gray-500 max-w-2xl mx-auto text-lg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ ...SPRING, delay: 0.2 }}
          >
            Four steps. No infrastructure to manage. Your AI assistant starts taking calls the moment you hit deploy.
          </motion.p>
        </div>

        {/* Main grid */}
        <div className="grid lg:grid-cols-[320px_1fr] gap-8 lg:gap-14 items-start">
          {/* Left: Timeline */}
          <div>
            {steps.map((step, i) => (
              <TimelineStep
                key={step.id}
                step={step}
                index={i}
                isActive={i === activeStep}
                isCompleted={i <= activeStep}
                onClick={() => setActiveStep(i)}
              />
            ))}

            {/* Total deploy time */}
            <motion.div
              className="flex items-center gap-3 mt-2 ml-[60px]"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ ...SPRING, delay: 0.5 }}
            >
              <div className="h-[2px] w-8 bg-gradient-to-r from-purple-500 to-emerald-500" />
              <span className="text-[11px] font-mono text-white/25 uppercase tracking-widest">
                Total: {totalTime} from signup to live
              </span>
            </motion.div>
          </div>

          {/* Right: Terminal preview — shell stays mounted, only text swaps */}
          <div className="h-[420px]">
            <Terminal stepIndex={activeStep} allSteps={steps} />
          </div>
        </div>
      </div>
    </section>
  )
}
