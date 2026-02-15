'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SPRING } from '@/lib/constants/animations'

// ─── Data ────────────────────────────────────────────────────────────────────

const pipeline = [
  {
    id: 'ingest',
    label: 'Voice In',
    icon: 'fa-microphone',
    color: '#a78bfa',       // purple-400
    description: 'Caller speaks in any language — audio streams in real-time via WebSocket.',
    detail: 'Raw PCM 16-bit @ 16 kHz · chunked every 20 ms',
  },
  {
    id: 'transcribe',
    label: 'Transcribe',
    icon: 'fa-file-audio',
    color: '#60a5fa',       // blue-400
    provider: 'Deepgram Nova-3',
    description: 'Streaming speech-to-text with word-level timestamps, punctuation, and multilingual keyterm prompting.',
    detail: '< 300 ms latency · 100+ languages · speaker diarization · code-switching',
    stat: { value: '< 300ms', label: 'latency' },
  },
  {
    id: 'detect',
    label: 'Detect Language',
    icon: 'fa-language',
    color: '#34d399',       // emerald-400
    provider: 'Custom Model',
    description: 'Proprietary classifier identifies the spoken language in under 200 ms — mid-sentence.',
    detail: '100+ languages · 99.2 % accuracy · context-aware switching',
    stat: { value: '0.2s', label: 'detection' },
  },
  {
    id: 'reason',
    label: 'Reason',
    icon: 'fa-brain',
    color: '#f472b6',       // pink-400
    provider: 'GPT-5',
    description: 'LLM generates a context-aware response using the business knowledge base with built-in reasoning.',
    detail: 'Function calling · tool use · memory across turns · native reasoning',
    stat: { value: '~600ms', label: 'reasoning' },
  },
  {
    id: 'synthesize',
    label: 'Voice Out',
    icon: 'fa-waveform-lines',
    color: '#fbbf24',       // amber-400
    provider: 'ElevenLabs v3',
    description: 'Text-to-speech streams back in the detected language with expressive prosody and emotion control.',
    detail: 'Voice cloning · audio tags · multi-speaker · 70+ languages',
    stat: { value: '< 50ms', label: 'first byte' },
  },
]

// ─── Animated waveform bar ──────────────────────────────────────────────────

function WaveBar({ color, delay }: { color: string; delay: number }) {
  return (
    <motion.div
      className="w-[3px] rounded-full origin-bottom"
      style={{ backgroundColor: color }}
      animate={{
        height: ['12px', '28px', '8px', '22px', '14px'],
      }}
      transition={{
        duration: 1.6,
        repeat: Infinity,
        repeatType: 'mirror',
        ease: 'easeInOut',
        delay,
      }}
    />
  )
}

// ─── Main Component ─────────────────────────────────────────────────────────

export function FeaturesSection() {
  const [activeStep, setActiveStep] = useState(0)
  const [isAutoplaying, setIsAutoplaying] = useState(true)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Autoplay through the pipeline
  useEffect(() => {
    if (!isAutoplaying) return
    intervalRef.current = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % pipeline.length)
    }, 3200)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isAutoplaying])

  const handleStepClick = (index: number) => {
    setActiveStep(index)
    setIsAutoplaying(false)
    // Resume autoplay after 10 s of inactivity
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = setTimeout(() => setIsAutoplaying(true), 10_000) as any
  }

  const active = pipeline[activeStep]

  return (
    <section className="py-32 relative overflow-hidden bg-gray-950" id="features">
      {/* ── Background ──────────────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 grid-bg opacity-[0.04]" />
        {/* Subtle radial glow following active colour */}
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full blur-[160px] opacity-20 -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
          animate={{ backgroundColor: active.color }}
          transition={{ duration: 1 }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Header ────────────────────────────────────────────────── */}
        <div className="text-center mb-20">
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 border-[3px] border-purple-500/40 bg-purple-500/5 mb-6"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ ...SPRING, delay: 0.1 }}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500" />
            </span>
            <span className="text-sm font-mono text-purple-400 tracking-wide uppercase">
              Under the Hood
            </span>
          </motion.div>

          <motion.h2
            className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ ...SPRING, delay: 0.15 }}
          >
            One Call,{' '}
            <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-emerald-400 bg-clip-text text-transparent">
              Five Models
            </span>
          </motion.h2>

          <motion.p
            className="text-gray-500 max-w-2xl mx-auto text-lg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ ...SPRING, delay: 0.2 }}
          >
            Every phone call flows through a real-time AI pipeline — from raw audio to intelligent response in under 2 seconds.
          </motion.p>
        </div>

        {/* ── Pipeline Visualisation ────────────────────────────────── */}
        <div className="grid lg:grid-cols-[280px_1fr] gap-8 lg:gap-12 items-start">

          {/* Left: Step list */}
          <div>
            <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 no-scrollbar">
              {pipeline.map((step, i) => {
                const isActive = i === activeStep
                return (
                  <motion.button
                    key={step.id}
                    onClick={() => handleStepClick(i)}
                    className={`
                      relative flex items-center gap-3 px-4 py-3 text-left transition-all duration-300
                      border-[2px] min-w-[180px] lg:min-w-0
                      ${isActive
                        ? 'border-current bg-white/[0.06]'
                        : 'border-white/[0.06] hover:border-white/20 bg-transparent'}
                    `}
                    style={{ color: isActive ? step.color : undefined }}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ ...SPRING, delay: i * 0.07 }}
                  >
                    {/* Step number */}
                    <div
                      className={`
                        w-10 h-10 flex items-center justify-center text-sm font-bold font-mono
                        border-2 shrink-0 transition-all duration-300 z-10
                        ${isActive ? 'border-current bg-current/10' : 'border-white/10 text-white/30'}
                      `}
                      style={isActive ? { borderColor: step.color, color: step.color } : {}}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </div>

                    <div className="flex flex-col">
                      <span className={`text-sm font-bold tracking-wide transition-colors duration-300 ${isActive ? '' : 'text-white/50'}`}>
                        {step.label}
                      </span>
                      {step.provider && (
                        <span className={`text-[11px] font-mono transition-colors duration-300 ${isActive ? 'opacity-70' : 'text-white/20'}`}>
                          {step.provider}
                        </span>
                      )}
                    </div>
                  </motion.button>
                )
              })}
            </div>
          </div>

          {/* Right: Active step detail panel */}
          <div className="min-h-[520px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              className="border-[3px] bg-white/[0.02] relative overflow-hidden"
              style={{ borderColor: `${active.color}40` }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {/* Top accent bar */}
              <motion.div
                className="h-[3px] w-full"
                style={{ backgroundColor: active.color }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              />

              <div className="p-8 md:p-10">
                {/* Step header */}
                <div className="flex items-start justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div
                      className="w-14 h-14 border-[3px] flex items-center justify-center"
                      style={{ borderColor: active.color }}
                    >
                      <i className={`fas ${active.icon} text-2xl`} style={{ color: active.color }} />
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="text-2xl md:text-3xl font-bold text-white">{active.label}</h3>
                        {active.provider && (
                          <span
                            className="text-[11px] font-mono px-2 py-1 border"
                            style={{ borderColor: `${active.color}50`, color: active.color }}
                          >
                            {active.provider}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-400 mt-1 text-lg">{active.description}</p>
                    </div>
                  </div>
                </div>

                {/* Detail & waveform row */}
                <div className="flex flex-col md:flex-row gap-8">
                  {/* Technical detail card */}
                  <div className="flex-1 p-5 border-[2px] border-white/[0.06] bg-white/[0.02]">
                    <div className="flex items-center gap-2 mb-3">
                      <i className="fas fa-terminal text-xs" style={{ color: active.color }} />
                      <span className="text-[11px] font-mono text-white/40 uppercase tracking-widest">Specs</span>
                    </div>
                    <p className="text-white/70 font-mono text-sm leading-relaxed">{active.detail}</p>

                    {active.stat && (
                      <div className="mt-5 pt-5 border-t border-white/[0.06] flex items-baseline gap-3">
                        <span className="text-3xl font-bold font-mono" style={{ color: active.color }}>
                          {active.stat.value}
                        </span>
                        <span className="text-white/30 text-sm font-mono">{active.stat.label}</span>
                      </div>
                    )}
                  </div>

                  {/* Waveform visualization */}
                  <div className="flex-1 p-5 border-[2px] border-white/[0.06] bg-white/[0.02] flex flex-col items-center justify-center min-h-[140px]">
                    <div className="flex items-end gap-[3px] h-10 mb-4">
                      {Array.from({ length: 24 }).map((_, i) => (
                        <WaveBar key={i} color={active.color} delay={i * 0.06} />
                      ))}
                    </div>
                    <span className="text-[11px] font-mono text-white/20 uppercase tracking-widest">
                      Live Signal
                    </span>
                  </div>
                </div>

                {/* Pipeline position indicator */}
                <div className="mt-8 pt-6 border-t border-white/[0.06]">
                  <div className="flex items-center gap-1">
                    {pipeline.map((step, i) => (
                      <div key={step.id} className="flex items-center gap-1 flex-1">
                        <div className="flex-1 flex items-center">
                          <motion.div
                            className="h-1 w-full origin-left"
                            style={{
                              backgroundColor: i <= activeStep ? step.color : 'rgba(255,255,255,0.06)',
                            }}
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ duration: 0.3, delay: i * 0.05 }}
                          />
                        </div>
                        {i < pipeline.length - 1 && (
                          <i
                            className="fas fa-chevron-right text-[8px]"
                            style={{ color: i < activeStep ? pipeline[i + 1].color : 'rgba(255,255,255,0.1)' }}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="text-[10px] font-mono text-white/20">AUDIO IN</span>
                    <span className="text-[10px] font-mono text-white/20">RESPONSE OUT</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
          </div>
        </div>

        {/* ── Bottom Stats Row ──────────────────────────────────────── */}
        <motion.div
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ ...SPRING, delay: 0.3 }}
        >
          {[
            { value: '< 2s', label: 'End-to-end latency', icon: 'fa-bolt' },
            { value: '100+', label: 'Languages supported', icon: 'fa-globe' },
            { value: '99.9%', label: 'Uptime SLA', icon: 'fa-shield-halved' },
            { value: '5', label: 'AI models per call', icon: 'fa-layer-group' },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className="p-5 border-[2px] border-white/[0.06] bg-white/[0.02] text-center group hover:border-purple-500/30 transition-colors duration-300"
            >
              <i className={`fas ${stat.icon} text-purple-500/40 group-hover:text-purple-400 transition-colors text-sm mb-2 block`} />
              <div className="text-2xl md:text-3xl font-bold font-mono text-white mb-1">{stat.value}</div>
              <div className="text-[11px] font-mono text-white/30 uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
