export interface DomainEntity {
  id: string;
  name: string;
  category: string;
  metric: string;
  status: string;
  timestamp: string;
}

export interface DomainProfile {
  key: string;
  domainTitle: string;
  domainSubtitle: string;
  entityNameSingular: string;
  entityNamePlural: string;
  addButtonLabel: string;
  addModalTitle: string;
  addNamePlaceholder: string;
  categories: string[];
  kpis: [
    { title: string; value: string; change: string; positive: boolean },
    { title: string; value: string; change: string; positive: boolean },
    { title: string; value: string; change: string; positive: boolean },
    { title: string; value: string; change: string; positive: boolean }
  ];
  chart: {
    title: string;
    subtitle: string;
    label: string;
    labels: string[];
    data: number[];
  };
  tableColumns: [string, string, string, string, string, string];
  defaultEntities: DomainEntity[];
}

export interface DomainAppConfig {
  projectName?: string;
  category?: string;
  summary?: string;
  features?: Array<{ name: string; description: string; priority: string }>;
}

export function detectDomainProfile(config: DomainAppConfig): DomainProfile {
  const safeName = config.projectName || "Enterprise Solution";
  const haystack = [
    config.projectName || "",
    config.category || "",
    config.summary || "",
    ...(config.features?.map(f => `${f.name} ${f.description}`) || [])
  ].join(" ").toLowerCase();

  // 1. Mesh / Networking / IoT / Edge / Wireless / P2P
  if (
    haystack.includes("mesh") ||
    haystack.includes("network") ||
    haystack.includes("routing") ||
    haystack.includes("peer") ||
    haystack.includes("p2p") ||
    haystack.includes("node") ||
    haystack.includes("lora") ||
    haystack.includes("packet") ||
    haystack.includes("gateway") ||
    haystack.includes("topology") ||
    haystack.includes("iot")
  ) {
    const featureEntities: DomainEntity[] = (config.features && config.features.length > 0)
      ? config.features.slice(0, 4).map((f, i) => ({
          id: `NODE-0${i + 1}`,
          name: f.name,
          category: i === 0 ? "Gateway" : i % 2 === 1 ? "Relay" : "Edge Node",
          metric: `${-40 - i * 11} dBm • ${(1.2 + i * 0.9).toFixed(1)}ms`,
          status: "Online",
          timestamp: "Active"
        }))
      : [
          { id: "NODE-GW-01", name: "Primary Gateway Uplink (Fiber Backhaul)", category: "Gateway", metric: "-42 dBm • 1.1ms", status: "Online", timestamp: "Just now" },
          { id: "NODE-RL-02", name: "Multi-Hop Dynamic Relay (802.11s)", category: "Relay", metric: "-54 dBm • 2.4ms", status: "Online", timestamp: "2m ago" },
          { id: "NODE-ED-03", name: "Edge Sensor Cluster Mesh Bridge", category: "Edge Node", metric: "-62 dBm • 3.8ms", status: "Online", timestamp: "4m ago" },
          { id: "NODE-RL-04", name: "Zero-Trust Encrypted P2P Tunnel", category: "Relay", metric: "-48 dBm • 1.8ms", status: "Online", timestamp: "7m ago" }
        ];

    return {
      key: "mesh",
      domainTitle: `${safeName} — Mesh Topology & Node Routing`,
      domainSubtitle: "Real-time Node Discovery, Dynamic Peer Links & Packet Routing",
      entityNameSingular: "Mesh Node",
      entityNamePlural: "Mesh Nodes",
      addButtonLabel: "+ Deploy Node",
      addModalTitle: "Deploy New Mesh Node",
      addNamePlaceholder: "e.g. Edge Relay Node Zeta-09",
      categories: ["Gateway", "Relay", "Edge Node", "Sensor Bridge"],
      kpis: [
        { title: "Active Mesh Nodes", value: "28 Online", change: "↑ 4 Relay / 2 Gateway peers", positive: true },
        { title: "Avg Hop Latency", value: "3.2 ms", change: "Sub-5ms multi-hop SLA", positive: true },
        { title: "Packet Delivery SLA", value: "99.98%", change: "Zero packet loss detected", positive: true },
        { title: "Mesh Bandwidth", value: "2.4 Gbps", change: "Dynamic channel bonding", positive: true }
      ],
      chart: {
        title: "Dynamic Mesh Routing & Peer Traffic (Mbps)",
        subtitle: "Real-time Packet Routing Distribution Across Channels",
        label: "Throughput (Mbps)",
        labels: ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00", "Now"],
        data: [420, 680, 1150, 1890, 1640, 2120, 2400]
      },
      tableColumns: ["Node ID", "Node Label & Scope", "Node Role", "Signal & Latency", "Status", "Actions"],
      defaultEntities: featureEntities
    };
  }

  // 2. Healthcare / Hospital / Clinic / Medical / Patient / Triage
  if (
    haystack.includes("health") ||
    haystack.includes("clinic") ||
    haystack.includes("patient") ||
    haystack.includes("hospital") ||
    haystack.includes("medical") ||
    haystack.includes("doctor") ||
    haystack.includes("triage") ||
    haystack.includes("ward") ||
    haystack.includes("care")
  ) {
    const featureEntities: DomainEntity[] = (config.features && config.features.length > 0)
      ? config.features.slice(0, 4).map((f, i) => ({
          id: `MED-10${i + 1}`,
          name: f.name,
          category: i === 0 ? "Emergency Triage" : i === 1 ? "Inpatient Ward" : "Outpatient Clinic",
          metric: i === 0 ? "Priority 1 (Critical)" : i === 1 ? "Priority 2 (Urgent)" : "Priority 3 (Stable)",
          status: "Admitted",
          timestamp: "Just now"
        }))
      : [
          { id: "MED-101", name: "Sarah Jenkins — Acute Respiratory Monitoring", category: "ICU Ward 3B", metric: "Priority 1 (Critical)", status: "Admitted", timestamp: "Just now" },
          { id: "MED-102", name: "Marcus Vance — Orthopedic Trauma Post-Op", category: "Surgical Ward 2", metric: "Priority 2 (Urgent)", status: "Admitted", timestamp: "12m ago" },
          { id: "MED-103", name: "Elena Rostova — Pediatric Cardiology Consult", category: "Pediatrics", metric: "Priority 3 (Stable)", status: "Scheduled", timestamp: "25m ago" },
          { id: "MED-104", name: "David Chen — Outpatient Physical Therapy", category: "Rehab Center", metric: "Priority 3 (Stable)", status: "Completed", timestamp: "1h ago" }
        ];

    return {
      key: "healthcare",
      domainTitle: `${safeName} — Clinical Patient & Ward Management`,
      domainSubtitle: "Emergency Triage, Bed Allocation & Clinical Protocol Workflows",
      entityNameSingular: "Patient Record",
      entityNamePlural: "Patients",
      addButtonLabel: "+ Admit Patient",
      addModalTitle: "Register / Admit Patient",
      addNamePlaceholder: "e.g. John Doe — Cardiology Observation",
      categories: ["ICU Ward", "Surgical Ward", "Pediatrics", "Emergency Triage"],
      kpis: [
        { title: "Admitted Patients", value: "148 In Care", change: "↑ +12 admitted today", positive: true },
        { title: "Bed Occupancy Rate", value: "84.2%", change: "16 ICU beds currently available", positive: true },
        { title: "Avg Triage Wait", value: "8.4 min", change: "Within Golden Hour clinical target", positive: true },
        { title: "Protocol Adherence", value: "100.0%", change: "Zero compliance exceptions", positive: true }
      ],
      chart: {
        title: "Daily Patient Inflow & Emergency Triage Velocity",
        subtitle: "Admissions and Clinical Consultations Across Wards",
        label: "Patients / Hour",
        labels: ["06:00", "09:00", "12:00", "15:00", "18:00", "21:00", "Now"],
        data: [14, 38, 52, 44, 61, 32, 28]
      },
      tableColumns: ["Patient ID", "Patient Name & Condition", "Assigned Ward", "Triage Priority", "Status", "Actions"],
      defaultEntities: featureEntities
    };
  }

  // 3. E-Commerce / Store / Marketplace / Retail / Inventory
  if (
    haystack.includes("shop") ||
    haystack.includes("commerce") ||
    haystack.includes("store") ||
    haystack.includes("cart") ||
    haystack.includes("order") ||
    haystack.includes("product") ||
    haystack.includes("inventory") ||
    haystack.includes("catalog") ||
    haystack.includes("retail")
  ) {
    const featureEntities: DomainEntity[] = (config.features && config.features.length > 0)
      ? config.features.slice(0, 4).map((f, i) => ({
          id: `SKU-00${i + 1}`,
          name: f.name,
          category: i % 2 === 0 ? "Electronics" : "Accessories",
          metric: `$${(99 + i * 65).toFixed(2)} • ${35 - i * 7} in stock`,
          status: "In Stock",
          timestamp: "Updated"
        }))
      : [
          { id: "SKU-PRO-01", name: "Titanium Wireless ANC Headphones Pro", category: "Audio", metric: "$299.00 • 48 in stock", status: "In Stock", timestamp: "Just now" },
          { id: "SKU-PRO-02", name: "Ergonomic Lumbar Desk Chair V2", category: "Furniture", metric: "$449.00 • 12 in stock", status: "In Stock", timestamp: "5m ago" },
          { id: "SKU-PRO-03", name: "Ultra-Fast 140W GaN Charging Dock", category: "Accessories", metric: "$89.00 • 3 in stock", status: "Low Stock", timestamp: "15m ago" },
          { id: "SKU-PRO-04", name: "4K OLED 144Hz Professional Monitor", category: "Displays", metric: "$799.00 • 24 in stock", status: "In Stock", timestamp: "40m ago" }
        ];

    return {
      key: "ecommerce",
      domainTitle: `${safeName} — Product Catalog & Order Fulfillment`,
      domainSubtitle: "Live Inventory Tracking, SKU Management & Order Processing",
      entityNameSingular: "Product SKU",
      entityNamePlural: "Products",
      addButtonLabel: "+ Add Product",
      addModalTitle: "Add New Product SKU",
      addNamePlaceholder: "e.g. Wireless Ergonomic Keyboard",
      categories: ["Audio", "Displays", "Furniture", "Accessories"],
      kpis: [
        { title: "Gross Sales", value: "$94,320", change: "↑ +22.4% vs last cycle", positive: true },
        { title: "Pending Orders", value: "184 In Queue", change: "42 priority express dispatches", positive: true },
        { title: "Low Stock Alerts", value: "4 SKUs", change: "Automated reorder triggered", positive: false },
        { title: "Fulfillment SLA", value: "99.4%", change: "Avg 1.2 day dispatch speed", positive: true }
      ],
      chart: {
        title: "Weekly Revenue Velocity & Order Volume ($)",
        subtitle: "Gross Merchandise Value Across Storefronts",
        label: "Revenue ($k)",
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        data: [12.4, 18.2, 14.8, 22.5, 31.0, 26.4, 38.9]
      },
      tableColumns: ["SKU ID", "Product Title & Spec", "Category", "Price & Inventory", "Status", "Actions"],
      defaultEntities: featureEntities
    };
  }

  // 4. FinTech / Banking / Payment / Crypto / Invoicing / Ledger
  if (
    haystack.includes("fintech") ||
    haystack.includes("bank") ||
    haystack.includes("pay") ||
    haystack.includes("crypto") ||
    haystack.includes("invoice") ||
    haystack.includes("ledger") ||
    haystack.includes("wallet") ||
    haystack.includes("trading") ||
    haystack.includes("money") ||
    haystack.includes("settlement")
  ) {
    const featureEntities: DomainEntity[] = (config.features && config.features.length > 0)
      ? config.features.slice(0, 4).map((f, i) => ({
          id: `TX-10${i + 1}`,
          name: f.name,
          category: i % 2 === 0 ? "Instant Settlement" : "ACH Clearing",
          metric: `$${(12500 * (i + 1)).toLocaleString()}.00`,
          status: "Settled",
          timestamp: "Verified"
        }))
      : [
          { id: "TX-FED-101", name: "Acme Corp — Automated Payroll Settlement", category: "FedNow Rail", metric: "$342,500.00", status: "Settled", timestamp: "Just now" },
          { id: "TX-SEP-102", name: "Globex Europe — Cross-Border Liquidity Transfer", category: "SEPA Instant", metric: "€185,000.00", status: "Settled", timestamp: "3m ago" },
          { id: "TX-SWF-103", name: "Stripe Connect — Merchant Escrow Sweep", category: "Escrow Rail", metric: "$94,220.00", status: "Processing", timestamp: "8m ago" },
          { id: "TX-INT-104", name: "Vanguard Partners — Capital Call Clearing", category: "Wire Rail", metric: "$510,000.00", status: "Settled", timestamp: "15m ago" }
        ];

    return {
      key: "fintech",
      domainTitle: `${safeName} — Treasury & Ledger Operations`,
      domainSubtitle: "Real-time Settlement Rails, Anti-Fraud Shield & Transaction Auditing",
      entityNameSingular: "Transaction",
      entityNamePlural: "Transactions",
      addButtonLabel: "+ New Transfer",
      addModalTitle: "Initiate Settlement Transfer",
      addNamePlaceholder: "e.g. Acme Corp Treasury Transfer",
      categories: ["FedNow Rail", "SEPA Instant", "Escrow Rail", "Wire Rail"],
      kpis: [
        { title: "Settled Volume", value: "$2.84M", change: "↑ 24-hour liquidity turnover", positive: true },
        { title: "Settled Transfers", value: "14,290", change: "99.98% clean settlement", positive: true },
        { title: "Instant Rail SLA", value: "1.4 sec", change: "Sub-2 second finality", positive: true },
        { title: "AML Risk Score", value: "0.01%", change: "Zero sanctions or fraud flags", positive: true }
      ],
      chart: {
        title: "Settlement Volume & Liquidity Velocity ($k)",
        subtitle: "Gross Settled Value Across Cross-Border Payment Rails",
        label: "Settled ($k)",
        labels: ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00", "Now"],
        data: [180, 240, 620, 1140, 950, 1480, 1820]
      },
      tableColumns: ["Transfer ID", "Counterparty & Memo", "Payment Rail", "Settled Amount", "Status", "Actions"],
      defaultEntities: featureEntities
    };
  }

  // 5. Tasks / Sprint / Agile / Project / Kanban / Jira
  if (
    haystack.includes("task") ||
    haystack.includes("sprint") ||
    haystack.includes("agile") ||
    haystack.includes("kanban") ||
    haystack.includes("jira") ||
    haystack.includes("workflow") ||
    haystack.includes("project")
  ) {
    const featureEntities: DomainEntity[] = (config.features && config.features.length > 0)
      ? config.features.slice(0, 4).map((f, i) => ({
          id: `TSK-0${i + 1}`,
          name: f.name,
          category: i === 0 ? "Backend Core" : i === 1 ? "Frontend UI" : "DevOps Infra",
          metric: `${5 + i * 3} pts • ${f.priority} Priority`,
          status: i === 0 ? "In Progress" : i === 1 ? "In Review" : "Done",
          timestamp: "Assigned"
        }))
      : [
          { id: "TSK-SPR-01", name: "Implement OAuth2 PKCE Token Refresh Flow", category: "Auth Squad", metric: "8 pts • High", status: "In Progress", timestamp: "Just now" },
          { id: "TSK-SPR-02", name: "Optimize PostgreSQL Composite Indexing", category: "DB Infra", metric: "5 pts • High", status: "In Review", timestamp: "10m ago" },
          { id: "TSK-SPR-03", name: "Build Interactive Drag-and-Drop Kanban View", category: "Frontend", metric: "13 pts • Medium", status: "In Progress", timestamp: "25m ago" },
          { id: "TSK-SPR-04", name: "Configure Container Ingress Rate Limiting", category: "DevOps", metric: "3 pts • Low", status: "Done", timestamp: "1h ago" }
        ];

    return {
      key: "project",
      domainTitle: `${safeName} — Sprint Backlog & Deliverables Hub`,
      domainSubtitle: "Agile Task Delivery, Team Workflows & Sprint Velocity",
      entityNameSingular: "Task",
      entityNamePlural: "Tasks",
      addButtonLabel: "+ Create Task",
      addModalTitle: "Create Sprint Story / Task",
      addNamePlaceholder: "e.g. Implement Webhook Dispatcher",
      categories: ["Auth Squad", "DB Infra", "Frontend", "DevOps"],
      kpis: [
        { title: "Sprint Velocity", value: "54 Pts", change: "↑ +14% vs Sprint 12", positive: true },
        { title: "Active Stories", value: "18 In Flight", change: "6 currently in code review", positive: true },
        { title: "Burndown Progress", value: "88.2%", change: "On target for Friday release", positive: true },
        { title: "Critical Blockers", value: "0 Active", change: "All dependency paths clear", positive: true }
      ],
      chart: {
        title: "Sprint Burn-Down & Velocity Trend",
        subtitle: "Story Points Completed vs Planned Burndown Curve",
        label: "Story Points",
        labels: ["Day 1", "Day 3", "Day 5", "Day 7", "Day 9", "Day 11", "Day 14"],
        data: [60, 52, 41, 30, 22, 11, 4]
      },
      tableColumns: ["Task ID", "Story Title & Deliverable", "Assigned Squad", "Points & Priority", "Status", "Actions"],
      defaultEntities: featureEntities
    };
  }

  // 6. Cybersecurity / Auth / Identity / Zero-Trust
  if (
    haystack.includes("security") ||
    haystack.includes("cyber") ||
    haystack.includes("auth") ||
    haystack.includes("identity") ||
    haystack.includes("threat") ||
    haystack.includes("firewall") ||
    haystack.includes("zero-trust") ||
    haystack.includes("sentinel")
  ) {
    const featureEntities: DomainEntity[] = (config.features && config.features.length > 0)
      ? config.features.slice(0, 4).map((f, i) => ({
          id: `POL-0${i + 1}`,
          name: f.name,
          category: i % 2 === 0 ? "Zero-Trust Device" : "API Access",
          metric: `Enforcement L${i + 1} • High Risk`,
          status: "Enforced",
          timestamp: "Active"
        }))
      : [
          { id: "POL-IAM-01", name: "Strict Device Health & Posture Verification", category: "Zero-Trust", metric: "Enforcement L3 • Critical", status: "Enforced", timestamp: "Just now" },
          { id: "POL-IAM-02", name: "Privileged Admin JIT Session Auto-Revocation", category: "Access Control", metric: "Enforcement L3 • Critical", status: "Enforced", timestamp: "8m ago" },
          { id: "POL-IAM-03", name: "WebAuthn FIDO2 Biometric Hardware Challenge", category: "Authentication", metric: "Enforcement L2 • High", status: "Enforced", timestamp: "20m ago" },
          { id: "POL-IAM-04", name: "Geo-Velocity Anomalous Session Quarantine", category: "Threat Defense", metric: "Enforcement L2 • High", status: "Enforced", timestamp: "45m ago" }
        ];

    return {
      key: "security",
      domainTitle: `${safeName} — Zero-Trust Identity & Access Console`,
      domainSubtitle: "Real-time Policy Enforcement, Access Tokens & Threat Mitigation",
      entityNameSingular: "Access Policy",
      entityNamePlural: "Policies",
      addButtonLabel: "+ Add Policy",
      addModalTitle: "Define Access Control Policy",
      addNamePlaceholder: "e.g. Enforce MFA on Production Endpoints",
      categories: ["Zero-Trust", "Access Control", "Authentication", "Threat Defense"],
      kpis: [
        { title: "Active Identities", value: "8,450 Verified", change: "Zero orphan accounts detected", positive: true },
        { title: "Hardware MFA", value: "100.0%", change: "Strict FIDO2 hardware requirement", positive: true },
        { title: "Threats Blocked", value: "38 Anomalies", change: "Automated quarantine triggered", positive: true },
        { title: "Compliance Audit", value: "SOC 2 Type II", change: "Continuous automated attestation", positive: true }
      ],
      chart: {
        title: "Authentication Traffic & Threat Interception",
        subtitle: "Verified Identity Handshakes and Blocked Threat Vectors",
        label: "Verifications / min",
        labels: ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00", "Now"],
        data: [320, 480, 1150, 2400, 1980, 2850, 3100]
      },
      tableColumns: ["Policy ID", "Policy Scope & Objective", "Security Tier", "Enforcement & Risk", "Status", "Actions"],
      defaultEntities: featureEntities
    };
  }

  // 7. General / Feature-Derived Domain Application (Adaptive)
  const featureEntities: DomainEntity[] = (config.features && config.features.length > 0)
    ? config.features.slice(0, 5).map((f, i) => ({
        id: `MOD-0${i + 1}`,
        name: f.name,
        category: f.priority ? `${f.priority} Priority` : "Core Module",
        metric: f.description.slice(0, 45) + (f.description.length > 45 ? "..." : ""),
        status: "Operational",
        timestamp: "Active"
      }))
    : [
        { id: "MOD-01", name: "Core Business Engine", category: "Core Module", metric: "Main operational orchestrator", status: "Operational", timestamp: "Just now" },
        { id: "MOD-02", name: "Data Synchronization Layer", category: "Core Module", metric: "Real-time state consistency", status: "Operational", timestamp: "5m ago" },
        { id: "MOD-03", name: "Client Interactive Interface", category: "UI Layer", metric: "Reactive components & controls", status: "Operational", timestamp: "12m ago" },
        { id: "MOD-04", name: "Audit Trail & Verification", category: "Security", metric: "Compliance logging & validation", status: "Operational", timestamp: "20m ago" }
      ];

  const primaryCategory = config.category || "Business Platform";

  return {
    key: "general",
    domainTitle: `${safeName} — Operational Application Hub`,
    domainSubtitle: `Live End-User Interface synthesized for ${primaryCategory}`,
    entityNameSingular: "Feature Module",
    entityNamePlural: "Modules",
    addButtonLabel: "+ Add Module",
    addModalTitle: "Add New Application Module",
    addNamePlaceholder: "e.g. Enterprise Reporting Engine",
    categories: ["Core Module", "UI Layer", "Data Sync", "Security"],
    kpis: [
      { title: "Active Modules", value: `${featureEntities.length} Online`, change: "↑ 100% feature coverage", positive: true },
      { title: "Operational SLA", value: "99.98%", change: "Sub-millisecond reactivity", positive: true },
      { title: "Active Workflows", value: "48 Workflows", change: "High-concurrency processing", positive: true },
      { title: "Security Grade", value: "Enterprise", change: "Zero vulnerabilities found", positive: true }
    ],
    chart: {
      title: `${safeName} Operational Activity Trend`,
      subtitle: "Live End-User Workflow Execution Rate",
      label: "Workflows / Hour",
      labels: ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00", "Now"],
      data: [120, 240, 580, 920, 840, 1150, 1340]
    },
    tableColumns: ["Module ID", "Module Title & Scope", "Category Tier", "Specification Details", "Status", "Actions"],
    defaultEntities: featureEntities
  };
}

export function generateDomainAppHtml(config: DomainAppConfig): string {
  const profile = detectDomainProfile(config);
  const safeName = config.projectName || "Enterprise Solution";
  const entitiesJson = JSON.stringify(profile.defaultEntities, null, 2);
  const chartLabelsJson = JSON.stringify(profile.chart.labels);
  const chartDataJson = JSON.stringify(profile.chart.data);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${profile.domainTitle}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
    body { font-family: 'Inter', sans-serif; background-color: #090A0F; color: #f8fafc; }
    code, pre, .font-mono { font-family: 'JetBrains Mono', monospace; }
  </style>
</head>
<body class="min-h-screen p-4 md:p-8 selection:bg-blue-500/30">
  <div class="max-w-6xl mx-auto space-y-6">
    <!-- Header -->
    <header class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-white/10">
      <div>
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold shadow-lg shadow-blue-500/10 text-lg">
            ⚡
          </div>
          <div>
            <h1 class="text-2xl font-bold tracking-tight text-white">${profile.domainTitle}</h1>
            <p class="text-xs text-slate-400">${profile.domainSubtitle}</p>
          </div>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          Live Operational App
        </span>
        <button onclick="triggerNewItemModal()" class="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/25 transition-all flex items-center gap-1.5">
          ${profile.addButtonLabel}
        </button>
      </div>
    </header>

    <!-- Top KPI Grid -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="p-5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl">
        <span class="text-xs text-slate-400 font-medium uppercase tracking-wider">${profile.kpis[0].title}</span>
        <div class="text-2xl font-bold text-white mt-1" id="kpiTotalRecords">${profile.kpis[0].value}</div>
        <div class="text-[11px] text-emerald-400 mt-1">${profile.kpis[0].change}</div>
      </div>
      <div class="p-5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl">
        <span class="text-xs text-slate-400 font-medium uppercase tracking-wider">${profile.kpis[1].title}</span>
        <div class="text-2xl font-bold text-white mt-1">${profile.kpis[1].value}</div>
        <div class="text-[11px] text-blue-400 mt-1">${profile.kpis[1].change}</div>
      </div>
      <div class="p-5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl">
        <span class="text-xs text-slate-400 font-medium uppercase tracking-wider">${profile.kpis[2].title}</span>
        <div class="text-2xl font-bold text-emerald-400 mt-1">${profile.kpis[2].value}</div>
        <div class="text-[11px] text-slate-400 mt-1">${profile.kpis[2].change}</div>
      </div>
      <div class="p-5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl">
        <span class="text-xs text-slate-400 font-medium uppercase tracking-wider">${profile.kpis[3].title}</span>
        <div class="text-2xl font-bold text-indigo-400 mt-1">${profile.kpis[3].value}</div>
        <div class="text-[11px] text-slate-400 mt-1">${profile.kpis[3].change}</div>
      </div>
    </div>

    <!-- Chart & Interactive Controls Row -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 p-6 rounded-2xl bg-white/[0.03] border border-white/10">
        <div class="flex justify-between items-center mb-4">
          <div>
            <h3 class="text-sm font-semibold text-white">${profile.chart.title}</h3>
            <p class="text-[11px] text-slate-400">${profile.chart.subtitle}</p>
          </div>
          <span class="text-xs text-emerald-400 font-mono bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">● Active Stream</span>
        </div>
        <div class="h-64">
          <canvas id="domainChart"></canvas>
        </div>
      </div>
      <div class="p-6 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4">
        <h3 class="text-sm font-semibold text-white">Application Controls</h3>
        <div class="space-y-3">
          <div>
            <label class="block text-xs text-slate-400 mb-1">Search ${profile.entityNamePlural}</label>
            <input type="text" id="searchInput" placeholder="Filter by ID, name, status..." 
              oninput="handleSearch(this.value)"
              class="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors" />
          </div>
          <div>
            <label class="block text-xs text-slate-400 mb-1">Filter by Category</label>
            <select id="categoryFilter" onchange="handleFilter(this.value)"
              class="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500">
              <option value="all">All Categories</option>
              ${profile.categories.map(c => `<option value="${c}">${c}</option>`).join("\n              ")}
            </select>
          </div>
          <div class="pt-2 space-y-2">
            <button onclick="simulateSampleBatch()" class="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-white font-medium transition-all flex items-center justify-center gap-1.5">
              ⚡ Ingest Sample ${profile.entityNamePlural} (+3)
            </button>
            <button onclick="pingAll()" class="w-full py-2 rounded-xl bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/20 text-xs text-blue-400 font-medium transition-all">
              ⚡ Sync All Records
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Data Table -->
    <div class="p-6 rounded-2xl bg-white/[0.03] border border-white/10">
      <div class="flex justify-between items-center mb-4">
        <div>
          <h3 class="text-sm font-semibold text-white">Live ${profile.entityNamePlural} Registry</h3>
          <p class="text-[11px] text-slate-400">Interactive operational records synchronized in memory</p>
        </div>
        <span class="text-xs text-slate-400 font-mono" id="resultsCount">Loading records...</span>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead>
            <tr class="border-b border-white/10 text-slate-400 uppercase tracking-wider text-[11px]">
              <th class="pb-3 font-semibold">${profile.tableColumns[0]}</th>
              <th class="pb-3 font-semibold">${profile.tableColumns[1]}</th>
              <th class="pb-3 font-semibold">${profile.tableColumns[2]}</th>
              <th class="pb-3 font-semibold">${profile.tableColumns[3]}</th>
              <th class="pb-3 font-semibold">${profile.tableColumns[4]}</th>
              <th class="pb-3 font-semibold text-right">${profile.tableColumns[5]}</th>
            </tr>
          </thead>
          <tbody id="entityTableBody" class="divide-y divide-white/5">
            <!-- Rendered dynamically -->
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- Notification Toast -->
  <div id="toast" class="fixed bottom-6 right-6 px-4 py-2.5 rounded-xl bg-slate-900 border border-blue-500/30 text-white text-xs shadow-2xl flex items-center gap-2 transform translate-y-20 opacity-0 transition-all duration-300 pointer-events-none z-50">
    <span class="text-blue-400 font-bold">✓</span>
    <span id="toastMsg">Action completed</span>
  </div>

  <script>
    let entities = ${entitiesJson};
    let currentFilter = "all";
    let currentSearch = "";

    function showToast(msg) {
      const toast = document.getElementById("toast");
      const toastMsg = document.getElementById("toastMsg");
      toastMsg.innerText = msg;
      toast.classList.remove("translate-y-20", "opacity-0");
      setTimeout(() => {
        toast.classList.add("translate-y-20", "opacity-0");
      }, 2500);
    }

    function renderTable() {
      const tbody = document.getElementById("entityTableBody");
      const filtered = entities.filter(item => {
        const matchesFilter = currentFilter === "all" || item.category === currentFilter;
        const matchesSearch = item.name.toLowerCase().includes(currentSearch.toLowerCase()) || 
                              item.id.toLowerCase().includes(currentSearch.toLowerCase()) ||
                              item.category.toLowerCase().includes(currentSearch.toLowerCase());
        return matchesFilter && matchesSearch;
      });

      document.getElementById("resultsCount").innerText = "Showing " + filtered.length + " of " + entities.length;
      const kpiTotal = document.getElementById("kpiTotalRecords");
      if (kpiTotal) {
        kpiTotal.innerText = entities.length + " Online";
      }

      tbody.innerHTML = filtered.map(item => \`
        <tr class="hover:bg-white/[0.02] transition-colors">
          <td class="py-3.5 font-mono text-blue-400 font-medium">\${item.id}</td>
          <td class="py-3.5 font-medium text-white">\${item.name}</td>
          <td class="py-3.5">
            <span class="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/5 text-slate-300 border border-white/10">
              \${item.category}
            </span>
          </td>
          <td class="py-3.5 text-slate-300 font-mono text-[11px]">\${item.metric}</td>
          <td class="py-3.5">
            <span class="px-2 py-0.5 rounded-full text-[10px] font-semibold \${
              item.status === 'Online' || item.status === 'Admitted' || item.status === 'In Stock' || item.status === 'Settled' || item.status === 'Done' || item.status === 'Operational' || item.status === 'Enforced'
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : item.status === 'Low Stock' || item.status === 'Critical'
                ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
            }">
              ● \${item.status}
            </span>
          </td>
          <td class="py-3.5 text-right space-x-2">
            <button onclick="toggleStatus('\${item.id}')" class="text-blue-400 hover:text-blue-300 font-medium text-[11px]">Toggle</button>
            <button onclick="removeEntity('\${item.id}')" class="text-rose-400 hover:text-rose-300 font-medium text-[11px]">Remove</button>
          </td>
        </tr>
      \`).join("");
    }

    function handleSearch(val) {
      currentSearch = val;
      renderTable();
    }

    function handleFilter(val) {
      currentFilter = val;
      renderTable();
    }

    function removeEntity(id) {
      entities = entities.filter(e => e.id !== id);
      renderTable();
      showToast("Removed " + id);
    }

    function toggleStatus(id) {
      entities = entities.map(e => {
        if (e.id === id) {
          const nextStatus = e.status === 'Online' ? 'Maintenance' :
                             e.status === 'Operational' ? 'Standby' :
                             e.status === 'Admitted' ? 'Under Review' :
                             e.status === 'In Stock' ? 'Low Stock' :
                             e.status === 'In Progress' ? 'Done' : 'Online';
          return { ...e, status: nextStatus };
        }
        return e;
      });
      renderTable();
      showToast("Updated status for " + id);
    }

    function triggerNewItemModal() {
      const name = prompt("${profile.addModalTitle}\\n\\n${profile.addNamePlaceholder}:", "");
      if (name && name.trim()) {
        const newId = "${profile.key.toUpperCase().slice(0, 4)}-" + Math.floor(100 + Math.random() * 900);
        entities.unshift({
          id: newId,
          name: name.trim(),
          category: "${profile.categories[0]}",
          metric: "Active • Sub-2ms SLA",
          status: "Online",
          timestamp: "Just now"
        });
        renderTable();
        showToast("Created " + newId + ": " + name.trim());
      }
    }

    function simulateSampleBatch() {
      const categories = ${JSON.stringify(profile.categories)};
      const sampleNames = [
        "Dynamic Peer Bridge Beta",
        "Edge Compute Accelerator",
        "Zero-Trust Handshake Unit"
      ];
      for (let i = 0; i < sampleNames.length; i++) {
        const newId = "${profile.key.toUpperCase().slice(0, 4)}-" + Math.floor(100 + Math.random() * 900);
        entities.unshift({
          id: newId,
          name: sampleNames[i] + " (" + (entities.length + 1) + ")",
          category: categories[i % categories.length],
          metric: "Healthy • Verified SLA",
          status: "Online",
          timestamp: "Just now"
        });
      }
      renderTable();
      showToast("Ingested 3 sample ${profile.entityNamePlural}");
    }

    function pingAll() {
      showToast("All ${profile.entityNamePlural} pinged & operational");
    }

    // Chart.js Initialization
    window.addEventListener("DOMContentLoaded", () => {
      renderTable();
      const ctx = document.getElementById("domainChart").getContext("2d");
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: ${chartLabelsJson},
          datasets: [{
            label: '${profile.chart.label}',
            data: ${chartDataJson},
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            fill: true,
            tension: 0.4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#94a3b8' } },
            y: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#94a3b8' } }
          }
        }
      });
    });
  </script>
</body>
</html>`;
}
