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
  sampleBatchNames: string[];
  defaultNewMetric?: string;
  defaultNewStatus?: string;
}

export interface DomainAppConfig {
  projectName?: string;
  category?: string;
  summary?: string;
  features?: Array<{ name: string; description: string; priority: string }>;
}

export function detectDomainProfile(config: DomainAppConfig): DomainProfile {
  const cleanDomainTitle = (raw: string) => {
    const stripped = raw
      .replace(/^(please\s+)?(create|build|make|design|generate|develop|setup|implement|code|write)\s+(an?|the)?\s*(application|app|system|platform|portal|dashboard|tool|service|solution|project)?\s*(for|to|of|about)?\s*/i, "")
      .replace(/\s+(fo|for|to|in|of|and|the|a|an)$/i, "")
      .trim();
    if (!stripped) return raw;
    return stripped
      .split(/\s+/)
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  };

  const rawProjectName = config.projectName || "";
  const safeName = rawProjectName
    ? (rawProjectName.toLowerCase().startsWith("create ") || rawProjectName.toLowerCase().startsWith("build ") || rawProjectName.toLowerCase().startsWith("a ") || rawProjectName.toLowerCase().startsWith("an ")
        ? cleanDomainTitle(rawProjectName)
        : rawProjectName)
    : (config.category || "Live Operational App");

  const haystack = [
    config.projectName || "",
    config.category || "",
    config.summary || "",
    ...(config.features?.map(f => `${f.name} ${f.description}`) || [])
  ].join(" ").toLowerCase();

  // Helper to map project's real features into domain entity rows
  const buildFeatureEntities = (defaultCategory: string, defaultMetricPrefix: string, defaultStatus = "Active"): DomainEntity[] => {
    if (config.features && config.features.length > 0) {
      return config.features.slice(0, 4).map((f, i) => ({
        id: `REC-0${i + 1}`,
        name: f.name,
        category: f.priority ? `${f.priority} Tier` : defaultCategory,
        metric: f.description.slice(0, 45) + (f.description.length > 45 ? "..." : ""),
        status: defaultStatus,
        timestamp: "Active"
      }));
    }
    return [];
  };

  // 1. Mesh / Networking / IoT / Edge / Wireless / P2P
  if (
    /\b(mesh|lora|p2p|peer-to-peer|ad-hoc)\b/i.test(haystack) ||
    haystack.includes("packet routing") ||
    haystack.includes("mesh topology") ||
    haystack.includes("sensor mesh") ||
    haystack.includes("iot mesh") ||
    haystack.includes("mesh node") ||
    (/\b(nodes?|gateway)\b/i.test(haystack) && (haystack.includes("packet") || haystack.includes("rf ") || haystack.includes("topology") || haystack.includes("peer")))
  ) {
    const featureEntities = buildFeatureEntities("Gateway", "-50 dBm");
    const entities = featureEntities.length > 0 ? featureEntities : [
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
      defaultEntities: entities,
      sampleBatchNames: ["Dynamic Peer Bridge Beta", "Edge Compute Accelerator", "Zero-Trust Handshake Unit"],
      defaultNewMetric: "Active • Sub-2ms SLA",
      defaultNewStatus: "Online"
    };
  }

  // 2. Municipal / Civic / Citizen / City / Ward / Grievance / Sanitation / Government
  if (
    haystack.includes("muncipal") || // Typo tolerance
    haystack.includes("municipal") ||
    haystack.includes("corpoaration") || // Typo tolerance
    haystack.includes("corporation") ||
    haystack.includes("civic") ||
    haystack.includes("citizen") ||
    haystack.includes("grievance") ||
    haystack.includes("ward") ||
    haystack.includes("sanitation") ||
    haystack.includes("pothole") ||
    haystack.includes("garbage") ||
    haystack.includes("public works") ||
    haystack.includes("urban") ||
    haystack.includes("municipality") ||
    haystack.includes("governance") ||
    haystack.includes("water supply") ||
    haystack.includes("streetlight") ||
    haystack.includes("complaint")
  ) {
    const featureEntities = buildFeatureEntities("Public Works", "Ward 4 • High Priority", "In Progress");
    const entities = featureEntities.length > 0 ? featureEntities : [
      { id: "CIV-101", name: "Road Resurfacing & Pothole Repair (Main St, Ward 4)", category: "Public Works & Roads", metric: "Ward 4 • High Priority", status: "In Progress", timestamp: "Just now" },
      { id: "CIV-102", name: "Water Pipeline Leakage & Pressure Drop (Sector 9)", category: "Water Supply & Sewage", metric: "Ward 2 • Urgent Priority", status: "Dispatched", timestamp: "15m ago" },
      { id: "CIV-103", name: "Streetlight LED Array Blackout (Boulevard 3)", category: "Electrical & Lighting", metric: "Ward 7 • Medium Priority", status: "Resolved", timestamp: "30m ago" },
      { id: "CIV-104", name: "Solid Waste Clearance & Segregation Bin Overflow", category: "Sanitation & Waste", metric: "Ward 1 • High Priority", status: "In Progress", timestamp: "1h ago" }
    ];

    return {
      key: "civic",
      domainTitle: `${safeName} — Municipal Services & Civic Portal`,
      domainSubtitle: "Citizen Grievance Redressal, Ward Infrastructure & Public Works",
      entityNameSingular: "Civic Request",
      entityNamePlural: "Civic Requests",
      addButtonLabel: "+ Log Civic Request",
      addModalTitle: "Log Civic Grievance / Service Request",
      addNamePlaceholder: "e.g. Ward 4 Pothole Repair & Road Resurfacing",
      categories: ["Public Works & Roads", "Water Supply & Sewage", "Sanitation & Waste", "Electrical & Lighting", "Civic Permits"],
      kpis: [
        { title: "Active Grievances", value: "142 Active", change: "↑ 88% resolved within 48h SLA", positive: true },
        { title: "Resolution SLA", value: "24.8 Hours", change: "Within target municipal turnaround", positive: true },
        { title: "Ward Resolution Rate", value: "96.2%", change: "Wards 1-12 operating at peak efficiency", positive: true },
        { title: "Civic Services Online", value: "18 Portals", change: "100% digital citizen self-service", positive: true }
      ],
      chart: {
        title: "Daily Civic Grievance Inflow & Resolution Velocity",
        subtitle: "Citizen complaints received vs resolved across municipal wards",
        label: "Grievances / Day",
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        data: [85, 120, 145, 110, 95, 62, 48]
      },
      tableColumns: ["Ticket ID", "Grievance Title & Location", "Municipal Dept", "Ward & Priority", "Status", "Actions"],
      defaultEntities: entities,
      sampleBatchNames: ["Pothole Repair at Crossroad 4", "Sewer Line Desilting Request", "Public Park Tree Trimming"],
      defaultNewMetric: "Ward 3 • High Priority",
      defaultNewStatus: "In Progress"
    };
  }

  // 3. Healthcare / Hospital / Clinic / Medical / Patient / Triage
  if (
    haystack.includes("health") ||
    haystack.includes("clinic") ||
    haystack.includes("patient") ||
    haystack.includes("hospital") ||
    haystack.includes("medical") ||
    haystack.includes("doctor") ||
    haystack.includes("triage") ||
    haystack.includes("inpatient") ||
    haystack.includes("outpatient")
  ) {
    const featureEntities = buildFeatureEntities("Ward 3", "Priority 2", "Admitted");
    const entities = featureEntities.length > 0 ? featureEntities : [
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
      defaultEntities: entities,
      sampleBatchNames: ["Patient Consult #84", "Emergency Triage Unit 2", "Inpatient Recovery Unit"],
      defaultNewMetric: "Priority 2 (Urgent)",
      defaultNewStatus: "Admitted"
    };
  }

  // 4. E-Commerce / Store / Marketplace / Retail / Inventory
  if (
    /\b(shop|shopping|storefront|retail|cart|checkout|ecommerce|e-commerce|merchandise|pos)\b/i.test(haystack) ||
    haystack.includes("product catalog") ||
    haystack.includes("order fulfillment") ||
    haystack.includes("inventory tracking") ||
    haystack.includes("online store")
  ) {
    const featureEntities = buildFeatureEntities("Catalog", "$149.00");
    const entities = featureEntities.length > 0 ? featureEntities : [
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
      defaultEntities: entities,
      sampleBatchNames: ["Wireless ANC Headset V2", "Mechanical Gaming Keyboard", "USB-C Fast GaN Charger"],
      defaultNewMetric: "$129.00 • 35 in stock",
      defaultNewStatus: "In Stock"
    };
  }

  // 5. FinTech / Banking / Payment / Crypto / Invoicing / Ledger
  if (
    /\b(fintech|bank|banking|crypto|cryptocurrency|invoice|invoicing|invoices|ledger|wallet|wallets|payroll|treasury|defi)\b/i.test(haystack) ||
    haystack.includes("payment rail") ||
    (haystack.includes("payment") && !haystack.includes("payload"))
  ) {
    const featureEntities = buildFeatureEntities("FedNow", "$15,000", "Settled");
    const entities = featureEntities.length > 0 ? featureEntities : [
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
      defaultEntities: entities,
      sampleBatchNames: ["Cross-Border Treasury Swap", "Escrow Smart Contract Release", "Instant Payroll Sweep"],
      defaultNewMetric: "$24,500.00",
      defaultNewStatus: "Settled"
    };
  }

  // 6. Tasks / Sprint / Agile / Project / Kanban / Jira
  if (
    /\b(kanban|jira|sprint|sprints|scrum|agile|backlog|todos?|taskboard|task board)\b/i.test(haystack) ||
    haystack.includes("task management") ||
    haystack.includes("sprint planning")
  ) {
    const featureEntities = buildFeatureEntities("Sprint Backlog", "8 pts");
    const entities = featureEntities.length > 0 ? featureEntities : [
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
      defaultEntities: entities,
      sampleBatchNames: ["Implement API Rate Limiter", "Refactor JWT Validation Layer", "Setup Redis Cache Cluster"],
      defaultNewMetric: "5 pts • Medium",
      defaultNewStatus: "In Progress"
    };
  }

  // 7. Fitness / Gym / Workout / Exercise / Sports / Training
  if (
    /\b(fitness|gym|workout|workouts|exercise|exercises|crossfit|bodybuilding|powerlifting|calisthenics)\b/i.test(haystack) ||
    haystack.includes("strength training") ||
    haystack.includes("personal record") ||
    haystack.includes("workout tracker")
  ) {
    const featureEntities = buildFeatureEntities("Strength", "3 sets • 10 reps");
    const entities = featureEntities.length > 0 ? featureEntities : [
      { id: "EX-101", name: "Barbell Bench Press (Chest Power)", category: "Chest & Triceps", metric: "225 lbs • 4 sets x 8 reps", status: "Completed", timestamp: "Just now" },
      { id: "EX-102", name: "Barbell Back Squat (Leg Hypertrophy)", category: "Legs & Core", metric: "315 lbs • 5 sets x 5 reps", status: "Completed", timestamp: "15m ago" },
      { id: "EX-103", name: "Weighted Pull-Ups (Lat Width)", category: "Back & Biceps", metric: "+45 lbs • 4 sets x 8 reps", status: "Active", timestamp: "30m ago" },
      { id: "EX-104", name: "Dumbbell Overhead Shoulder Press", category: "Shoulders", metric: "75 lbs • 3 sets x 10 reps", status: "Scheduled", timestamp: "1h ago" }
    ];

    return {
      key: "fitness",
      domainTitle: `${safeName} — Workout & Training Tracker`,
      domainSubtitle: "Real-time Exercise Sets, Strength PRs & Workout Volume",
      entityNameSingular: "Exercise",
      entityNamePlural: "Exercises",
      addButtonLabel: "+ Log Exercise",
      addModalTitle: "Log Workout Exercise & Sets",
      addNamePlaceholder: "e.g. Incline Dumbbell Press",
      categories: ["Chest & Triceps", "Back & Biceps", "Legs & Core", "Shoulders"],
      kpis: [
        { title: "Total Volume", value: "18,420 lbs", change: "↑ +8.4% vs last session", positive: true },
        { title: "Sets Completed", value: "24 Sets", change: "Target 26 sets per workout", positive: true },
        { title: "Heavy Squat PR", value: "315 lbs", change: "All-time personal record", positive: true },
        { title: "Weekly Consistency", value: "5 / 5 Days", change: "100% adherence to split", positive: true }
      ],
      chart: {
        title: "Daily Workout Volume & Reps Completed",
        subtitle: "Tonnage lifted across weekly training split",
        label: "Volume (k lbs)",
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        data: [14.2, 18.4, 0, 16.5, 21.0, 12.8, 0]
      },
      tableColumns: ["Exercise ID", "Movement Title & Target", "Muscle Group", "Load & Volume", "Status", "Actions"],
      defaultEntities: entities,
      sampleBatchNames: ["Incline Dumbbell Press", "Romanian Deadlift", "Overhead Military Press"],
      defaultNewMetric: "185 lbs • 3 sets x 10 reps",
      defaultNewStatus: "Completed"
    };
  }

  // 8. Flight / Aviation / Airport / Travel / Radar
  if (
    /\b(flights?|aviation|airports?|airspace|airlines?|aircraft|airplane|radar)\b/i.test(haystack) ||
    haystack.includes("flight tracking")
  ) {
    const featureEntities = buildFeatureEntities("Commercial", "FL360 • 480 kts");
    const entities = featureEntities.length > 0 ? featureEntities : [
      { id: "FL-UA-882", name: "United Airlines (SFO ➔ HND Tokyo)", category: "International", metric: "FL380 • 510 kts • On Time", status: "En Route", timestamp: "Just now" },
      { id: "FL-DL-412", name: "Delta Air Lines (JFK ➔ LHR London)", category: "International", metric: "FL360 • 495 kts • On Time", status: "En Route", timestamp: "10m ago" },
      { id: "FL-AA-109", name: "American Airlines (LAX ➔ ORD Chicago)", category: "Domestic", metric: "FL320 • 470 kts • Cruising", status: "En Route", timestamp: "25m ago" },
      { id: "FL-FX-201", name: "FedEx Express Cargo (MEM ➔ FRA)", category: "Cargo", metric: "FL390 • 520 kts • Final Approach", status: "Descending", timestamp: "45m ago" }
    ];

    return {
      key: "flight",
      domainTitle: `${safeName} — Live Flight Radar & Airspace Controller`,
      domainSubtitle: "Real-time Transponder Tracking, Flight Routes & Airport Radars",
      entityNameSingular: "Flight",
      entityNamePlural: "Flights",
      addButtonLabel: "+ Track Flight",
      addModalTitle: "Add Flight to Radar Tracking",
      addNamePlaceholder: "e.g. Flight BA-178 (JFK to LHR)",
      categories: ["International", "Domestic", "Cargo", "Private Jet"],
      kpis: [
        { title: "Airborne Flights", value: "1,420 Active", change: "↑ Peak congestion handled", positive: true },
        { title: "Avg Ground Speed", value: "505 kts", change: "Favorable jetstream tailwinds", positive: true },
        { title: "On-Time Dispatch", value: "96.4%", change: "Zero tarmac delays logged", positive: true },
        { title: "Active Terminals", value: "18 Gates Open", change: "All ground radars active", positive: true }
      ],
      chart: {
        title: "Hourly Airspace Inbound / Outbound Traffic",
        subtitle: "Transponder ping frequency and airspace density",
        label: "Flights / Hour",
        labels: ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00", "Now"],
        data: [120, 240, 680, 1140, 950, 1380, 1420]
      },
      tableColumns: ["Flight ID", "Carrier & Route Specification", "Flight Category", "Altitude & Airspeed", "Status", "Actions"],
      defaultEntities: entities,
      sampleBatchNames: ["Flight BA-117 (Airbus A350)", "Flight LH-450 (Boeing 747)", "Flight SQ-22 (Airbus A350-ULR)"],
      defaultNewMetric: "FL350 • 490 kts",
      defaultNewStatus: "En Route"
    };
  }

  // 9. Food / Recipe / Restaurant / Cooking / Menu / Meal
  if (
    /\b(recipes?|restaurants?|culinary|chef|kitchen|dining|dishes?|menu)\b/i.test(haystack) ||
    haystack.includes("food delivery") ||
    haystack.includes("cooking")
  ) {
    const featureEntities = buildFeatureEntities("Entrees", "25 min prep");
    const entities = featureEntities.length > 0 ? featureEntities : [
      { id: "RCP-101", name: "Spicy Thai Basil Chicken (Pad Krapow)", category: "Entrees", metric: "20 min prep • 580 kcal", status: "Featured", timestamp: "Just now" },
      { id: "RCP-102", name: "Truffle & Wild Porcini Mushroom Risotto", category: "Entrees", metric: "35 min prep • 620 kcal", status: "Active", timestamp: "15m ago" },
      { id: "RCP-103", name: "Artisanal Wood-Fired Margherita Pizza", category: "Artisanal", metric: "15 min bake • 740 kcal", status: "Active", timestamp: "30m ago" },
      { id: "RCP-104", name: "Matcha Lava Cake with Madagascar Vanilla", category: "Desserts", metric: "25 min bake • 420 kcal", status: "Seasonal", timestamp: "1h ago" }
    ];

    return {
      key: "food",
      domainTitle: `${safeName} — Kitchen Recipes & Menu Orders`,
      domainSubtitle: "Culinary Catalog, Ingredients Inventory & Table Orders",
      entityNameSingular: "Recipe",
      entityNamePlural: "Recipes",
      addButtonLabel: "+ Add Recipe",
      addModalTitle: "Add New Culinary Recipe",
      addNamePlaceholder: "e.g. Garlic Butter Rosemary Ribeye",
      categories: ["Entrees", "Artisanal", "Desserts", "Beverages"],
      kpis: [
        { title: "Cataloged Recipes", value: "84 Dishes", change: "↑ +8 created this week", positive: true },
        { title: "Avg Prep Time", value: "22 mins", change: "Fast kitchen execution speed", positive: true },
        { title: "Orders Fulfilled", value: "312 Meals", change: "Peak dinner service handled", positive: true },
        { title: "Chef Rating", value: "4.92 / 5.0", change: "Based on 1,400 guest reviews", positive: true }
      ],
      chart: {
        title: "Daily Kitchen Orders & Popular Dishes",
        subtitle: "Order velocity across dining and takeout tickets",
        label: "Dishes Served",
        labels: ["11:00", "13:00", "15:00", "17:00", "19:00", "21:00", "Now"],
        data: [28, 94, 42, 68, 142, 110, 85]
      },
      tableColumns: ["Recipe ID", "Dish Title & Flavors", "Menu Section", "Prep Time & Calories", "Status", "Actions"],
      defaultEntities: entities,
      sampleBatchNames: ["Creamy Tuscan Garlic Salmon", "Artisanal Sourdough Baguette", "Matcha Chia Seed Parfait"],
      defaultNewMetric: "30 min prep • 520 kcal",
      defaultNewStatus: "Active"
    };
  }

  // 10. Real Estate / Property / Housing / Rental / Tenant
  if (
    /\b(real estate|realtor|tenant|tenants|leases?|apartments?|condos?)\b/i.test(haystack) ||
    haystack.includes("property listing") ||
    haystack.includes("rental property")
  ) {
    const featureEntities = buildFeatureEntities("Residential", "$2,800/mo");
    const entities = featureEntities.length > 0 ? featureEntities : [
      { id: "PROP-101", name: "Skyline Luxury Penthouse (Downtown)", category: "Luxury Penthouse", metric: "$4,800/mo • 3 Beds, 3 Baths", status: "Available", timestamp: "Just now" },
      { id: "PROP-102", name: "Sunset Boulevard Modern Glass Villa", category: "Residential", metric: "$7,200/mo • 4 Beds, 4 Baths", status: "Leased", timestamp: "1h ago" },
      { id: "PROP-103", name: "Historic Brownstone Garden Townhouse", category: "Townhouse", metric: "$3,400/mo • 2 Beds, 2 Baths", status: "Under Offer", timestamp: "3h ago" },
      { id: "PROP-104", name: "Downtown Silicon Loft (Studio Tech Hub)", category: "Studio", metric: "$2,200/mo • 1 Bed, 1 Bath", status: "Available", timestamp: "1d ago" }
    ];

    return {
      key: "realestate",
      domainTitle: `${safeName} — Property Listings & Tenant Manager`,
      domainSubtitle: "Real-time Real Estate Listings, Tenant Leases & Occupancy",
      entityNameSingular: "Property",
      entityNamePlural: "Properties",
      addButtonLabel: "+ Add Listing",
      addModalTitle: "List New Property",
      addNamePlaceholder: "e.g. Waterfront Modern Condo 4B",
      categories: ["Luxury Penthouse", "Residential", "Townhouse", "Studio"],
      kpis: [
        { title: "Active Listings", value: "48 Units", change: "↑ 12 newly listed this month", positive: true },
        { title: "Occupancy Rate", value: "96.4%", change: "Only 2 vacant residential units", positive: true },
        { title: "Monthly Rent Roll", value: "$142,500", change: "100% on-time lease payments", positive: true },
        { title: "Tenant Inquiries", value: "34 Active", change: "Average 4 tours per property", positive: true }
      ],
      chart: {
        title: "Monthly Rental Revenue & Portfolio Yield",
        subtitle: "Gross rental cash flow across properties ($k)",
        label: "Rent Volume ($k)",
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Now"],
        data: [112, 118, 124, 131, 138, 140, 142.5]
      },
      tableColumns: ["Property ID", "Listing Title & Location", "Property Type", "Rent & Floorplan", "Status", "Actions"],
      defaultEntities: entities,
      sampleBatchNames: ["Waterfront Modern Condo 4B", "Suburban Family Oasis with Pool", "Midtown High-Rise Executive Suite"],
      defaultNewMetric: "$3,200/mo • 2 Beds, 2 Baths",
      defaultNewStatus: "Available"
    };
  }

  // 11. Pet / Animals / Vet / Dog Walking / Pet Care
  if (
    /\b(pets?|dogs?|cats?|puppy|puppies|kitten|kittens|veterinary|vet|dog walking|grooming)\b/i.test(haystack) &&
    !haystack.includes("category") &&
    !haystack.includes("catalog")
  ) {
    const featureEntities = buildFeatureEntities("Dog Walking", "45 min park walk");
    const entities = featureEntities.length > 0 ? featureEntities : [
      { id: "PET-101", name: "Luna (Golden Retriever • 3 yrs)", category: "Dog Walking", metric: "45 min Park Run • Walker Alex", status: "In Progress", timestamp: "Just now" },
      { id: "PET-102", name: "Milo (French Bulldog • 1 yr)", category: "Vet Health Check", metric: "Vaccination Booster & Dental", status: "Confirmed", timestamp: "20m ago" },
      { id: "PET-103", name: "Bella (Siamese Cat • 4 yrs)", category: "Pet Grooming", metric: "Full Spa & Coat Conditioning", status: "Completed", timestamp: "1h ago" },
      { id: "PET-104", name: "Rocky (German Shepherd • 2 yrs)", category: "Agility Training", metric: "Advanced Obedience Session", status: "Confirmed", timestamp: "2h ago" }
    ];

    return {
      key: "pet",
      domainTitle: `${safeName} — Pet Care & Booking Schedule`,
      domainSubtitle: "Dog Walking Reservations, Veterinary Appointments & Grooming",
      entityNameSingular: "Pet Booking",
      entityNamePlural: "Pet Bookings",
      addButtonLabel: "+ Book Pet Service",
      addModalTitle: "Create Pet Care Booking",
      addNamePlaceholder: "e.g. Charlie (Labrador) - 60 min Trail Walk",
      categories: ["Dog Walking", "Vet Health Check", "Pet Grooming", "Agility Training"],
      kpis: [
        { title: "Today's Bookings", value: "38 Appointments", change: "↑ 100% walker coverage", positive: true },
        { title: "Certified Walkers", value: "14 On Duty", change: "All background verified", positive: true },
        { title: "Happy Pet Rating", value: "4.98 / 5.0", change: "Based on 840 pet owner reviews", positive: true },
        { title: "Avg Walk Time", value: "45 mins", change: "GPS route tracking enabled", positive: true }
      ],
      chart: {
        title: "Daily Pet Walks & Veterinary Checkups",
        subtitle: "Weekly appointments and active dog walking routes",
        label: "Bookings",
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        data: [24, 32, 28, 36, 42, 54, 48]
      },
      tableColumns: ["Booking ID", "Pet Name & Breed Spec", "Service Tier", "Session Details & Walker", "Status", "Actions"],
      defaultEntities: entities,
      sampleBatchNames: ["Daisy (Cocker Spaniel • 30m Walk)", "Charlie (Labrador • Park Run)", "Oliver (Tabby • Vet Checkup)"],
      defaultNewMetric: "45 min Walk • GPS Tracked",
      defaultNewStatus: "Confirmed"
    };
  }

  // 12. Music / Audio / Podcasts / Streaming
  if (
    /\b(music|songs?|audio|podcasts?|playlists?|albums?|artists?|discography)\b/i.test(haystack) &&
    !haystack.includes("tracking") &&
    !haystack.includes("fast-track")
  ) {
    const featureEntities = buildFeatureEntities("Electronic", "3:45 • 320kbps");
    const entities = featureEntities.length > 0 ? featureEntities : [
      { id: "TRK-101", name: "Midnight Resonance (Synthwave Pulse)", category: "Electronic", metric: "3:42 • 320 kbps Lossless", status: "Streaming", timestamp: "Just now" },
      { id: "TRK-102", name: "Neon Horizon Wave (Lo-Fi Chillhop)", category: "Lo-Fi Beats", metric: "2:58 • FLAC Studio Master", status: "Streaming", timestamp: "15m ago" },
      { id: "TRK-103", name: "Deep Focus Binaural Soundscape", category: "Ambient", metric: "14:20 • 320 kbps High Res", status: "Queued", timestamp: "30m ago" },
      { id: "TRK-104", name: "Velvet Sun (Indie Acoustic Live Session)", category: "Indie Acoustic", metric: "4:12 • 320 kbps Lossless", status: "Completed", timestamp: "1h ago" }
    ];

    return {
      key: "music",
      domainTitle: `${safeName} — Audio Library & Track Broadcast`,
      domainSubtitle: "High-Fidelity Audio Streaming, Playlists & Artist Library",
      entityNameSingular: "Track",
      entityNamePlural: "Tracks",
      addButtonLabel: "+ Upload Track",
      addModalTitle: "Add Track to Broadcast Library",
      addNamePlaceholder: "e.g. Solar Eclipse (Deep House Remix)",
      categories: ["Electronic", "Lo-Fi Beats", "Ambient", "Indie Acoustic"],
      kpis: [
        { title: "Total Streams", value: "28,400 Plays", change: "↑ +34% listener growth", positive: true },
        { title: "Live Listeners", value: "3,420 Active", change: "Zero audio buffering lag", positive: true },
        { title: "Stream Quality", value: "320 kbps", change: "Lossless bit-perfect playback", positive: true },
        { title: "Curated Playlists", value: "142 Mixes", change: "Auto-synced across clients", positive: true }
      ],
      chart: {
        title: "Hourly Streaming Volume & Active Listeners",
        subtitle: "Concurrent audio streams across sound channels",
        label: "Concurrent Streams",
        labels: ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00", "Now"],
        data: [820, 450, 1120, 2400, 1980, 3100, 3420]
      },
      tableColumns: ["Track ID", "Song Title & Producer", "Genre Section", "Duration & Bitrate", "Status", "Actions"],
      defaultEntities: entities,
      sampleBatchNames: ["Solar Eclipse (Deep House)", "Morning Espresso (Lo-Fi Chill)", "Rainforest Echoes (Ambient 3D)"],
      defaultNewMetric: "3:30 • 320 kbps",
      defaultNewStatus: "Streaming"
    };
  }


  // 13. Education / School / University / Student / Course / LMS / Learning
  if (
    haystack.includes("education") ||
    haystack.includes("school") ||
    haystack.includes("university") ||
    haystack.includes("student") ||
    haystack.includes("course") ||
    haystack.includes("learning") ||
    haystack.includes("lms") ||
    haystack.includes("tutor") ||
    haystack.includes("quiz") ||
    haystack.includes("exam") ||
    haystack.includes("teacher") ||
    haystack.includes("classroom") ||
    haystack.includes("academic") ||
    haystack.includes("curriculum")
  ) {
    const featureEntities = buildFeatureEntities("Computer Science", "88% Progress • Grade A", "Active");
    const entities = featureEntities.length > 0 ? featureEntities : [
      { id: "EDU-101", name: "Alex Turner — Advanced Distributed Systems", category: "Computer Science", metric: "88% Progress • Grade A", status: "Active", timestamp: "Just now" },
      { id: "EDU-102", name: "Samantha Reed — Full-Stack Next.js 15 Architect", category: "Web Engineering", metric: "94% Progress • Grade A+", status: "Completed", timestamp: "20m ago" },
      { id: "EDU-103", name: "Daniel Kim — Deep Learning & Neural Networks", category: "AI & Machine Learning", metric: "62% Progress • Grade B+", status: "Active", timestamp: "45m ago" },
      { id: "EDU-104", name: "Maya Patel — Enterprise System Design", category: "Cloud Architecture", metric: "45% Progress • In-Flight", status: "In Review", timestamp: "1h ago" }
    ];

    return {
      key: "education",
      domainTitle: `${safeName} — Academic Curriculum & Student Portal`,
      domainSubtitle: "Interactive Learning Tracks, Course Enrollments & Progress Mastery",
      entityNameSingular: "Student Enrollment",
      entityNamePlural: "Student Enrollments",
      addButtonLabel: "+ Enroll Student",
      addModalTitle: "Enroll Student in Academic Course",
      addNamePlaceholder: "e.g. Liam Foster — Cloud Microservices Track",
      categories: ["Computer Science", "Web Engineering", "AI & Machine Learning", "Cloud Architecture"],
      kpis: [
        { title: "Enrolled Students", value: "2,840 Active", change: "↑ +18% enrollment growth", positive: true },
        { title: "Course Completion", value: "91.4%", change: "Average 4.2 weeks per track", positive: true },
        { title: "Active Classrooms", value: "46 Batches", change: "Live interactive sessions", positive: true },
        { title: "Student Rating", value: "4.94 / 5.0", change: "Based on 3,200 student reviews", positive: true }
      ],
      chart: {
        title: "Weekly Student Engagement & Lesson Completions",
        subtitle: "Interactive video hours and assignment submissions",
        label: "Lesson Hours",
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        data: [320, 480, 560, 610, 590, 430, 390]
      },
      tableColumns: ["Enrollment ID", "Student Name & Course Track", "Academic Dept", "Progress & Grade", "Status", "Actions"],
      defaultEntities: entities,
      sampleBatchNames: ["Liam Foster — Cloud Systems", "Chloe Bennett — UI Design Systems", "Ethan Brooks — Rust Systems"],
      defaultNewMetric: "75% Progress • Grade B+",
      defaultNewStatus: "Active"
    };
  }

  // 14. Logistics / Fleet / Delivery / Supply Chain / Warehouse / Truck
  if (
    haystack.includes("logistic") ||
    haystack.includes("fleet") ||
    haystack.includes("truck") ||
    haystack.includes("delivery") ||
    haystack.includes("courier") ||
    haystack.includes("shipment") ||
    haystack.includes("freight") ||
    haystack.includes("supply chain") ||
    haystack.includes("warehouse")
  ) {
    const featureEntities = buildFeatureEntities("Express Freight", "ETA 6h • GPS Active", "In Transit");
    const entities = featureEntities.length > 0 ? featureEntities : [
      { id: "LOG-101", name: "High-Tech Server Racks (Austin ➔ Seattle)", category: "Express Freight", metric: "ETA 6h • Route Clear", status: "In Transit", timestamp: "Just now" },
      { id: "LOG-102", name: "Temperature-Controlled Pharmaceuticals (Chicago ➔ Boston)", category: "Cold Chain", metric: "-4°C Monitored • On Time", status: "In Transit", timestamp: "12m ago" },
      { id: "LOG-103", name: "Priority E-Commerce Hub Transfer (Atlanta ➔ Miami)", category: "Same-Day Courier", metric: "Out for Final Delivery", status: "Out for Delivery", timestamp: "30m ago" },
      { id: "LOG-104", name: "Industrial Solar Components (Denver ➔ Phoenix)", category: "Intermodal Rail", metric: "Cleared Sorting Terminal", status: "Dispatched", timestamp: "1h ago" }
    ];

    return {
      key: "logistics",
      domainTitle: `${safeName} — Consignment & Fleet Dispatch`,
      domainSubtitle: "Real-time Telemetry, Waybill Tracking & Warehouse Dispatches",
      entityNameSingular: "Shipment",
      entityNamePlural: "Shipments",
      addButtonLabel: "+ Create Shipment",
      addModalTitle: "Register Consignment Shipment",
      addNamePlaceholder: "e.g. Critical Medical Supplies (JFK to ORD)",
      categories: ["Express Freight", "Cold Chain", "Same-Day Courier", "Intermodal Rail"],
      kpis: [
        { title: "Active Shipments", value: "1,240 In Transit", change: "↑ 99.2% on-time delivery rate", positive: true },
        { title: "Avg Transit SLA", value: "18.4 Hours", change: "Sub-24h regional delivery SLA", positive: true },
        { title: "Fleet Utilization", value: "94.8%", change: "184 active vehicles dispatched", positive: true },
        { title: "Fuel Optimization", value: "8.6 MPG", change: "AI route optimization active", positive: true }
      ],
      chart: {
        title: "Hourly Consignment Dispatches & Hub Velocity",
        subtitle: "Inbound and outbound parcels processed across sorting hubs",
        label: "Dispatches / Hour",
        labels: ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00", "Now"],
        data: [180, 240, 680, 1220, 1050, 1480, 1620]
      },
      tableColumns: ["Waybill ID", "Consignment & Destination", "Transport Mode", "Transit ETA & Telemetry", "Status", "Actions"],
      defaultEntities: entities,
      sampleBatchNames: ["Automotive Parts (Detroit ➔ Dallas)", "Aerospace Avionics (Seattle ➔ LAX)", "Biotech Cryo-Samples (Boston ➔ NYC)"],
      defaultNewMetric: "ETA 12h • GPS Active",
      defaultNewStatus: "In Transit"
    };
  }

  // 15. Security / Threat / Firewall / Zero-Trust / Cybersecurity
  if (
    haystack.includes("cyber") ||
    haystack.includes("threat") ||
    haystack.includes("firewall") ||
    haystack.includes("vulnerability") ||
    haystack.includes("incident") ||
    haystack.includes("siem") ||
    haystack.includes("soc") ||
    haystack.includes("infosec") ||
    (haystack.includes("security") && !haystack.includes("social security"))
  ) {
    const featureEntities = buildFeatureEntities("Cloud Perimeter", "High Severity • Blocked", "Neutralized");
    const entities = featureEntities.length > 0 ? featureEntities : [
      { id: "SEC-101", name: "Credential Stuffing & Botnet Surge", category: "Cloud Perimeter", metric: "High Severity • 4,200 req/s Blocked", status: "Neutralized", timestamp: "Just now" },
      { id: "SEC-102", name: "Anomalous Privilege Escalation Attempt", category: "Zero-Trust Access", metric: "Critical • Session Revoked", status: "Quarantined", timestamp: "8m ago" },
      { id: "SEC-103", name: "Outdated TLS 1.0 Handshake Probe", category: "Endpoint Threat", metric: "Low Severity • Dropped", status: "Resolved", timestamp: "25m ago" },
      { id: "SEC-104", name: "Volumetric UDP Flood Amplification", category: "DDoS Mitigation", metric: "High Severity • 48 Gbps Scrubbed", status: "Neutralized", timestamp: "45m ago" }
    ];

    return {
      key: "security",
      domainTitle: `${safeName} — Threat Defense & Access Sentinel`,
      domainSubtitle: "Real-time Threat Interception, Zero-Trust Auditing & SIEM Telemetry",
      entityNameSingular: "Security Alert",
      entityNamePlural: "Security Alerts",
      addButtonLabel: "+ Log Threat Policy",
      addModalTitle: "Register Security Threat Policy",
      addNamePlaceholder: "e.g. Block ASN 48291 Subnet Anomalies",
      categories: ["Cloud Perimeter", "Zero-Trust Access", "Endpoint Threat", "DDoS Mitigation"],
      kpis: [
        { title: "Intercepted Threats", value: "42,890 Blocked", change: "↑ 100% automated quarantine", positive: true },
        { title: "Mean Detection Time", value: "1.2 sec", change: "Real-time eBPF kernel inspection", positive: true },
        { title: "Active Policies", value: "184 Enforced", change: "Zero-trust identity verification", positive: true },
        { title: "Compliance Score", value: "99.98%", change: "SOC2 & ISO 27001 verified", positive: true }
      ],
      chart: {
        title: "Real-Time Threat Interception & Anomaly Velocity",
        subtitle: "Perimeter attacks neutralized across edge firewalls",
        label: "Threats / Sec",
        labels: ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00", "Now"],
        data: [120, 180, 490, 850, 720, 960, 1100]
      },
      tableColumns: ["Incident ID", "Threat Signature & Vector", "Policy Layer", "Severity & Telemetry", "Status", "Actions"],
      defaultEntities: entities,
      sampleBatchNames: ["SQL Injection Web Application Probe", "Unauthorized API Token Replay", "Cross-Site Scripting (XSS) Block"],
      defaultNewMetric: "Medium Severity • Blocked",
      defaultNewStatus: "Neutralized"
    };
  }

  // 16. Hospitality / Hotel / Resort / Room / Lodging
  if (
    haystack.includes("hotel") ||
    haystack.includes("resort") ||
    haystack.includes("hospitality") ||
    haystack.includes("room booking") ||
    haystack.includes("lodging") ||
    haystack.includes("guest")
  ) {
    const featureEntities = buildFeatureEntities("Deluxe Suite", "$340/night • Confirmed", "Confirmed");
    const entities = featureEntities.length > 0 ? featureEntities : [
      { id: "HTL-101", name: "Alexander Wright — Ocean Panorama Villa", category: "Ocean Villa", metric: "$620/night • 4 Nights", status: "Checked In", timestamp: "Just now" },
      { id: "HTL-102", name: "Sophia Zhang — Executive King Suite", category: "Executive King", metric: "$380/night • 2 Nights", status: "Confirmed", timestamp: "20m ago" },
      { id: "HTL-103", name: "Marcus Vance — Penthouse Skylight Suite", category: "Penthouse Suite", metric: "$950/night • 5 Nights", status: "Checked In", timestamp: "1h ago" },
      { id: "HTL-104", name: "Emma Watson — Garden Deluxe King", category: "Deluxe Suite", metric: "$290/night • 3 Nights", status: "Completed", timestamp: "3h ago" }
    ];

    return {
      key: "hospitality",
      domainTitle: `${safeName} — Guest Bookings & Concierge`,
      domainSubtitle: "Real-time Room Reservations, Guest Check-ins & Amenity Service",
      entityNameSingular: "Reservation",
      entityNamePlural: "Reservations",
      addButtonLabel: "+ New Reservation",
      addModalTitle: "Book Hotel Room Reservation",
      addNamePlaceholder: "e.g. Liam Miller — Deluxe Ocean Suite",
      categories: ["Ocean Villa", "Executive King", "Penthouse Suite", "Deluxe Suite"],
      kpis: [
        { title: "Room Occupancy", value: "94.2%", change: "↑ 142 rooms currently occupied", positive: true },
        { title: "Today's Check-ins", value: "38 Arrivals", change: "Keyless mobile check-in active", positive: true },
        { title: "Guest Satisfaction", value: "4.96 / 5.0", change: "Based on 2,100 verified reviews", positive: true },
        { title: "RevPAR Yield", value: "$284.00", change: "Peak seasonal yield optimization", positive: true }
      ],
      chart: {
        title: "Daily Guest Bookings & Room Revenue Velocity",
        subtitle: "Gross room booking volume across hotel suites",
        label: "Bookings / Day",
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        data: [28, 34, 42, 51, 68, 72, 65]
      },
      tableColumns: ["Booking ID", "Guest Name & Suite Category", "Room Class", "Rate & Stay Length", "Status", "Actions"],
      defaultEntities: entities,
      sampleBatchNames: ["Charlotte Davis — Executive King", "Oliver Smith — Ocean Villa", "Lucas Martin — Penthouse Suite"],
      defaultNewMetric: "$320/night • 2 Nights",
      defaultNewStatus: "Confirmed"
    };
  }

  // 17. Smart Universal Semantic Extractor (For ANY custom prompt or novel domain)
  // Extracts the real entity noun, custom categories, KPIs, and uses the project's actual features!
  const words = safeName.split(/\s+/).filter(w => 
    !["app", "platform", "system", "enterprise", "portal", "hub", "flow", "ai", "cloud", "pro", "application", "management", "tool", "dashboard", "service", "software"].includes(w.toLowerCase())
  );
  const derivedSubject = words[words.length - 1] || words[0] || (config.category || "Domain Record");
  const pluralSubject = derivedSubject.toLowerCase().endsWith("s") ? derivedSubject : `${derivedSubject}s`;

  // Use actual features to populate entities with domain realism
  const featureEntities = (config.features && config.features.length > 0)
    ? config.features.slice(0, 4).map((f, i) => ({
        id: `${derivedSubject.replace(/[^A-Za-z]/g, "").slice(0, 3).toUpperCase() || "ITM"}-0${i + 1}`,
        name: f.name,
        category: f.priority ? `${f.priority} Priority` : "Core Workflow",
        metric: f.description.slice(0, 45) + (f.description.length > 45 ? "..." : ""),
        status: "Active",
        timestamp: i === 0 ? "Just now" : `${(i + 1) * 8}m ago`
      }))
    : [
        { id: "REC-01", name: `${derivedSubject} Primary Operational Unit`, category: "Core Operations", metric: "Operational • Sub-2ms Latency", status: "Active", timestamp: "Just now" },
        { id: "REC-02", name: `${derivedSubject} Real-Time Ingestion Channel`, category: "Processing", metric: "Active • 99.9% Uptime", status: "Active", timestamp: "5m ago" },
        { id: "REC-03", name: `${derivedSubject} Reactive Client Controller`, category: "UI & Event Layer", metric: "Interactive • Zero Lag", status: "Active", timestamp: "12m ago" },
        { id: "REC-04", name: `${derivedSubject} Verification & Audit Engine`, category: "Security & State", metric: "Integrity Verified", status: "Active", timestamp: "25m ago" }
      ];

  const derivedCategories = config.features && config.features.length >= 3
    ? Array.from(new Set(config.features.map(f => f.priority ? `${f.priority} Tier` : "Core Operations"))).concat(["Analytics", "Workflow"]).slice(0, 4)
    : ["Core Operations", "Processing", "UI & Event Layer", "Security & State"];

  return {
    key: "adaptive",
    domainTitle: `${safeName} — Live Operational Hub`,
    domainSubtitle: `Real-time Interactive Application synthesized for "${config.summary || safeName}"`,
    entityNameSingular: derivedSubject,
    entityNamePlural: pluralSubject,
    addButtonLabel: `+ Add ${derivedSubject}`,
    addModalTitle: `Create / Register ${derivedSubject}`,
    addNamePlaceholder: `e.g. New ${derivedSubject} Entry`,
    categories: derivedCategories,
    kpis: [
      { title: `Active ${pluralSubject}`, value: `${featureEntities.length} Online`, change: "↑ 100% operational readiness", positive: true },
      { title: "Execution SLA", value: "99.98%", change: "Sub-millisecond reactivity", positive: true },
      { title: "Processing Velocity", value: "12.4 ms", change: "Zero runtime bottlenecks", positive: true },
      { title: "System Reliability", value: "99.9%", change: "All services verified green", positive: true }
    ],
    chart: {
      title: `${safeName} Activity & Operations Trend`,
      subtitle: `Real-time activity distribution across ${pluralSubject.toLowerCase()} workflows`,
      label: "Operations / Hour",
      labels: ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00", "Now"],
      data: [140, 280, 620, 1140, 980, 1450, 1680]
    },
    tableColumns: ["Record ID", `${derivedSubject} Name & Specification`, "Category", "Operational Metric", "Status", "Actions"],
    defaultEntities: featureEntities,
    sampleBatchNames: [`${derivedSubject} Unit Alpha`, `${derivedSubject} Unit Beta`, `${derivedSubject} Unit Gamma`],
    defaultNewMetric: "Operational • Verified",
    defaultNewStatus: "Active"
  };
}

export function generateDomainAppHtml(config: DomainAppConfig): string {
  const profile = detectDomainProfile(config);
  const entitiesJson = JSON.stringify(profile.defaultEntities, null, 2);
  const chartLabelsJson = JSON.stringify(profile.chart.labels);
  const chartDataJson = JSON.stringify(profile.chart.data);
  const sampleNamesJson = JSON.stringify(profile.sampleBatchNames);
  const defaultMetric = profile.defaultNewMetric || "Active • Verified SLA";
  const defaultStatus = profile.defaultNewStatus || "Online";

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
              item.status === 'Online' || item.status === 'Admitted' || item.status === 'In Stock' || item.status === 'Settled' || item.status === 'Done' || item.status === 'Operational' || item.status === 'Enforced' || item.status === 'Completed' || item.status === 'En Route' || item.status === 'Active' || item.status === 'Available' || item.status === 'Streaming' || item.status === 'Confirmed'
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
                             e.status === 'In Progress' ? 'Done' :
                             e.status === 'Dispatched' ? 'Resolved' :
                             e.status === 'Resolved' ? 'In Progress' :
                             e.status === 'En Route' ? 'Landed' :
                             e.status === 'In Transit' ? 'Delivered' :
                             e.status === 'Delivered' ? 'In Transit' :
                             e.status === 'Neutralized' ? 'Quarantined' :
                             e.status === 'Quarantined' ? 'Resolved' :
                             e.status === 'Checked In' ? 'Completed' :
                             e.status === 'Completed' ? 'Active' :
                             e.status === 'Available' ? 'Leased' :
                             e.status === 'Streaming' ? 'Paused' :
                             e.status === 'Active' ? 'Standby' : 'Active';
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
          metric: "${defaultMetric}",
          status: "${defaultStatus}",
          timestamp: "Just now"
        });
        renderTable();
        showToast("Created " + newId + ": " + name.trim());
      }
    }

    function simulateSampleBatch() {
      const categories = ${JSON.stringify(profile.categories)};
      const sampleNames = ${sampleNamesJson};
      for (let i = 0; i < sampleNames.length; i++) {
        const newId = "${profile.key.toUpperCase().slice(0, 4)}-" + Math.floor(100 + Math.random() * 900);
        entities.unshift({
          id: newId,
          name: sampleNames[i] + " (" + (entities.length + 1) + ")",
          category: categories[i % categories.length],
          metric: "${defaultMetric}",
          status: "${defaultStatus}",
          timestamp: "Just now"
        });
      }
      renderTable();
      showToast("Ingested 3 sample ${profile.entityNamePlural}");
    }

    function pingAll() {
      showToast("All ${profile.entityNamePlural} synchronized & active");
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
