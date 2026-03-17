import { useState, useEffect, useRef, useCallback } from 'react'

const LOCATIONS_DB = [
  {
    id: 'hyderabad',
    name: 'Hyderabad Periphery',
    region: 'Telangana, India',
    coords: [78.35, 17.45],
    zoom: 13,
    scenario: 'Urban expansion over peri-urban agricultural belt',
    data: [
      { year: 2019, veg: 81.2, urban: 12.1, water: 6.7, change_type: 'Stable agricultural zone', risk: 'stable' },
      { year: 2020, veg: 78.4, urban: 14.8, water: 6.8, change_type: 'Early peri-urban pressure', risk: 'stable' },
      { year: 2021, veg: 74.1, urban: 18.9, water: 6.9, change_type: 'Construction permits issued', risk: 'watch' },
      { year: 2022, veg: 67.0, urban: 21.0, water: 8.0, change_type: 'Residential plots cleared', risk: 'watch' },
      { year: 2023, veg: 55.3, urban: 33.4, water: 7.2, change_type: 'Mass construction phase', risk: 'critical' },
      { year: 2024, veg: 47.7, urban: 39.1, water: 5.6, change_type: 'Agri → Residential 67%', risk: 'critical' },
    ]
  },
  {
    id: 'bengaluru',
    name: 'Bengaluru Fringe',
    region: 'Karnataka, India',
    coords: [77.65, 12.85],
    zoom: 13,
    scenario: 'IT corridor expansion over lake catchment zones',
    data: [
      { year: 2019, veg: 72.4, urban: 15.3, water: 12.3, change_type: 'Lake buffer intact', risk: 'stable' },
      { year: 2020, veg: 70.1, urban: 17.8, water: 12.1, change_type: 'IT park plots approved', risk: 'stable' },
      { year: 2021, veg: 65.9, urban: 21.5, water: 12.6, change_type: 'Lake encroachment begins', risk: 'watch' },
      { year: 2022, veg: 59.3, urban: 27.9, water: 12.8, change_type: 'Road widening cuts greenery', risk: 'watch' },
      { year: 2023, veg: 50.8, urban: 35.6, water: 13.6, change_type: 'Stormwater lake shrinking', risk: 'critical' },
      { year: 2024, veg: 43.2, urban: 43.1, water: 13.7, change_type: 'Lake area reduced 28%', risk: 'critical' },
    ]
  },
  {
    id: 'mumbai',
    name: 'Mumbai Mangroves',
    region: 'Maharashtra, India',
    coords: [72.88, 19.08],
    zoom: 12,
    scenario: 'Coastal mangrove loss to port and industrial expansion',
    data: [
      { year: 2019, veg: 58.3, urban: 28.5, water: 13.2, change_type: 'Mangrove zones protected', risk: 'stable' },
      { year: 2020, veg: 57.1, urban: 29.4, water: 13.5, change_type: 'Coastal road survey', risk: 'stable' },
      { year: 2021, veg: 54.9, urban: 31.8, water: 13.3, change_type: 'Mangrove filling starts', risk: 'watch' },
      { year: 2022, veg: 51.4, urban: 35.2, water: 13.4, change_type: 'Port expansion approved', risk: 'watch' },
      { year: 2023, veg: 47.2, urban: 39.6, water: 13.2, change_type: 'Coastal buffer demolished', risk: 'critical' },
      { year: 2024, veg: 41.0, urban: 45.8, water: 13.2, change_type: 'Mangrove loss: 29.6%', risk: 'critical' },
    ]
  },
  {
    id: 'delhi',
    name: 'Delhi-NCR Greenbelt',
    region: 'Haryana / UP, India',
    coords: [77.25, 28.55],
    zoom: 12,
    scenario: 'Aravalli greenbelt under pressure from NCR sprawl',
    data: [
      { year: 2019, veg: 63.8, urban: 24.2, water: 8.2, change_type: 'Aravalli ridge stable', risk: 'stable' },
      { year: 2020, veg: 62.1, urban: 25.9, water: 8.3, change_type: 'Mining encroachment resumed', risk: 'stable' },
      { year: 2021, veg: 58.7, urban: 29.1, water: 8.4, change_type: 'Expressway cuts ridge', risk: 'watch' },
      { year: 2022, veg: 54.2, urban: 33.8, water: 8.2, change_type: 'Residential colony push', risk: 'watch' },
      { year: 2023, veg: 48.6, urban: 39.5, water: 7.9, change_type: 'Greenbelt fragmented', risk: 'critical' },
      { year: 2024, veg: 42.3, urban: 45.7, water: 7.8, change_type: 'Ridge loss: 33.7%', risk: 'critical' },
    ]
  }
]

// ─── Timeline Scrubber Component ───────────────────────────────────────────────
function TimelineScrubber({ activeYear, setActiveYear }) {
  const isPlaying = useRef(false)
  const timer = useRef(null)
  const [playState, setPlayState] = useState(false)

  const togglePlay = () => {
    if (isPlaying.current) {
      clearInterval(timer.current)
      isPlaying.current = false
      setPlayState(false)
    } else {
      if (activeYear === 5) setActiveYear(0)
      isPlaying.current = true
      setPlayState(true)
      timer.current = setInterval(() => {
        setActiveYear(prev => {
          if (prev >= 4) {
            clearInterval(timer.current)
            isPlaying.current = false
            setPlayState(false)
            return 5
          }
          return prev + 1
        })
      }, 1200)
    }
  }

  useEffect(() => {
    return () => clearInterval(timer.current)
  }, [])

  const YEARS = [2019, 2020, 2021, 2022, 2023, 2024]
  const fillPct = (activeYear / 5) * 100

  return (
    <div className="bg-[#162032] border border-white/8 rounded-xl px-5 py-3 flex items-center gap-4">
      {/* Play button */}
      <button
        onClick={togglePlay}
        className="w-8 h-8 rounded-full bg-[#1D9E75]/20 hover:bg-[#1D9E75]/30 flex items-center justify-center border border-[#1D9E75]/40 flex-shrink-0 transition-colors"
      >
        {playState ? (
          <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" className="text-[#1D9E75]">
            <rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" />
          </svg>
        ) : (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-[#1D9E75] translate-x-px">
            <path d="M5 3l14 9-14 9V3z" />
          </svg>
        )}
      </button>

      {/* Label + Slider */}
      <div className="flex-1 flex flex-col gap-1">
        {/* Year labels */}
        <div className="flex justify-between pointer-events-none">
          {YEARS.map((y, i) => (
            <span
              key={y}
              className={`text-[10px] font-bold leading-none transition-colors duration-300 ${
                i <= activeYear ? 'text-[#1D9E75]' : 'text-gray-600'
              }`}
            >
              {y}
            </span>
          ))}
        </div>

        {/* Track + thumb */}
        <div className="relative h-5 flex items-center">
          {/* Background track */}
          <div className="absolute inset-x-0 h-[4px] bg-white/10 rounded-full" />
          {/* Filled portion */}
          <div
            className="absolute left-0 h-[4px] bg-[#1D9E75] rounded-full pointer-events-none transition-all duration-200"
            style={{ width: `${fillPct}%` }}
          />
          {/* Tick marks */}
          {YEARS.map((_, i) => (
            <div
              key={i}
              className="absolute w-0.5 h-2 rounded-full -translate-x-px transition-colors duration-300"
              style={{
                left: `${(i / 5) * 100}%`,
                backgroundColor: i <= activeYear ? '#1D9E75' : 'rgba(255,255,255,0.2)'
              }}
            />
          ))}
          {/* The actual range input — transparent to let custom track show through */}
          <input
            type="range"
            min="0"
            max="5"
            step="1"
            value={activeYear}
            onChange={e => {
              const v = parseInt(e.target.value)
              setActiveYear(v)
              if (isPlaying.current) togglePlay()
            }}
            className="absolute inset-0 w-full opacity-0 cursor-pointer h-full"
            style={{ zIndex: 10 }}
          />
          {/* Custom thumb */}
          <div
            className="absolute w-4 h-4 rounded-full bg-white border-2 border-[#1D9E75] shadow-md pointer-events-none transition-all duration-200"
            style={{
              left: `calc(${fillPct}% - ${activeYear === 0 ? 0 : activeYear === 5 ? 16 : 8}px)`,
              zIndex: 9
            }}
          />
        </div>
      </div>

      {/* Current year display */}
      <div className="text-[#1D9E75] font-mono text-sm font-bold flex-shrink-0 w-12 text-right">
        {YEARS[activeYear]}
      </div>
    </div>
  )
}

// ─── Location Picker ──────────────────────────────────────────────────────────────
function LocationPicker({ activeLocIdx, setActiveLocIdx, setActiveYear }) {
  const [open, setOpen] = useState(false)
  const loc = LOCATIONS_DB[activeLocIdx]

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 bg-white/5 hover:bg-white/8 border border-white/15 hover:border-[#1D9E75]/40 rounded-lg px-3 py-1.5 transition-colors"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#1D9E75" strokeWidth="2">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
        <span className="text-white text-xs font-semibold">{loc.name}</span>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400">
          <path d="M6 9l6 6 6-6"/>
        </svg>
      </button>

      {open && (
        <div className="absolute top-full mt-1 left-0 z-50 bg-[#1a2e42] border border-white/15 rounded-xl shadow-2xl overflow-hidden min-w-[240px]">
          {LOCATIONS_DB.map((l, i) => (
            <button
              key={l.id}
              onClick={() => {
                setActiveLocIdx(i)
                setActiveYear(5)  // reset to latest year
                setOpen(false)
              }}
              className={`w-full text-left px-4 py-3 flex flex-col gap-0.5 transition-colors hover:bg-white/5 ${
                i === activeLocIdx ? 'bg-[#1D9E75]/10 border-l-2 border-[#1D9E75]' : ''
              }`}
            >
              <div className="text-white text-xs font-semibold">{l.name}</div>
              <div className="text-gray-400 text-[10px]">{l.region}</div>
              <div className="text-gray-500 text-[10px] italic mt-0.5">{l.scenario}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Segmentation SVG Map (200×200 grid) ──────────────────────────────────────
function SegmentationMap({ location, activeYear }) {
  const data = location.data[activeYear]
  const cells = []
  const rows = 20, cols = 20
  
  // Calculate exact number of cells for each category based on percentages
  const totalCells = rows * cols // 400
  const vegCells = Math.round((data.veg / 100) * totalCells)
  const urbanCells = Math.round((data.urban / 100) * totalCells)
  const waterCells = Math.round((data.water / 100) * totalCells)

  // Generate deterministic noise map
  const noiseVals = []
  const seed = (i, j) => Math.sin(i * 127 + j * 311) * 43758.5453
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      // Use year slightly in the seed so the blobs shift a tiny bit across years, 
      // but mostly keep the core landscape stable.
      noiseVals.push({ r: i, c: j, val: seed(i, j + activeYear * 0.1) })
    }
  }
  noiseVals.sort((a, b) => a.val - b.val) // sort to easily apply percentage thresholds

  // Distribute colors to the cells based on the sorted thresholds
  for (let k = 0; k < totalCells; k++) {
    const { r, c } = noiseVals[k]
    let fill = '#6b7280' // other (gray)
    if (k < waterCells) fill = '#3b82f6'
    else if (k < waterCells + urbanCells) fill = '#f97316'
    else if (k < waterCells + urbanCells + vegCells) fill = '#22c55e'
    cells.push({ x: c * 10, y: r * 10, fill })
  }

  return (
    <svg width="200" height="200" className="rounded-lg border border-white/10">
      <defs>
        <filter id="blur-sm"><feGaussianBlur stdDeviation="0.5"/></filter>
      </defs>
      {cells.map((c, idx) => (
        <rect key={idx} x={c.x} y={c.y} width="10" height="10" fill={c.fill} opacity="0.85" />
      ))}
      {/* grid overlay */}
      <rect x="0" y="0" width="200" height="200" fill="none" stroke="rgba(255,255,255,0.05)" />
    </svg>
  )
}

// ─── Sparkline SVG ─────────────────────────────────────────────────────────────
function Sparkline({ points, color, delay = 0 }) {
  const w = 80, h = 28
  const xs = points.map((_, i) => (i / (points.length - 1)) * w)
  const minP = Math.min(...points), maxP = Math.max(...points)
  const ys = points.map(p => h - ((p - minP) / (maxP - minP + 0.001)) * (h - 4) - 2)
  const d = xs.map((x, i) => `${i === 0 ? 'M' : 'L'}${x},${ys[i]}`).join(' ')
  const areaD = `${d} L${w},${h} L0,${h} Z`
  return (
    <svg width={w} height={h} className="inline-block">
      <defs>
        <linearGradient id={`grad-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3"/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <path d={areaD} fill={`url(#grad-${color})`} />
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="sparkline-path"
        style={{ animationDelay: `${delay}ms` }}
      />
    </svg>
  )
}

// ─── Animated Counter ──────────────────────────────────────────────────────────
function AnimatedNumber({ target, duration = 1500, prefix = '', suffix = '', decimals = 1, delay = 0 }) {
  const [current, setCurrent] = useState(0)
  const startTime = useRef(null)
  const rafRef = useRef(null)

  useEffect(() => {
    const timeout = setTimeout(() => {
      const animate = (ts) => {
        if (!startTime.current) startTime.current = ts
        const elapsed = ts - startTime.current
        const progress = Math.min(elapsed / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        setCurrent(target * eased)
        if (progress < 1) rafRef.current = requestAnimationFrame(animate)
      }
      rafRef.current = requestAnimationFrame(animate)
    }, delay)
    return () => {
      clearTimeout(timeout)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [target, duration, delay])

  const sign = target < 0 ? '' : (prefix === '+' ? '+' : '')
  return <span>{sign}{prefix !== '+' ? prefix : ''}{current.toFixed(decimals)}{suffix}</span>
}

// ─── Status Pill ───────────────────────────────────────────────────────────────
function StatusPill({ label }) {
  return (
    <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1 text-xs text-gray-300 font-medium">
      <span className="status-dot w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
      {label}
    </div>
  )
}

// ─── Satellite Swipe Slider (single MapLibre instance) ────────────────────────
function SatelliteSlider({ location, activeYear }) {
  const d = location.data[activeYear]
  const [sliderPos, setSliderPos] = useState(50)
  const [mapReady, setMapReady] = useState(false)
  const isDragging = useRef(false)
  const containerRef = useRef(null)
  const mapDivRef = useRef(null)
  const mapRef = useRef(null)
  const animFrame = useRef(null)

  // Satellite tile sources
  const ESRI_SAT = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'

  // Initialize MapLibre once container has real dimensions
  useEffect(() => {
    if (!mapDivRef.current || mapRef.current) return

    const initMap = () => {
      const ml = window.maplibregl
      if (!ml || !mapDivRef.current) return
      if (mapDivRef.current.offsetHeight < 10) return // not sized yet

      const map = new ml.Map({
        container: mapDivRef.current,
        style: {
          version: 8,
          sources: {
            sat: {
              type: 'raster',
              tiles: [ESRI_SAT],
              tileSize: 256,
              maxzoom: 18,
            }
          },
          layers: [{
            id: 'sat-layer',
            type: 'raster',
            source: 'sat',
            minzoom: 0,
            maxzoom: 22,
          }]
        },
        center: location.coords,
        zoom: location.zoom,
        interactive: false,
        attributionControl: false,
        preserveDrawingBuffer: true,
      })

      map.on('load', () => {
        map.resize()
        setMapReady(true)
      })

      // Resize observer
      if (typeof ResizeObserver !== 'undefined') {
        const ro = new ResizeObserver(() => {
          if (mapRef.current) mapRef.current.resize()
        })
        ro.observe(mapDivRef.current)
        mapRef.current = map
        mapRef.current._ro = ro
      } else {
        mapRef.current = map
      }
    }

    // Retry until maplibregl is loaded and container is sized
    const tryInit = () => {
      if (window.maplibregl && mapDivRef.current?.offsetHeight > 10) {
        initMap()
      } else {
        animFrame.current = requestAnimationFrame(tryInit)
      }
    }
    animFrame.current = requestAnimationFrame(tryInit)

    return () => {
      if (animFrame.current) cancelAnimationFrame(animFrame.current)
      if (mapRef.current) {
        if (mapRef.current._ro) mapRef.current._ro.disconnect()
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [])

  // Drag handlers
  const handleMove = useCallback((clientX) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const pct = Math.max(3, Math.min(97, ((clientX - rect.left) / rect.width) * 100))
    setSliderPos(pct)
  }, [])

  useEffect(() => {
    const onUp = () => { isDragging.current = false }
    const onMove = (e) => { if (isDragging.current) handleMove(e.clientX) }
    window.addEventListener('mouseup', onUp)
    window.addEventListener('mousemove', onMove)
    return () => {
      window.removeEventListener('mouseup', onUp)
      window.removeEventListener('mousemove', onMove)
    }
  }, [handleMove])

  // Fly to new location when it changes
  useEffect(() => {
    if (mapRef.current && mapRef.current._loaded) {
      mapRef.current.flyTo({
        center: location.coords,
        zoom: location.zoom,
        speed: 1.2,
        curve: 1.4,
        essential: true
      })
    }
  // Run when location coords change
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.id])

  // Segmentation mask SVG overlay — dynamically sized by timeline data
  const SegMask = ({ vedge, uedge, wedge }) => {
    // Compute approximate visual block extents for veg / urban / water  
    const vegH = vedge    // top portion = vegetation
    const urbanH = uedge  // mid/right = urban
    const waterH = wedge  // small blobs = water
    return (
      <svg
        className="seg-pulse absolute pointer-events-none"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{ inset: 0, width: '100%', height: '100%', zIndex: 10 }}
      >
        {/* Vegetation blobs — top-left cluster */}
        <ellipse cx="18" cy="22" rx={vegH * 0.22} ry={vegH * 0.27} fill="rgba(34,197,94,0.40)" />
        <ellipse cx="12" cy="68" rx={vegH * 0.14} ry={vegH * 0.19} fill="rgba(34,197,94,0.36)" />
        <ellipse cx="52" cy="12" rx={vegH * 0.12} ry={vegH * 0.10} fill="rgba(34,197,94,0.33)" />
        {/* Urban blobs — right cluster, grows with urban% */}
        <ellipse cx="62" cy="52" rx={urbanH * 0.28} ry={urbanH * 0.25} fill="rgba(249,115,22,0.40)" />
        <ellipse cx="82" cy="80" rx={urbanH * 0.18} ry={urbanH * 0.15} fill="rgba(249,115,22,0.37)" />
        <ellipse cx="42" cy="82" rx={urbanH * 0.12} ry={urbanH * 0.10} fill="rgba(249,115,22,0.33)" />
        {/* Water blobs — small */}
        <ellipse cx="87" cy="18" rx={waterH * 0.14} ry={waterH * 0.08} fill="rgba(59,130,246,0.43)" />
        <ellipse cx="28" cy="43" rx={waterH * 0.10} ry={waterH * 0.06} fill="rgba(59,130,246,0.38)" />
      </svg>
    )
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full rounded-lg overflow-hidden"
      style={{ flex: 1, minHeight: 0, cursor: 'ew-resize' }}
      onMouseDown={(e) => { isDragging.current = true; e.preventDefault() }}
      onTouchStart={() => { isDragging.current = true }}
      onTouchMove={(e) => { if (isDragging.current) handleMove(e.touches[0].clientX) }}
      onTouchEnd={() => { isDragging.current = false }}
    >
      {/* The map fills the whole panel */}
      <div
        ref={mapDivRef}
        className="absolute inset-0"
        style={{ background: '#0d1b2a' }}
      />

      {/* "Before" label side overlay (left of slider) — subtle dark tint */}
      <div
        className="absolute top-0 bottom-0 left-0 pointer-events-none"
        style={{ width: `${sliderPos}%`, background: 'rgba(0,0,0,0.18)', zIndex: 5, transition: 'width 0ms' }}
      />

      {/* Segmentation mask — only visible on right (current year) side */}
      <div
        className="absolute top-0 bottom-0 right-0 overflow-hidden pointer-events-none"
        style={{ width: `${100 - sliderPos}%`, zIndex: 6 }}
      >
        <div 
          className="absolute inset-y-0 right-0 pointer-events-none" 
          style={{ width: `${100 / (1 - sliderPos / 100)}%` }}
        >
          <SegMask vedge={d.veg} uedge={d.urban} wedge={d.water} />
        </div>
      </div>

      {/* Divider */}
      <div
        className="slider-divider"
        style={{ left: `${sliderPos}%`, zIndex: 20 }}
      >
        <div className="slider-handle">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0f1923" strokeWidth="2.5" strokeLinecap="round">
            <path d="M8 5l-7 7 7 7M16 5l7 7-7 7"/>
          </svg>
        </div>
      </div>

      <div className="absolute top-3 left-3 z-30 bg-black/70 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1 rounded-md border border-white/20 tracking-wide">
        Jan 2019
      </div>
      <div className="absolute top-3 right-3 z-30 bg-[#1D9E75]/90 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1 rounded-md border border-teal-400/40 tracking-wide transition-all duration-300">
        Jan {location.data[activeYear].year}
      </div>

      {/* Loading overlay */}
      {!mapReady && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-[#0d1b2a]">
          <div className="flex flex-col items-center gap-3">
            <svg className="animate-spin w-8 h-8 text-[#1D9E75]" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
            </svg>
            <span className="text-gray-400 text-sm">Loading satellite imagery...</span>
            <span className="text-gray-600 text-xs font-mono">Esri World Imagery · {location.coords[1].toFixed(2)}°N {location.coords[0].toFixed(2)}°E</span>
          </div>
        </div>
      )}
    </div>
  )
}


// ─── Center Panel — Change Detection Results ───────────────────────────────────
function ChangeDetectionPanel({ location, activeYear }) {
  const current = location.data[activeYear]
  const base = location.data[0]
  
  // Calculate deltas from 2019 baseline
  const vegDelta = current.veg - base.veg
  const urbanDelta = current.urban - base.urban
  const waterDelta = current.water - base.water

  // Historical sparklines up to the current year
  const getHistorical = (key) => location.data.slice(0, activeYear + 1).map(d => d[key])

  const stats = [
    {
      label: 'Vegetation Cover',
      value: current.veg,
      delta: vegDelta,
      suffix: '%',
      color: '#ef4444',
      textColor: 'text-red-400',
      borderColor: 'border-red-500/30',
      bgColor: 'bg-red-500/5',
      spark: getHistorical('veg'),
      trend: vegDelta < 0 ? '↓' : '—',
      delay: 200,
    },
    {
      label: 'Urban Expansion',
      value: current.urban,
      delta: urbanDelta,
      suffix: '%',
      color: '#f97316',
      textColor: 'text-orange-400',
      borderColor: 'border-orange-500/30',
      bgColor: 'bg-orange-500/5',
      spark: getHistorical('urban'),
      trend: urbanDelta > 0 ? '↑' : '—',
      delay: 400,
    },
    {
      label: 'Water Bodies',
      value: current.water,
      delta: waterDelta,
      suffix: '%',
      color: '#3b82f6',
      textColor: 'text-blue-400',
      borderColor: 'border-blue-500/30',
      bgColor: 'bg-blue-500/5',
      spark: getHistorical('water'),
      trend: waterDelta < 0 ? '↓' : waterDelta > 0 ? '↑' : '—',
      delay: 600,
    },
  ]

  const breakdowns = [
    { label: 'Agricultural → Residential', pct: 67, color: '#f97316' },
    { label: 'Agricultural → Industrial', pct: 22, color: '#a78bfa' },
    { label: 'Wetland → Urban', pct: 11, color: '#3b82f6' },
  ]

  const otherPct = Math.max(0, 100 - current.veg - current.urban - current.water).toFixed(1)

  // Risk Badge config
  const riskConfigs = {
    'stable': { bg: 'bg-[#1D9E75]', border: 'border-[#1D9E75]', text: 'STABLE — No intervention required', pulse: 'status-dot', icon: null },
    'watch': { bg: 'bg-[#BA7517]', border: 'border-[#BA7517]', text: 'WATCH — Monitor closely', pulse: 'pulse-amber', icon: null },
    'critical': { 
      bg: 'bg-[#A32D2D]', border: 'border-[#A32D2D]', text: 'CRITICAL — Immediate review required', pulse: 'pulse-red',
      icon: (
        <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[10px] border-b-white inline-block mr-1.5 align-middle animate-pulse" />
      )
    }
  }
  const risk = riskConfigs[current.risk]

  return (
    <div className="flex flex-col gap-3 h-full overflow-y-auto pr-1">
      
      {/* Risk Severity Badge */}
      <div className="flex flex-col gap-1.5 transition-all duration-300 relative">
        <div className={`w-full py-2.5 px-4 rounded-lg flex items-center gap-3 transition-colors duration-300 text-white shadow-lg ${risk.bg} ${risk.border} border shadow-black/20`}>
          <span className={`w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_8px_white] ${risk.pulse}`} />
          <div className="font-bold text-sm tracking-wide">
            {risk.icon}
            {risk.text}
          </div>
        </div>
        <div className="text-gray-400 text-xs italic px-1 opacity-80 break-words flex items-center justify-between">
          <span className="truncate">Current pattern: {current.change_type}</span>
          <span>Since 2019</span>
        </div>
      </div>

      {/* Confidence Score */}
      <div className="stat-card bg-gradient-to-br from-[#1D9E75]/20 to-[#1D9E75]/5 border border-[#1D9E75]/40 rounded-xl p-3 flex items-center justify-between teal-glow" style={{ animationDelay: '0ms' }}>
        <div>
          <div className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-0.5">Model Confidence</div>
          <div className="text-3xl font-bold text-white tracking-tight">
            <AnimatedNumber target={94.7} duration={1800} suffix="%" delay={100} />
          </div>
          <div className="text-xs text-[#1D9E75] mt-0.5">SegFormer-b2 · Sentinel-2</div>
        </div>
        <div className="w-14 h-14 rounded-full border-4 border-[#1D9E75]/50 flex items-center justify-center bg-[#1D9E75]/10">
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#1D9E75" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>

      {/* Stat Cards */}
      {stats.map((s, i) => (
        <div
          key={s.label}
          className={`stat-card ${s.bgColor} border ${s.borderColor} rounded-xl p-3`}
          style={{ animationDelay: `${s.delay}ms` }}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">{s.label}</span>
            <span className={`text-xs font-bold ${s.textColor}`}>{s.trend}</span>
          </div>
          <div className="flex items-end justify-between">
            <div className={`text-2xl font-bold ${s.textColor} tracking-tight`}>
              <AnimatedNumber
                target={s.value}
                prefix={s.value > 0 ? '+' : ''}
                suffix={s.suffix}
                delay={s.delay + 100}
              />
            </div>
            <Sparkline points={s.spark} color={s.color} delay={s.delay} />
          </div>
        </div>
      ))}

      {/* Segmentation Map */}
      <div className="stat-card bg-white/3 border border-white/10 rounded-xl p-3" style={{ animationDelay: '800ms' }}>
        <div className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-2">Segmentation Output</div>
        <div className="flex gap-3 items-start">
          <SegmentationMap location={location} activeYear={activeYear} />
          <div className="flex flex-col gap-1.5 text-xs mt-1">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-green-500 flex-shrink-0"/>
              <span className="text-gray-300">Vegetation <span className="text-green-400 font-semibold">{current.veg}%</span></span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-orange-500 flex-shrink-0"/>
              <span className="text-gray-300">Urban <span className="text-orange-400 font-semibold">{current.urban}%</span></span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-blue-500 flex-shrink-0"/>
              <span className="text-gray-300">Water <span className="text-blue-400 font-semibold">{current.water}%</span></span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-gray-500 flex-shrink-0"/>
              <span className="text-gray-300">Other <span className="text-gray-400 font-semibold">{otherPct}%</span></span>
            </div>
          </div>
        </div>
      </div>

      {/* Change Type Breakdown */}
      <div className="stat-card bg-white/3 border border-white/10 rounded-xl p-3" style={{ animationDelay: '1000ms' }}>
        <div className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-2">Change Type Breakdown</div>
        <div className="flex flex-col gap-2">
          {breakdowns.map((b, i) => (
            <div key={b.label}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-300 truncate pr-2">{b.label}</span>
                <span className="font-semibold text-white flex-shrink-0">{b.pct}%</span>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bar-fill"
                  style={{
                    width: `${b.pct}%`,
                    backgroundColor: b.color,
                    animationDelay: `${1000 + i * 200}ms`,
                    animationDuration: '1s',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Right Panel — Chat ─────────────────────────────────────────────────────────
function ChatPanel({ apiKey, location, activeYear }) {
  const [useCase, setUseCase] = useState('Urban planning')
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `I've analyzed the ${location.name} region (${location.coords[1].toFixed(2)}°N, ${location.coords[0].toFixed(2)}°E). Switch tabs to filter my analysis lens, or ask a custom question below.`,
    }
  ])
  const [input, setInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  // Reset messages when location changes
  useEffect(() => {
    setMessages([{
      role: 'assistant',
      content: `I've analyzed the ${location.name} region. This shows ${location.scenario}. Switch analysis tabs or ask a question below.`,
    }])
  }, [location.id])

  const USE_CASES = {
    'Urban planning': {
      chips: ["What's driving the vegetation loss?", "Is this area zoned for construction?", "What infrastructure is at risk?"],
      prompt: "You are an urban planning AI analyst. Answer questions from the perspective of a city planning department. Focus on zoning, infrastructure capacity, housing density, and municipal resource planning. Be specific and cite the numbers."
    },
    'Disaster response': {
      chips: ["Is this area flood-prone?", "Which zones need evacuation routes?", "How has water body coverage changed?"],
      prompt: "You are a disaster risk AI analyst. Answer questions from the perspective of an emergency management agency. Focus on flood risk (water body shrinkage + urban runoff), heat island effects, evacuation infrastructure gaps, and early warning thresholds."
    },
    'Environment': {
      chips: ["What's the carbon sequestration impact?", "Are protected species habitats at risk?", "What reforestation is feasible?"],
      prompt: "You are an environmental impact AI analyst. Answer questions from the perspective of an environmental scientist. Focus on biodiversity loss, carbon sequestration reduction, soil degradation, wetland loss, and restoration feasibility."
    }
  }

  const handleModeSwitch = (mode) => {
    if (mode === useCase || isStreaming) return
    setUseCase(mode)
    setMessages([{ 
      role: 'assistant', 
      content: `*Switched to ${mode} analysis mode. Ask a question or select a prompt above.*`,
      isSystem: true 
    }])
  }

  const current = location.data[activeYear]
  const base = location.data[0]
  const SYSTEM_PROMPT = `${USE_CASES[useCase].prompt} Location: ${location.name}, ${location.region}. Scenario: ${location.scenario}. Data (${current.year}): vegetation=${current.veg}% (was ${base.veg}% in 2019), urban=${current.urban}% (was ${base.urban}%), water=${current.water}%. Risk=${current.risk.toUpperCase()}.`


  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })

  useEffect(scrollToBottom, [messages])

  const sendMessage = async (text) => {
    if (!text.trim() || isStreaming) return
    const userMsg = { role: 'user', content: text }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsStreaming(true)

    // Add empty assistant message to stream into
    setMessages(prev => [...prev, { role: 'assistant', content: '', streaming: true }])

    try {
      const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:streamGenerateContent?alt=sse&key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: [
            ...messages.filter(m => !m.streaming && !m.isSystem).map(m => ({ 
              role: m.role === 'assistant' ? 'model' : 'user', 
              parts: [{ text: m.content }] 
            })),
            { role: 'user', parts: [{ text }] }
          ]
        })
      })

      if (!resp.ok) {
        const errText = await resp.text()
        throw new Error(`API error ${resp.status}: ${errText}`)
      }

      const reader = resp.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop()

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const dataStr = line.slice(6).trim()
          if (!dataStr) continue
          try {
            const json = JSON.parse(dataStr)
            if (json.candidates?.[0]?.content?.parts?.[0]?.text) {
              const delta = json.candidates[0].content.parts[0].text
              setMessages(prev => {
                const updated = [...prev]
                const last = updated[updated.length - 1]
                if (last.streaming) updated[updated.length - 1] = { ...last, content: last.content + delta }
                return updated
              })
            }
          } catch {}
        }
      }

      setMessages(prev => {
        const updated = [...prev]
        const last = updated[updated.length - 1]
        if (last.streaming) updated[updated.length - 1] = { ...last, streaming: false }
        return updated
      })
    } catch (err) {
      setMessages(prev => {
        const updated = [...prev]
        const last = updated[updated.length - 1]
        if (last.streaming) {
          updated[updated.length - 1] = {
            ...last,
            content: `⚠️ Error: ${err.message}`,
            streaming: false,
            error: true,
          }
        }
        return updated
      })
    } finally {
      setIsStreaming(false)
    }
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-2.5 pr-1 pb-2">
        {messages.map((msg, i) => (
          <div key={i} className={`chat-bubble flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <div className="w-6 h-6 rounded-full bg-[#1D9E75]/20 border border-[#1D9E75]/40 flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#1D9E75" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </div>
            )}
            <div
              className={`max-w-[85%] rounded-xl px-3 py-2 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-[#1D9E75]/25 border border-[#1D9E75]/40 text-white rounded-tr-sm'
                  : msg.error
                  ? 'bg-red-500/10 border border-red-500/30 text-red-300 rounded-tl-sm'
                  : 'bg-white/5 border border-white/10 text-gray-200 rounded-tl-sm'
              }`}
            >
              {msg.content || (msg.streaming && (
                <span className="flex gap-1 py-0.5">
                  <span className="loading-dot w-1.5 h-1.5 rounded-full bg-[#1D9E75] inline-block"/>
                  <span className="loading-dot w-1.5 h-1.5 rounded-full bg-[#1D9E75] inline-block"/>
                  <span className="loading-dot w-1.5 h-1.5 rounded-full bg-[#1D9E75] inline-block"/>
                </span>
              ))}
              {msg.streaming && msg.content && (
                <span className="inline-block w-0.5 h-4 bg-[#1D9E75] ml-0.5 animate-pulse align-middle" />
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Use Case Tabs */}
      <div className="flex items-center gap-1.5 border-b border-white/10 pb-2 mb-2 px-1">
        {Object.keys(USE_CASES).map(mode => (
          <button
            key={mode}
            onClick={() => handleModeSwitch(mode)}
            disabled={isStreaming}
            className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1.5 rounded-full transition-colors ${
              (useCase === mode)
                ? 'bg-[#1D9E75] text-white'
                : 'bg-white/5 border border-white/10 text-gray-400 hover:text-gray-200 hover:border-white/20'
            }`}
          >
            {mode}
          </button>
        ))}
      </div>

      {/* Chips */}
      {!isStreaming && messages.length <= 1 && (
        <div className="flex flex-wrap gap-1.5 mb-2 px-1">
          {USE_CASES[useCase].chips.map(chip => (
            <button
              key={chip}
              onClick={() => sendMessage(chip)}
              className="text-xs bg-white/5 hover:bg-[#1D9E75]/20 border border-white/15 hover:border-[#1D9E75]/50 text-gray-300 hover:text-white rounded-full px-2.5 py-1 transition-all duration-200 cursor-pointer text-left leading-tight"
            >
              {chip}
            </button>
          ))}
        </div>
      )}
      {/* Input */}
      <div className="flex gap-2 mt-auto pt-2 border-t border-white/10">
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage(input)}
          placeholder="Ask about this region..."
          disabled={isStreaming}
          className="flex-1 bg-white/5 border border-white/15 focus:border-[#1D9E75]/60 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 outline-none transition-colors duration-200 disabled:opacity-50"
        />
        <button
          onClick={() => sendMessage(input)}
          disabled={isStreaming || !input.trim()}
          className="bg-[#1D9E75] hover:bg-[#178f68] disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg px-3 py-2 transition-colors duration-200 flex items-center justify-center"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
          </svg>
        </button>
      </div>
    </div>
  )
}

// ─── API Key Modal ──────────────────────────────────────────────────────────────
function ApiKeyModal({ onSubmit }) {
  const [key, setKey] = useState('')
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#162032] border border-white/15 rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#1D9E75]/20 border border-[#1D9E75]/40 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1D9E75" strokeWidth="2">
              <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l1.5 1.5-1.5-1.5M15.5 7.5L17 6"/>
            </svg>
          </div>
          <div>
            <h2 className="text-white font-bold text-lg">Connect to Gemini</h2>
            <p className="text-gray-400 text-xs">Enter your Gemini API key to enable AI analysis</p>
          </div>
        </div>
        <input
          type="password"
          value={key}
          onChange={e => setKey(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && key.startsWith('AIza') && onSubmit(key)}
          placeholder="AIzaSy..."
          className="w-full bg-white/5 border border-white/15 focus:border-[#1D9E75]/60 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 outline-none mb-4 font-mono"
          autoFocus
        />
        <div className="flex gap-2">
          <button
            onClick={() => onSubmit(key)}
            disabled={!key.startsWith('AIza')}
            className="flex-1 bg-[#1D9E75] hover:bg-[#178f68] disabled:opacity-40 text-white rounded-lg py-2.5 font-semibold text-sm transition-colors"
          >
            Connect
          </button>
          <button
            onClick={() => onSubmit('demo-mode')}
            className="px-4 bg-white/5 hover:bg-white/10 border border-white/15 text-gray-300 rounded-lg py-2.5 text-sm transition-colors"
          >
            Demo Mode
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-3 text-center">
          Key stored in session only · Never persisted · <span className="text-[#1D9E75]">ai.google.dev</span>
        </p>
      </div>
    </div>
  )
}

// ─── Main App ───────────────────────────────────────────────────────────────────
export default function App() {
  const [apiKey, setApiKey] = useState(window.GEMINI_API_KEY || null)
  const [showKeyModal, setShowKeyModal] = useState(!window.GEMINI_API_KEY)
  const [activeYear, setActiveYear] = useState(5) // Default to index 5 (2024)
  const [activeLocIdx, setActiveLocIdx] = useState(0) // Hyderabad default
  const [isExporting, setIsExporting] = useState(false)
  const [exportComplete, setExportComplete] = useState(false)

  const activeLoc = LOCATIONS_DB[activeLocIdx]

  const handleApiKey = (key) => {
    setApiKey(key)
    setShowKeyModal(false)
  }

  const handleExport = async () => {
    if (!apiKey || apiKey === 'demo-mode') {
      alert("Please connect a real API key to generate reports.");
      setShowKeyModal(true);
      return;
    }
    
    setIsExporting(true)
    const current = activeLoc.data[activeYear]
    const deltaVeg = (current.veg - activeLoc.data[0].veg).toFixed(1)
    
    try {
      // 1. Generate text with LLM
      const startMs = Date.now()
      const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: "You are an environmental intelligence analyst. Write a formal 3-paragraph executive summary report (approximately 180 words) for a satellite change detection analysis. Use formal report language. Paragraph 1: describe the land-use changes detected. Paragraph 2: assess environmental and urban planning implications. Paragraph 3: provide 2 specific actionable recommendations. Do not use markdown. Use plain paragraphs only." }] },
          contents: [{ 
            role: 'user', 
            parts: [{ text: `Region: ${activeLoc.name}, ${activeLoc.region}. Scenario: ${activeLoc.scenario}. Analysis period: Jan 2019 – Jan ${current.year}. Current metrics: Vegetation: ${current.veg}%, Urban: ${current.urban}%, Water: ${current.water}%. Risk level: ${current.risk.toUpperCase()}. Change pattern: ${current.change_type}. Vegetation total loss since 2019: ${deltaVeg}%.` }]
          }],
          generationConfig: { maxOutputTokens: 300 }
        })
      })

      if (!resp.ok) throw new Error("API call failed")
      const data = await resp.json()
      const reportText = data.candidates[0].content.parts[0].text

      // 2. Load jsPDF dynamically if needed
      if (!window.jspdf) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script')
          script.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"
          script.onload = resolve
          script.onerror = reject
          document.head.appendChild(script)
        })
      }
      
      const { jsPDF } = window.jspdf
      const doc = new jsPDF()

      // 3. Build the PDF
      doc.setFont("helvetica", "bold")
      doc.setFontSize(18)
      doc.setTextColor(15, 25, 35) // dark navy
      doc.text("TerraLens Intelligence Report", 20, 25)
      
      doc.setFont("helvetica", "normal")
      doc.setFontSize(11)
      doc.setTextColor(100, 116, 139)
      doc.text("Peri-urban Hyderabad — Satellite Change Analysis", 20, 32)
      
      doc.text(`March 2026`, 190, 32, { align: "right" })
      
      doc.setDrawColor(200, 200, 200)
      doc.line(20, 38, 190, 38)
      
      // Risk Badge in PDF
      const riskColors = {
        'stable': [29, 158, 117], // #1D9E75
        'watch': [186, 117, 23],  // #BA7517
        'critical': [163, 45, 45] // #A32D2D
      }
      const badgeColor = riskColors[current.risk]
      doc.setFillColor(...badgeColor)
      doc.rect(20, 45, 60, 8, "F")
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(10)
      doc.setFont("helvetica", "bold")
      doc.text(`RISK STATUS: ${current.risk.toUpperCase()}`, 25, 50.5)

      // Stats Table
      doc.setTextColor(15, 25, 35)
      doc.setFont("helvetica", "bold")
      doc.text("Key Metrics (vs 2019 baseline)", 20, 65)
      
      doc.setFont("helvetica", "normal")
      // Row 1
      doc.setFillColor(245, 245, 245)
      doc.rect(20, 70, 170, 8, "F")
      doc.text("Vegetation Cover", 25, 75.5)
      doc.text(`${current.veg}% (${deltaVeg}%)`, 185, 75.5, { align: "right" })
      // Row 2
      doc.text("Urban Expansion", 25, 83.5)
      doc.text(`${current.urban}% (+${(current.urban - TIMELINE_DATA[0].urban).toFixed(1)}%)`, 185, 83.5, { align: "right" })
      // Row 3
      doc.setFillColor(245, 245, 245)
      doc.rect(20, 88, 170, 8, "F")
      doc.text("Water Bodies", 25, 93.5)
      doc.text(`${current.water}%`, 185, 93.5, { align: "right" })

      // Report Text
      doc.setFontSize(10)
      doc.setTextColor(50, 50, 50)
      doc.text("Executive Summary", 20, 110)
      
      const splitText = doc.splitTextToSize(reportText, 170)
      doc.setFont("helvetica", "normal")
      doc.text(splitText, 20, 118, { lineHeightFactor: 1.5, align: "justify" })

      // Footer
      doc.setFontSize(8)
      doc.setTextColor(150, 150, 150)
      doc.text("Generated by TerraLens AI · Powered by Sentinel-2 + SegFormer-b2", 105, 280, { align: "center" })

      doc.save(`terralens-report-${current.year}.pdf`)
      
      setExportComplete(true)
      setTimeout(() => setExportComplete(false), 2000)

    } catch (e) {
      console.error(e)
      alert("Error generating report.")
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-[#0f1923] overflow-hidden">
      {/* Modal - disabled since key is hardcoded */}
      {/* {showKeyModal && <ApiKeyModal onSubmit={handleApiKey} />} */}

      {/* ── Top Bar ── */}
      <header className="flex-shrink-0 bg-[#0c1520] border-b border-white/8 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#1D9E75] to-[#0ea5e9] flex items-center justify-center shadow-lg">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10"/>
                <path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20"/>
              </svg>
            </div>
            <div>
              <div className="text-white font-bold text-lg tracking-tight leading-none">TerraLens</div>
              <div className="text-gray-400 text-[10px] font-medium tracking-widest uppercase leading-none mt-0.5">AI Satellite Change Intelligence</div>
            </div>
          </div>
          {/* Location Picker */}
          <LocationPicker activeLocIdx={activeLocIdx} setActiveLocIdx={setActiveLocIdx} setActiveYear={setActiveYear} />
        </div>

        {/* Status pills & Export */}
        <div className="flex items-center gap-2">
          <StatusPill label="Satellite feed live" />
          <StatusPill label="AI Vision active" />
          <StatusPill label={apiKey && apiKey !== 'demo-mode' ? 'AI Chat connected' : 'AI demo mode'} />
          
          {/* Export Button */}
          <button
            onClick={handleExport}
            disabled={isExporting || exportComplete}
            className={`ml-2 flex items-center gap-2 text-xs font-semibold border rounded-lg px-3 py-1.5 transition-colors ${
              exportComplete 
                ? 'bg-green-500/10 border-green-500/40 text-green-400' 
                : 'bg-transparent border-[#1D9E75]/40 text-white hover:bg-[#1D9E75]/10'
            }`}
          >
            {isExporting ? (
              <>
                <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                  <path d="M4 12a8 8 0 018-8v8H4" stroke="currentColor" strokeWidth="4" className="opacity-75" />
                </svg>
                Generating...
              </>
            ) : exportComplete ? (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Report Ready
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                </svg>
                Export PDF
              </>
            )}
          </button>
        </div>
      </header>

      {/* ── Panels ── */}
      <div className="px-3 pt-3 flex-shrink-0">
        <TimelineScrubber activeYear={activeYear} setActiveYear={setActiveYear} />
      </div>
      
      <div className="flex-1 grid grid-cols-[1fr_320px_300px] gap-3 p-3 min-h-0 overflow-hidden">

        {/* Left — Satellite View */}
        <div className="bg-[#162032] border border-white/8 rounded-xl overflow-hidden flex flex-col">
          <div className="px-4 py-2.5 border-b border-white/8 flex items-center justify-between flex-shrink-0">
            <div>
              <div className="text-white font-semibold text-sm">Satellite View</div>
              <div className="text-gray-400 text-xs">Drag to compare temporal layers</div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 font-mono">Zoom 13 · Esri World Imagery</span>
            </div>
          </div>
          <div className="flex-1 p-2 min-h-0 flex flex-col">
            <SatelliteSlider location={activeLoc} activeYear={activeYear} />
          </div>

          {/* Bottom metadata bar */}
          <div className="px-4 py-2 border-t border-white/8 flex items-center gap-4 flex-shrink-0">
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <span className="w-2 h-2 rounded-sm bg-green-500"/>Vegetation
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <span className="w-2 h-2 rounded-sm bg-orange-500"/>Urban
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <span className="w-2 h-2 rounded-sm bg-blue-500"/>Water
            </div>
            <div className="ml-auto text-xs text-gray-500 font-mono">
              Δt = 24 months
            </div>
          </div>
        </div>

        {/* Center — Change Detection Results */}
        <div className="bg-[#162032] border border-white/8 rounded-xl overflow-hidden flex flex-col">
          <div className="px-4 py-2.5 border-b border-white/8 flex-shrink-0">
            <div className="text-white font-semibold text-sm">Change Detection Results</div>
            <div className="text-gray-400 text-xs">Jan 2019 → Jan {activeLoc.data[activeYear].year} · {activeLoc.name}· Δ analysis</div>
          </div>
          <div className="flex-1 p-3 min-h-0 overflow-hidden">
            <ChangeDetectionPanel location={activeLoc} activeYear={activeYear} />
          </div>
        </div>

        {/* Right — Chat */}
        <div className="bg-[#162032] border border-white/8 rounded-xl overflow-hidden flex flex-col">
          <div className="px-4 py-2.5 border-b border-white/8 flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-md bg-[#1D9E75]/20 border border-[#1D9E75]/40 flex items-center justify-center flex-shrink-0">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#1D9E75" strokeWidth="2.5">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                </svg>
              </div>
              <div>
                <div className="text-white font-semibold text-sm">Ask About This Area</div>
                <div className="text-gray-400 text-xs">Powered by AI Analysis</div>
              </div>
            </div>
          </div>
          <div className="flex-1 p-3 min-h-0 overflow-hidden">
            {(apiKey && apiKey !== 'demo-mode') ? (
              <ChatPanel apiKey={apiKey} location={activeLoc} activeYear={activeYear} />
            ) : (
              <div className="flex flex-col h-full">
                <div className="flex-1 flex flex-col gap-2.5">
                  {/* Static demo messages */}
                  <div className="chat-bubble flex justify-start">
                    <div className="w-6 h-6 rounded-full bg-[#1D9E75]/20 border border-[#1D9E75]/40 flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#1D9E75" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                    </div>
                    <div className="max-w-[85%] bg-white/5 border border-white/10 text-gray-200 rounded-xl rounded-tl-sm px-3 py-2 text-sm leading-relaxed">
                      I've analyzed the Hyderabad peri-urban region (17.45°N, 78.35°E). Significant land-use changes detected between Jan 2022–Jan 2024. What would you like to know?
                    </div>
                  </div>

                  <div className="chat-bubble flex justify-end">
                    <div className="max-w-[85%] bg-[#1D9E75]/25 border border-[#1D9E75]/40 text-white rounded-xl rounded-tr-sm px-3 py-2 text-sm">
                      What's driving the vegetation loss?
                    </div>
                  </div>

                  <div className="chat-bubble flex justify-start">
                    <div className="w-6 h-6 rounded-full bg-[#1D9E75]/20 border border-[#1D9E75]/40 flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#1D9E75" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                    </div>
                    <div className="max-w-[85%] bg-white/5 border border-white/10 text-gray-200 rounded-xl rounded-tl-sm px-3 py-2 text-sm leading-relaxed">
                      The 19.3% vegetation loss is primarily driven by rapid residential construction activity — 67% of land converted went agricultural-to-residential. The remaining 22% was agricultural-to-industrial. <span className="text-[#1D9E75] font-medium">Recommendation: Immediate environmental impact assessment required for the 11% wetland encroachment zones.</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-2 mt-2">
                  {["What's driving the vegetation loss?","Is this change reversible?","Flag for environmental review"].map(chip => (
                    <button key={chip} onClick={() => setShowKeyModal(true)}
                      className="text-xs bg-white/5 hover:bg-[#1D9E75]/20 border border-white/15 hover:border-[#1D9E75]/50 text-gray-300 hover:text-white rounded-full px-2.5 py-1 transition-all duration-200">
                      {chip}
                    </button>
                  ))}
                </div>

                <div className="flex gap-2 pt-2 border-t border-white/10">
                  <button onClick={() => setShowKeyModal(true)} className="flex-1 bg-[#1D9E75]/10 border border-[#1D9E75]/30 hover:bg-[#1D9E75]/20 text-[#1D9E75] rounded-lg px-3 py-2 text-sm transition-colors font-medium">
                    Connect API Key to chat →
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="flex-shrink-0 px-6 py-1.5 border-t border-white/5 flex items-center justify-between">
        <div className="text-gray-600 text-xs font-mono">
          TerraLens v2.4.1 · ESA Copernicus · AI Vision Model · mIoU 0.847
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-600">
          <span>Last inference: 2 min ago</span>
          <span className="text-[#1D9E75]">● Processing queue: 0</span>
        </div>
      </footer>
    </div>
  )
}
