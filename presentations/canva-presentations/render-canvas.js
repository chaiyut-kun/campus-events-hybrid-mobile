const { chromium } = require('playwright-chromium');
const fs = require('fs');
const path = require('path');

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Silicon Topology — Master Canvas</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@300;400;500;600&display=swap');

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      width: 3840px;
      height: 2160px;
      background: #0d0e11;
      color: #fbf8fc;
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      overflow: hidden;
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 120px 140px;
      -webkit-font-smoothing: antialiased;
    }

    /* Ambient chromatic washes */
    .glow-emerald {
      position: absolute;
      top: -200px;
      left: -200px;
      width: 1400px;
      height: 1400px;
      background: radial-gradient(circle, rgba(0, 109, 62, 0.22) 0%, rgba(29, 191, 115, 0.08) 40%, transparent 70%);
      filter: blur(140px);
      pointer-events: none;
      z-index: 0;
    }

    .glow-violet {
      position: absolute;
      bottom: -300px;
      right: -200px;
      width: 1600px;
      height: 1600px;
      background: radial-gradient(circle, rgba(115, 46, 228, 0.20) 0%, rgba(98, 85, 149, 0.07) 45%, transparent 70%);
      filter: blur(160px);
      pointer-events: none;
      z-index: 0;
    }

    .glow-center {
      position: absolute;
      top: 40%;
      left: 45%;
      width: 900px;
      height: 900px;
      background: radial-gradient(circle, rgba(110, 253, 170, 0.06) 0%, transparent 60%);
      filter: blur(120px);
      pointer-events: none;
      z-index: 0;
    }

    /* Precision Grid Background */
    .grid-overlay {
      position: absolute;
      inset: 0;
      background-image: 
        linear-gradient(to right, rgba(255, 255, 255, 0.035) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(255, 255, 255, 0.035) 1px, transparent 1px);
      background-size: 80px 80px;
      pointer-events: none;
      z-index: 1;
    }

    .subgrid-overlay {
      position: absolute;
      inset: 0;
      background-image: 
        linear-gradient(to right, rgba(255, 255, 255, 0.08) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(255, 255, 255, 0.08) 1px, transparent 1px);
      background-size: 400px 400px;
      pointer-events: none;
      z-index: 1;
    }

    /* Top Navigation / Manifest Header */
    .header-bar {
      position: relative;
      z-index: 10;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      padding-bottom: 40px;
    }

    .brand-cluster {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .sys-badge {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      padding: 8px 18px;
      background: rgba(0, 109, 62, 0.16);
      border: 1px solid rgba(29, 191, 115, 0.35);
      border-radius: 999px;
      width: fit-content;
    }

    .sys-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #1dbf73;
      box-shadow: 0 0 16px #1dbf73;
    }

    .sys-badge span {
      font-family: 'JetBrains Mono', monospace;
      font-size: 14px;
      font-weight: 600;
      color: #6efdaa;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }

    .title-main {
      font-size: 64px;
      font-weight: 800;
      letter-spacing: -0.03em;
      line-height: 1.05;
      background: linear-gradient(135deg, #ffffff 30%, #bbcabd 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .title-sub {
      font-size: 22px;
      font-weight: 400;
      color: #8b998f;
      letter-spacing: -0.01em;
    }

    .meta-telemetry {
      display: flex;
      gap: 60px;
      font-family: 'JetBrains Mono', monospace;
      text-align: right;
    }

    .telemetry-item {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .telemetry-label {
      font-size: 13px;
      color: #6c7b6f;
      text-transform: uppercase;
      letter-spacing: 0.14em;
    }

    .telemetry-value {
      font-size: 18px;
      font-weight: 600;
      color: #e4e1e6;
    }

    /* Core Visual Composition Stage */
    .composition-stage {
      position: relative;
      z-index: 10;
      display: grid;
      grid-template-columns: 1080px 1fr 900px;
      gap: 80px;
      align-items: center;
      flex: 1;
      margin: 60px 0;
    }

    /* Column A: Architectural Mobile Device Monolith */
    .monolith-col {
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
    }

    .device-chassis {
      width: 780px;
      height: 1380px;
      background: #18191d;
      border-radius: 96px;
      border: 8px solid rgba(255, 255, 255, 0.14);
      box-shadow: 
        0 40px 100px -20px rgba(0, 0, 0, 0.8),
        0 0 0 1px rgba(255, 255, 255, 0.05),
        inset 0 0 60px rgba(0, 0, 0, 0.5);
      position: relative;
      overflow: hidden;
      padding: 16px;
      display: flex;
      flex-direction: column;
    }

    .device-island {
      position: absolute;
      top: 36px;
      left: 50%;
      transform: translateX(-50%);
      width: 240px;
      height: 48px;
      background: #000000;
      border-radius: 24px;
      z-index: 50;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 24px;
      border: 1px solid rgba(255, 255, 255, 0.08);
    }

    .island-lens {
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: #111422;
      border: 2px solid #202438;
    }

    .island-indicator {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #1dbf73;
      box-shadow: 0 0 10px #1dbf73;
    }

    .device-screen {
      flex: 1;
      width: 100%;
      background: #0f1014;
      border-radius: 80px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      padding: 110px 48px 48px;
      gap: 32px;
      position: relative;
    }

    .screen-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }

    .screen-header-title {
      font-size: 38px;
      font-weight: 800;
      color: #ffffff;
      letter-spacing: -0.02em;
    }

    .screen-header-tag {
      font-family: 'JetBrains Mono', monospace;
      font-size: 15px;
      color: #1dbf73;
      background: rgba(0, 109, 62, 0.2);
      padding: 6px 14px;
      border-radius: 8px;
      border: 1px solid rgba(29, 191, 115, 0.4);
    }

    .screen-card-hero {
      background: linear-gradient(145deg, #1d2127 0%, #15171b 100%);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 36px;
      padding: 40px;
      display: flex;
      flex-direction: column;
      gap: 24px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.4);
    }

    .card-label {
      font-family: 'JetBrains Mono', monospace;
      font-size: 14px;
      color: #732ee4;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      font-weight: 600;
    }

    .card-heading {
      font-size: 28px;
      font-weight: 700;
      color: #ffffff;
      line-height: 1.25;
    }

    .card-body {
      font-size: 18px;
      color: #a2aba5;
      line-height: 1.5;
    }

    .card-specs {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
      margin-top: 8px;
    }

    .spec-pill {
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 18px;
      padding: 16px 20px;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .spec-k {
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      color: #6c7b6f;
      text-transform: uppercase;
    }

    .spec-v {
      font-size: 16px;
      font-weight: 600;
      color: #6efdaa;
    }

    .screen-nav-bar {
      margin-top: auto;
      height: 84px;
      background: #18191f;
      border-radius: 28px;
      border: 1px solid rgba(255, 255, 255, 0.08);
      display: flex;
      justify-content: space-around;
      align-items: center;
      padding: 0 24px;
    }

    .nav-icon-node {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
    }

    .nav-glyph {
      width: 24px;
      height: 24px;
      border-radius: 6px;
      background: rgba(255, 255, 255, 0.15);
    }

    .nav-icon-node.active .nav-glyph {
      background: #1dbf73;
      box-shadow: 0 0 14px #1dbf73;
    }

    .nav-text {
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      color: #6c7b6f;
      text-transform: uppercase;
    }

    .nav-icon-node.active .nav-text {
      color: #6efdaa;
      font-weight: 600;
    }

    /* Column B: Central Topology Geometry & Vector Pathways */
    .topology-col {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: 100%;
      position: relative;
    }

    .circuit-svg {
      width: 100%;
      height: 100%;
      max-height: 1300px;
    }

    /* Column C: Milestone Index & Architectural Specs */
    .milestones-col {
      display: flex;
      flex-direction: column;
      gap: 28px;
    }

    .column-title-box {
      border-left: 4px solid #1dbf73;
      padding-left: 24px;
      margin-bottom: 8px;
    }

    .col-headline {
      font-size: 28px;
      font-weight: 700;
      color: #ffffff;
      letter-spacing: -0.01em;
    }

    .col-subtext {
      font-family: 'JetBrains Mono', monospace;
      font-size: 14px;
      color: #6c7b6f;
      margin-top: 4px;
    }

    .node-item {
      background: rgba(255, 255, 255, 0.025);
      border: 1px solid rgba(255, 255, 255, 0.07);
      border-radius: 24px;
      padding: 24px 32px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      transition: all 0.3s ease;
      position: relative;
    }

    .node-item.completed {
      border-color: rgba(29, 191, 115, 0.3);
      background: rgba(0, 109, 62, 0.08);
    }

    .node-item.roadmap {
      border-color: rgba(115, 46, 228, 0.3);
      background: rgba(115, 46, 228, 0.05);
    }

    .node-identity {
      display: flex;
      align-items: center;
      gap: 24px;
    }

    .node-id-circle {
      width: 52px;
      height: 52px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'JetBrains Mono', monospace;
      font-size: 18px;
      font-weight: 700;
    }

    .node-item.completed .node-id-circle {
      background: rgba(29, 191, 115, 0.2);
      color: #6efdaa;
      border: 1px solid #1dbf73;
    }

    .node-item.roadmap .node-id-circle {
      background: rgba(115, 46, 228, 0.2);
      color: #d2bbff;
      border: 1px solid #732ee4;
    }

    .node-content-cluster {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .node-name {
      font-size: 20px;
      font-weight: 600;
      color: #ffffff;
    }

    .node-annotation {
      font-family: 'JetBrains Mono', monospace;
      font-size: 13px;
      color: #8b998f;
    }

    .node-state-badge {
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      padding: 6px 14px;
      border-radius: 999px;
    }

    .node-item.completed .node-state-badge {
      background: rgba(29, 191, 115, 0.15);
      color: #6efdaa;
      border: 1px solid rgba(29, 191, 115, 0.4);
    }

    .node-item.roadmap .node-state-badge {
      background: rgba(115, 46, 228, 0.15);
      color: #d2bbff;
      border: 1px solid rgba(115, 46, 228, 0.4);
    }

    /* Bottom Architectural Footer */
    .footer-bar {
      position: relative;
      z-index: 10;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      padding-top: 36px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-family: 'JetBrains Mono', monospace;
      font-size: 14px;
      color: #6c7b6f;
    }

    .footer-coords {
      display: flex;
      gap: 36px;
    }

    .coord-item {
      display: flex;
      gap: 10px;
    }

    .coord-item strong {
      color: #bbcabd;
      font-weight: 500;
    }

    .footer-stamp {
      color: #6efdaa;
      letter-spacing: 0.08em;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .stamp-badge {
      width: 8px;
      height: 8px;
      background: #6efdaa;
      border-radius: 2px;
    }
  </style>
</head>
<body>
  <div class="glow-emerald"></div>
  <div class="glow-violet"></div>
  <div class="glow-center"></div>
  <div class="grid-overlay"></div>
  <div class="subgrid-overlay"></div>

  <!-- Header -->
  <header class="header-bar">
    <div class="brand-cluster">
      <div class="sys-badge">
        <div class="sys-dot"></div>
        <span>Silicon Topology :: Architectural Movement</span>
      </div>
      <h1 class="title-main">Campus Events — Kinetic Progression</h1>
      <p class="title-sub">Structural evolution of reactive handheld systems across discrete laboratory vectors</p>
    </div>

    <div class="meta-telemetry">
      <div class="telemetry-item">
        <span class="telemetry-label">Runtime Engine</span>
        <span class="telemetry-value">Expo SDK 57 // RN 0.86</span>
      </div>
      <div class="telemetry-item">
        <span class="telemetry-label">Chromatic Standard</span>
        <span class="telemetry-value">Emerald / Obsidian / Violet</span>
      </div>
      <div class="telemetry-item">
        <span class="telemetry-label">Geometric Matrix</span>
        <span class="telemetry-value">3840 × 2160 UHD // 16:9</span>
      </div>
    </div>
  </header>

  <!-- Core Composition -->
  <main class="composition-stage">
    <!-- Monolith Handheld Chassis -->
    <div class="monolith-col">
      <div class="device-chassis">
        <div class="device-island">
          <div class="island-lens"></div>
          <div class="island-indicator"></div>
        </div>

        <div class="device-screen">
          <div class="screen-header">
            <div>
              <div style="font-family: 'JetBrains Mono', monospace; font-size: 13px; color: #1dbf73; text-transform: uppercase; margin-bottom: 4px;">Viewport Active</div>
              <div class="screen-header-title">Campus Events</div>
            </div>
            <div class="screen-header-tag">NODE_LIVE</div>
          </div>

          <div class="screen-card-hero">
            <div class="card-label">Modular Core • Lab 01–04</div>
            <div class="card-heading">Reactive Component Mesh & Dynamic File Routes</div>
            <div class="card-body">Handheld experience calibrated for high-density campus telemetry. Strict type adherence, safe-area padding containment, and file-based route resolution.</div>
            <div class="card-specs">
              <div class="spec-pill">
                <span class="spec-k">Routing Engine</span>
                <span class="spec-v">Expo Router v4</span>
              </div>
              <div class="spec-pill">
                <span class="spec-k">State Contract</span>
                <span class="spec-v">Declarative Hook Props</span>
              </div>
              <div class="spec-pill">
                <span class="spec-k">Layout Vector</span>
                <span class="spec-v">Flexbox Safe Insets</span>
              </div>
              <div class="spec-pill">
                <span class="spec-k">Sync Cadence</span>
                <span class="spec-v">Fast Refresh Live</span>
              </div>
            </div>
          </div>

          <div class="screen-card-hero" style="border-color: rgba(115, 46, 228, 0.25); background: linear-gradient(145deg, #1b1725 0%, #121019 100%);">
            <div class="card-label" style="color: #b895ff;">Planned Frontier • Labs 05–11</div>
            <div class="card-heading" style="font-size: 22px;">Offline Persistence & Ambient Dispatch</div>
            <div class="card-body" style="font-size: 16px;">Biometric secure storage, hardware geolocation positioning, and scheduled platform push notifications.</div>
          </div>

          <div class="screen-nav-bar">
            <div class="nav-icon-node active">
              <div class="nav-glyph"></div>
              <span class="nav-text">Events</span>
            </div>
            <div class="nav-icon-node">
              <div class="nav-glyph"></div>
              <span class="nav-text">Saved</span>
            </div>
            <div class="nav-icon-node">
              <div class="nav-glyph"></div>
              <span class="nav-text">Profile</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Center Topology SVG Vectors -->
    <div class="topology-col">
      <svg class="circuit-svg" viewBox="0 0 800 1200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <!-- Concentric Radial Field -->
        <circle cx="400" cy="600" r="380" stroke="rgba(255,255,255,0.04)" stroke-width="2" stroke-dasharray="8 8" />
        <circle cx="400" cy="600" r="280" stroke="rgba(29, 191, 115, 0.12)" stroke-width="2" />
        <circle cx="400" cy="600" r="180" stroke="rgba(115, 46, 228, 0.15)" stroke-width="2" stroke-dasharray="12 6" />
        <circle cx="400" cy="600" r="80" stroke="rgba(110, 253, 170, 0.4)" stroke-width="3" />

        <!-- Center Node Core -->
        <circle cx="400" cy="600" r="28" fill="#006d3e" />
        <circle cx="400" cy="600" r="14" fill="#6efdaa" />

        <!-- Architectural Axis Lines -->
        <line x1="400" y1="60" x2="400" y2="1140" stroke="rgba(255,255,255,0.06)" stroke-width="2" />
        <line x1="40" y1="600" x2="760" y2="600" stroke="rgba(255,255,255,0.06)" stroke-width="2" />

        <!-- Diagonal Vector Highways -->
        <path d="M 120 240 L 400 600 L 680 240" stroke="url(#emeraldGrad)" stroke-width="3" stroke-linecap="round" fill="none" />
        <path d="M 120 960 L 400 600 L 680 960" stroke="url(#violetGrad)" stroke-width="3" stroke-linecap="round" fill="none" />

        <!-- Topological Nodes -->
        <g transform="translate(120, 240)">
          <circle r="18" fill="#18191d" stroke="#1dbf73" stroke-width="3" />
          <circle r="6" fill="#6efdaa" />
          <text x="-40" y="-30" fill="#6efdaa" font-family="'JetBrains Mono', monospace" font-size="14" font-weight="600">NODE_01: RUNTIME</text>
        </g>

        <g transform="translate(680, 240)">
          <circle r="18" fill="#18191d" stroke="#1dbf73" stroke-width="3" />
          <circle r="6" fill="#6efdaa" />
          <text x="-40" y="-30" fill="#6efdaa" font-family="'JetBrains Mono', monospace" font-size="14" font-weight="600">NODE_04: ROUTER</text>
        </g>

        <g transform="translate(120, 960)">
          <circle r="18" fill="#18191d" stroke="#732ee4" stroke-width="3" />
          <circle r="6" fill="#d2bbff" />
          <text x="-40" y="44" fill="#d2bbff" font-family="'JetBrains Mono', monospace" font-size="14" font-weight="600">NODE_07: STORAGE</text>
        </g>

        <g transform="translate(680, 960)">
          <circle r="18" fill="#18191d" stroke="#732ee4" stroke-width="3" />
          <circle r="6" fill="#d2bbff" />
          <text x="-40" y="44" fill="#d2bbff" font-family="'JetBrains Mono', monospace" font-size="14" font-weight="600">NODE_11: DISPATCH</text>
        </g>

        <!-- Orbital Coordinate Graticules -->
        <defs>
          <linearGradient id="emeraldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#1dbf73" />
            <stop offset="50%" stop-color="#6efdaa" />
            <stop offset="100%" stop-color="#1dbf73" />
          </linearGradient>
          <linearGradient id="violetGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#732ee4" />
            <stop offset="50%" stop-color="#b895ff" />
            <stop offset="100%" stop-color="#732ee4" />
          </linearGradient>
        </defs>
      </svg>
    </div>

    <!-- Milestones Column -->
    <div class="milestones-col">
      <div class="column-title-box">
        <div class="col-headline">System Hierarchy & Node Matrix</div>
        <div class="col-subtext">Sequential progression from foundation to ambient platform integration</div>
      </div>

      <div class="node-item completed">
        <div class="node-identity">
          <div class="node-id-circle">01</div>
          <div class="node-content-cluster">
            <div class="node-name">Mobile Foundation & Scaffold</div>
            <div class="node-annotation">Expo 57 • React 19 • TypeScript Strict</div>
          </div>
        </div>
        <div class="node-state-badge">VERIFIED</div>
      </div>

      <div class="node-item completed">
        <div class="node-identity">
          <div class="node-id-circle">02</div>
          <div class="node-content-cluster">
            <div class="node-name">Component Hierarchy & Events</div>
            <div class="node-annotation">EventCards • useState • Props Contracts</div>
          </div>
        </div>
        <div class="node-state-badge">VERIFIED</div>
      </div>

      <div class="node-item completed">
        <div class="node-identity">
          <div class="node-id-circle">03</div>
          <div class="node-content-cluster">
            <div class="node-name">Responsive Viewport & Styling</div>
            <div class="node-annotation">Flexbox • SafeAreaContext • Surface Tokens</div>
          </div>
        </div>
        <div class="node-state-badge">VERIFIED</div>
      </div>

      <div class="node-item completed">
        <div class="node-identity">
          <div class="node-id-circle">04</div>
          <div class="node-content-cluster">
            <div class="node-name">Expo Router & Dynamic Links</div>
            <div class="node-annotation">Bottom Tabs • [id].tsx Routes • +not-found</div>
          </div>
        </div>
        <div class="node-state-badge">VERIFIED</div>
      </div>

      <div class="node-item roadmap">
        <div class="node-identity">
          <div class="node-id-circle">05–07</div>
          <div class="node-content-cluster">
            <div class="node-name">Forms, REST APIs & Storage</div>
            <div class="node-annotation">Context API • Tri-State UI • AsyncStorage</div>
          </div>
        </div>
        <div class="node-state-badge">PLANNED</div>
      </div>

      <div class="node-item roadmap">
        <div class="node-identity">
          <div class="node-id-circle">08–11</div>
          <div class="node-content-cluster">
            <div class="node-name">Security, Camera & Geolocation</div>
            <div class="node-annotation">SecureStore • MapView • Notifications</div>
          </div>
        </div>
        <div class="node-state-badge">MILESTONE</div>
      </div>
    </div>
  </main>

  <!-- Footer -->
  <footer class="footer-bar">
    <div class="footer-coords">
      <div class="coord-item"><span>PROJECTION:</span> <strong>EUCLIDEAN_16:9</strong></div>
      <div class="coord-item"><span>CALIBRATION:</span> <strong>DCI-P3 / SRGB</strong></div>
      <div class="coord-item"><span>TOPOLOGY:</span> <strong>EXP-57-STABLE</strong></div>
    </div>

    <div class="footer-stamp">
      <div class="stamp-badge"></div>
      <span>SILICON TOPOLOGY // CRAFTED WITH MASTER-LEVEL DISCIPLINE</span>
    </div>
  </footer>
</body>
</html>`;

async function main() {
  console.log('Launching headless browser...');
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 3840, height: 2160 },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();

  console.log('Loading Silicon Topology HTML canvas...');
  await page.setContent(htmlContent, { waitUntil: 'networkidle' });

  const outputDir = path.join(__dirname);
  const pngPath = path.join(outputDir, 'canvas-artwork.png');
  const pdfPath = path.join(outputDir, 'canvas-artwork.pdf');

  console.log('Rendering 4K PNG canvas artwork...');
  await page.screenshot({
    path: pngPath,
    fullPage: true,
  });
  console.log(`PNG written to: ${pngPath}`);

  console.log('Rendering vector PDF canvas artwork...');
  await page.pdf({
    path: pdfPath,
    width: '3840px',
    height: '2160px',
    printBackground: true,
    pageRanges: '1',
  });
  console.log(`PDF written to: ${pdfPath}`);

  await browser.close();
  console.log('Canvas rendering completed successfully.');
}

main().catch((err) => {
  console.error('Error rendering canvas:', err);
  process.exit(1);
});
