import os
import matplotlib.pyplot as plt
import matplotlib.patches as patches
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

OUTPUT_DIR = "/Users/omkar/.gemini/antigravity/scratch/buildflow-ai"
DOCX_PATH = os.path.join(OUTPUT_DIR, "BuildFlow_AI_Platform_and_Agents_Whitepaper.docx")

# Set matplotlib styling
plt.rcParams['font.family'] = 'sans-serif'
plt.rcParams['font.sans-serif'] = ['DejaVu Sans', 'Arial', 'Helvetica']

def create_flowchart_1(output_path):
    """End-to-End Platform Workflow Diagram"""
    fig, ax = plt.subplots(figsize=(11, 6), dpi=300)
    ax.set_facecolor('#0F172A')
    fig.patch.set_facecolor('#0F172A')

    # Title
    ax.text(5.5, 5.5, "BuildFlow AI: End-to-End Autonomous Engineering Lifecycle", 
            ha='center', va='center', color='#F8FAFC', fontsize=14, fontweight='bold')

    # Draw Stage Boxes
    stages = [
        {"x": 0.5, "y": 3.4, "w": 2.0, "h": 1.4, "title": "1. Prompt Ingestion", "desc": "Natural language idea\nDomain intent classifier\nContext extraction", "color": "#3B82F6", "bg": "#1E293B"},
        {"x": 3.0, "y": 3.4, "w": 2.2, "h": 1.4, "title": "2. Swarm Orchestrator", "desc": "Multi-agent coordinator\nStage state machine\nInter-agent message bus", "color": "#8B5CF6", "bg": "#1E293B"},
        {"x": 5.7, "y": 3.4, "w": 2.4, "h": 1.4, "title": "3. 4-Agent Execution", "desc": "• Architect (ADR/ERD)\n• Builder (Full-Stack)\n• QA (Tests/Security)\n• DevOps (Docker/CI)", "color": "#EC4899", "bg": "#1E293B"},
        {"x": 8.6, "y": 3.4, "w": 2.0, "h": 1.4, "title": "4. Output Synthesis", "desc": "Interactive Web App\nExpress Server & DB\nTest suite & Docker", "color": "#10B981", "bg": "#1E293B"}
    ]

    for s in stages:
        rect = patches.FancyBboxPatch((s["x"], s["y"]), s["w"], s["h"],
                                      boxstyle="round,pad=0.08,rounding_size=0.15",
                                      linewidth=2, edgecolor=s["color"], facecolor=s["bg"])
        ax.add_patch(rect)
        ax.text(s["x"] + s["w"]/2, s["y"] + s["h"] - 0.3, s["title"],
                ha='center', va='center', color=s["color"], fontsize=10.5, fontweight='bold')
        ax.text(s["x"] + s["w"]/2, s["y"] + (s["h"] - 0.3)/2, s["desc"],
                ha='center', va='center', color='#CBD5E1', fontsize=8.5, linespacing=1.3)

    # Connecting Arrows
    arrow_props = dict(facecolor='#64748B', edgecolor='#94A3B8', width=2, headwidth=8, headlength=8)
    for i in range(len(stages) - 1):
        x_start = stages[i]["x"] + stages[i]["w"] + 0.05
        x_end = stages[i+1]["x"] - 0.05
        y = 4.1
        ax.annotate('', xy=(x_end, y), xytext=(x_start, y), arrowprops=arrow_props)

    # Deliverables Banner at Bottom
    deliv_box = patches.FancyBboxPatch((0.5, 0.7), 10.1, 1.8,
                                       boxstyle="round,pad=0.08,rounding_size=0.15",
                                       linewidth=1.5, edgecolor='#38BDF8', facecolor='#1E293B')
    ax.add_patch(deliv_box)
    ax.text(5.55, 2.15, "AUTOMATICALLY GENERATED PRODUCTION ASSETS",
            ha='center', va='center', color='#38BDF8', fontsize=10, fontweight='bold')

    assets = [
        ("Live Interactive Web App", "Real-time sandbox with KPI graphs, interactive controls, and mock data stores"),
        ("Express.js Backend & API", "Production REST endpoints, typed schemas, and in-memory mock database"),
        ("Vitest Test Suite & Security Audit", "18 automated unit tests verifying input validation & edge cases"),
        ("Production Deployment Package (.zip)", "Single-command Dockerfile, docker-compose.yml, and GitHub Actions CI/CD")
    ]

    col_w = 2.4
    for i, (head, sub) in enumerate(assets):
        cx = 0.7 + i * 2.5
        ax.text(cx + 1.15, 1.6, f"✓ {head}", ha='center', va='center', color='#F8FAFC', fontsize=8.5, fontweight='bold')
        ax.text(cx + 1.15, 1.1, sub, ha='center', va='center', color='#94A3B8', fontsize=7, wrap=True, multialignment='center')

    ax.set_xlim(0, 11)
    ax.set_ylim(0, 6)
    ax.axis('off')
    plt.tight_layout()
    plt.savefig(output_path, dpi=300, facecolor=fig.get_facecolor(), bbox_inches='tight')
    plt.close()
    print("Flowchart 1 generated successfully.")

def create_flowchart_2(output_path):
    """Multi-Agent Collaboration & Self-Healing Feedback Loop"""
    fig, ax = plt.subplots(figsize=(11, 6.2), dpi=300)
    ax.set_facecolor('#0B0F19')
    fig.patch.set_facecolor('#0B0F19')

    ax.text(5.5, 5.7, "Autonomous Multi-Agent Swarm: Collaboration & Self-Healing Loop", 
            ha='center', va='center', color='#F8FAFC', fontsize=13.5, fontweight='bold')

    agents = [
        {"x": 0.5, "y": 3.4, "w": 2.1, "h": 1.6, "role": "System Architect", "sub": "ADR-001 & Architecture", "tasks": "• Schema modeling\n• ERD design\n• Tech stack selection", "color": "#3B82F6", "bg": "#131E32"},
        {"x": 3.2, "y": 3.4, "w": 2.2, "h": 1.6, "role": "Full-Stack Builder", "sub": "Code Synthesis", "tasks": "• Single-page web app\n• Express REST API\n• React Dashboard UI", "color": "#10B981", "bg": "#0D281E"},
        {"x": 6.0, "y": 3.4, "w": 2.2, "h": 1.6, "role": "QA & Security Auditor", "sub": "Testing & Audit", "tasks": "• 18 Unit Tests\n• Edge case validation\n• OWASP security review", "color": "#EF4444", "bg": "#2A1215"},
        {"x": 8.7, "y": 3.4, "w": 1.9, "h": 1.6, "role": "DevOps Engineer", "sub": "Release & Deploy", "tasks": "• Dockerfile setup\n• CI/CD pipeline\n• Zip package bundle", "color": "#8B5CF6", "bg": "#221538"}
    ]

    for a in agents:
        rect = patches.FancyBboxPatch((a["x"], a["y"]), a["w"], a["h"],
                                      boxstyle="round,pad=0.08,rounding_size=0.15",
                                      linewidth=2, edgecolor=a["color"], facecolor=a["bg"])
        ax.add_patch(rect)
        ax.text(a["x"] + a["w"]/2, a["y"] + a["h"] - 0.25, a["role"],
                ha='center', va='center', color=a["color"], fontsize=10, fontweight='bold')
        ax.text(a["x"] + a["w"]/2, a["y"] + a["h"] - 0.55, a["sub"],
                ha='center', va='center', color='#94A3B8', fontsize=8, style='italic')
        ax.text(a["x"] + a["w"]/2, a["y"] + 0.5, a["tasks"],
                ha='center', va='center', color='#E2E8F0', fontsize=8, linespacing=1.3)

    # Standard progression arrows
    ax.annotate('', xy=(3.15, 4.2), xytext=(2.65, 4.2),
                arrowprops=dict(facecolor='#3B82F6', edgecolor='#60A5FA', width=2, headwidth=7, headlength=7))
    ax.annotate('', xy=(5.95, 4.2), xytext=(5.45, 4.2),
                arrowprops=dict(facecolor='#10B981', edgecolor='#34D399', width=2, headwidth=7, headlength=7))
    ax.annotate('', xy=(8.65, 4.2), xytext=(8.25, 4.2),
                arrowprops=dict(facecolor='#EF4444', edgecolor='#F87171', width=2, headwidth=7, headlength=7))

    # Self-Healing Feedback Loop (Red curved arrow below from QA to Builder)
    arc = patches.FancyArrowPatch((7.0, 3.35), (4.3, 3.35),
                                 connectionstyle="arc3,rad=0.45",
                                 color='#F59E0B', linewidth=2.5,
                                 arrowstyle='->', mutation_scale=15)
    ax.add_patch(arc)
    ax.text(5.65, 2.05, "SELF-HEALING FEEDBACK LOOP\n(QA flags edge-case failures → Builder refactors code)",
            ha='center', va='center', color='#FBBF24', fontsize=9, fontweight='bold')

    # Verification Box at bottom
    verify_box = patches.FancyBboxPatch((0.5, 0.4), 10.1, 1.2,
                                        boxstyle="round,pad=0.08,rounding_size=0.15",
                                        linewidth=1.5, edgecolor='#10B981', facecolor='#062016')
    ax.add_patch(verify_box)
    ax.text(5.55, 1.15, "✓ 100% AUTONOMOUS HARMONIZATION ACROSS AGENTS",
            ha='center', va='center', color='#34D399', fontsize=9.5, fontweight='bold')
    ax.text(5.55, 0.7, "No human intervention needed: agents cross-reference specifications, resolve runtime exceptions, and synthesize unified code.",
            ha='center', va='center', color='#A7F3D0', fontsize=8)

    ax.set_xlim(0, 11)
    ax.set_ylim(0, 6.2)
    ax.axis('off')
    plt.tight_layout()
    plt.savefig(output_path, dpi=300, facecolor=fig.get_facecolor(), bbox_inches='tight')
    plt.close()
    print("Flowchart 2 generated successfully.")

def create_flowchart_3(output_path):
    """Platform Layered Architecture Diagram"""
    fig, ax = plt.subplots(figsize=(11, 6), dpi=300)
    ax.set_facecolor('#090D16')
    fig.patch.set_facecolor('#090D16')

    ax.text(5.5, 5.6, "BuildFlow AI: System Architecture Stack", 
            ha='center', va='center', color='#F8FAFC', fontsize=14, fontweight='bold')

    layers = [
        {"y": 4.3, "h": 0.9, "name": "1. PRESENTATION & INTERFACE LAYER", "tech": "Next.js 16 App Router • Tailwind CSS • Framer Motion • Lucide Icons • Live App Iframe Sandbox", "color": "#38BDF8"},
        {"y": 3.2, "h": 0.9, "name": "2. SWARM ORCHESTRATION & EVENT BUS", "tech": "State Machine (Planning → Building → QA → Deploy) • Agent Activity HUD • Real-time Log Streams", "color": "#818CF8"},
        {"y": 2.1, "h": 0.9, "name": "3. AI SYNTHESIS & INFERENCE LAYER", "tech": "Cloud Groq Llama-3.3-70b • Local Ollama Llama-3.2 Fallback • Structured Prompt Pipelines", "color": "#F472B6"},
        {"y": 1.0, "h": 0.9, "name": "4. CODE SYNTHESIS & DOMAIN RUNTIME", "tech": "Domain App Engine (Tailwind/Lucide) • Express REST Server Generator • Vitest Test Synthesizer", "color": "#34D399"},
        {"y": -0.1, "h": 0.9, "name": "5. PACKAGING, ARTIFACTS & EXPORT", "tech": "In-Browser JSZip Engine • Docker Multi-Stage Packaging • GitHub Actions CI/CD Bundle", "color": "#FBBF24"}
    ]

    for lay in layers:
        rect = patches.FancyBboxPatch((0.5, lay["y"]), 10.0, lay["h"],
                                      boxstyle="round,pad=0.08,rounding_size=0.12",
                                      linewidth=1.8, edgecolor=lay["color"], facecolor='#131B2E')
        ax.add_patch(rect)
        ax.text(5.5, lay["y"] + 0.58, lay["name"],
                ha='center', va='center', color=lay["color"], fontsize=10, fontweight='bold')
        ax.text(5.5, lay["y"] + 0.25, lay["tech"],
                ha='center', va='center', color='#CBD5E1', fontsize=8.5)

    ax.set_xlim(0, 11)
    ax.set_ylim(-0.3, 6.0)
    ax.axis('off')
    plt.tight_layout()
    plt.savefig(output_path, dpi=300, facecolor=fig.get_facecolor(), bbox_inches='tight')
    plt.close()
    print("Flowchart 3 generated successfully.")

def set_cell_background(cell, fill_hex):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = parse_xml(f'<w:tcMar {nsdecls("w")}><w:top w:w="{top}" w:type="dxa"/><w:bottom w:w="{bottom}" w:type="dxa"/><w:left w:w="{left}" w:type="dxa"/><w:right w:w="{right}" w:type="dxa"/></w:tcMar>')
    tcPr.append(tcMar)

def add_callout(doc, text, title="KEY ARCHITECTURAL HIGHLIGHT", border_color="2563EB", bg_color="F8FAFC"):
    table = doc.add_table(rows=1, cols=1)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False
    
    cell = table.cell(0, 0)
    cell.width = Inches(6.5)
    set_cell_background(cell, bg_color)
    set_cell_margins(cell, top=140, bottom=140, left=200, right=200)
    
    # Left border only
    tcPr = cell._tc.get_or_add_tcPr()
    borders = parse_xml(f'<w:tcBorders {nsdecls("w")}><w:top w:val="none"/><w:left w:val="single" w:sz="36" w:space="0" w:color="{border_color}"/><w:bottom w:val="none"/><w:right w:val="none"/></w:tcBorders>')
    tcPr.append(borders)
    
    p = cell.paragraphs[0]
    p.paragraph_format.space_before = Pt(2)
    p.paragraph_format.space_after = Pt(2)
    run_title = p.add_run(f"📌 {title}: ")
    run_title.bold = True
    run_title.font.name = "Arial"
    run_title.font.size = Pt(10)
    run_title.font.color.rgb = RGBColor(30, 58, 138)
    
    run_text = p.add_run(text)
    run_text.font.name = "Arial"
    run_text.font.size = Pt(9.5)
    run_text.font.color.rgb = RGBColor(51, 65, 85)
    
    doc.add_paragraph().paragraph_format.space_after = Pt(4)

def build_word_document():
    doc = Document()

    # Configure Margins
    for section in doc.sections:
        section.top_margin = Inches(1.0)
        section.bottom_margin = Inches(1.0)
        section.left_margin = Inches(1.0)
        section.right_margin = Inches(1.0)

    # Styles
    style_normal = doc.styles['Normal']
    style_normal.font.name = 'Arial'
    style_normal.font.size = Pt(10.5)
    style_normal.font.color.rgb = RGBColor(30, 41, 59)

    # Document Header / Title
    p_title = doc.add_paragraph()
    p_title.paragraph_format.space_before = Pt(0)
    p_title.paragraph_format.space_after = Pt(4)
    run_title = p_title.add_run("BuildFlow AI Technical Whitepaper")
    run_title.font.name = "Arial"
    run_title.font.size = Pt(26)
    run_title.bold = True
    run_title.font.color.rgb = RGBColor(15, 23, 42)

    p_sub = doc.add_paragraph()
    p_sub.paragraph_format.space_before = Pt(0)
    p_sub.paragraph_format.space_after = Pt(16)
    run_sub = p_sub.add_run("Autonomous Multi-Agent Software Engineering Platform & Technical Blueprint")
    run_sub.font.name = "Arial"
    run_sub.font.size = Pt(14)
    run_sub.font.color.rgb = RGBColor(37, 99, 235)

    # Metadata Table
    meta_table = doc.add_table(rows=2, cols=3)
    meta_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    meta_data = [
        [("Platform Version", "v2.5.0 Enterprise"), ("Execution Swarm", "4 Autonomous Agents"), ("Synthesis Engine", "Llama-3.3-70B / Ollama")],
        [("Architecture", "Hexagonal / Multi-Agent"), ("Release Type", "Production Ready"), ("Deployment Target", "Docker / Cloud Native")]
    ]
    for r_idx, row in enumerate(meta_data):
        for c_idx, (k, v) in enumerate(row):
            c = meta_table.cell(r_idx, c_idx)
            c.width = Inches(2.1)
            set_cell_background(c, "F1F5F9")
            set_cell_margins(c, 80, 80, 100, 100)
            p = c.paragraphs[0]
            p.paragraph_format.space_after = Pt(0)
            r1 = p.add_run(f"{k}: ")
            r1.font.size = Pt(8.5)
            r1.bold = True
            r1.font.color.rgb = RGBColor(71, 85, 105)
            r2 = p.add_run(v)
            r2.font.size = Pt(8.5)
            r2.font.color.rgb = RGBColor(15, 23, 42)

    doc.add_paragraph().paragraph_format.space_after = Pt(8)

    # 1. Executive Summary
    h1 = doc.add_heading(level=1)
    r = h1.add_run("1. Executive Summary & Platform Vision")
    r.font.color.rgb = RGBColor(15, 23, 42)
    h1.paragraph_format.space_before = Pt(14)
    h1.paragraph_format.space_after = Pt(6)

    doc.add_paragraph(
        "BuildFlow AI is an autonomous, multi-agent AI software engineering platform engineered to bridge "
        "the gap between high-level conceptual ideas and live, executable, production-ready software systems. "
        "Traditional software prototyping requires extensive manual effort across architectural modeling, database schema "
        "creation, frontend prototyping, backend API authoring, unit test composition, and deployment scripting. "
        "BuildFlow AI compresses this entire multi-week engineering pipeline into seconds."
    )

    doc.add_paragraph(
        "By orchestrating an autonomous swarm of four specialized AI agents—the Lead System Architect, the Full-Stack Systems Builder, "
        "the Quality & Security Auditor, and the DevOps Release Engineer—the platform synthesizes not merely static mockups or text descriptions, "
        "but a live, fully functional, domain-tailored interactive application, complete source code, a mock Express REST API, automated test suites, "
        "and a turnkey Docker container deployment package."
    )

    add_callout(
        doc,
        "BuildFlow AI eliminates boilerplate software development by transforming natural language specifications into interactive, running software applications verified by automated self-healing test loops.",
        "CORE VALUE PROPOSITION"
    )

    # 2. Autonomous Multi-Agent Swarm
    h1 = doc.add_heading(level=1)
    r = h1.add_run("2. The Autonomous Agent Swarm Architecture")
    r.font.color.rgb = RGBColor(15, 23, 42)
    h1.paragraph_format.space_before = Pt(14)
    h1.paragraph_format.space_after = Pt(6)

    doc.add_paragraph(
        "At the core of BuildFlow AI is a decentralized multi-agent swarm architecture. Each agent operates with a discrete persona, "
        "domain-specific heuristics, specialized system prompts, and strict accountability for a phase of the development lifecycle."
    )

    # Agent Table
    agent_table = doc.add_table(rows=5, cols=3)
    agent_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    headers = ["Agent Persona", "Primary Responsibilities", "Synthesized Deliverables"]
    for i, h in enumerate(headers):
        c = agent_table.cell(0, i)
        set_cell_background(c, "1E293B")
        set_cell_margins(c, 100, 100, 120, 120)
        p = c.paragraphs[0]
        r = p.add_run(h)
        r.bold = True
        r.font.size = Pt(9.5)
        r.font.color.rgb = RGBColor(255, 255, 255)

    agent_data = [
        ("Lead System Architect\n(System Architect Agent)",
         "• Architectural Decision Records (ADR-001)\n• Component decomposition & topology\n• Relational database ERD modeling\n• RESTful & GraphQL API contract specifications",
         "Mermaid Architecture Graphs, SQL DDL schema, API route tables, System trade-off analysis"),
        
        ("Full-Stack Systems Builder\n(Full-Stack Builder Agent)",
         "• Single-Page Interactive Web Application\n• Express.js backend REST server & CRUD handlers\n• React client dashboard components with live state\n• Modern styling via Tailwind CSS & Lucide icons",
         "public/index.html (Live running app),\nserver.ts (Express CRUD backend),\nMainDashboard.tsx (React UI)"),
        
        ("Quality & Security Auditor\n(QA & Testing Agent)",
         "• Comprehensive Vitest automated unit test suites\n• OWASP Top 10 security vulnerability scanning\n• Input boundary & edge-case stress verification\n• Self-healing bug detection & refactor loop",
         "tests/api.unit.test.ts (18 Unit Tests),\nSecurity Audit report, Pass/Fail verification matrix"),
        
        ("DevOps & Release Engineer\n(DevOps & Release Agent)",
         "• Multi-stage Alpine Dockerfile generation\n• Container orchestration with docker-compose.yml\n• Production CI/CD workflow (.github/workflows)\n• One-click exportable deployment bundle (.zip)",
         "Dockerfile, docker-compose.yml,\nproduction-deploy.yml, deploy.sh,\n<slug>-deployment-package.zip")
    ]

    for row_idx, data in enumerate(agent_data, start=1):
        for col_idx, text in enumerate(data):
            c = agent_table.cell(row_idx, col_idx)
            set_cell_background(c, "F8FAFC" if row_idx % 2 == 1 else "FFFFFF")
            set_cell_margins(c, 90, 90, 110, 110)
            p = c.paragraphs[0]
            p.paragraph_format.space_after = Pt(0)
            r = p.add_run(text)
            r.font.size = Pt(9)
            if col_idx == 0:
                r.bold = True
                r.font.color.rgb = RGBColor(30, 58, 138)
            else:
                r.font.color.rgb = RGBColor(51, 65, 85)

    doc.add_paragraph().paragraph_format.space_after = Pt(8)

    # 3. Flowcharts & Operational Lifecycle
    h1 = doc.add_heading(level=1)
    r = h1.add_run("3. End-to-End Operational Lifecycle & Flowcharts")
    r.font.color.rgb = RGBColor(15, 23, 42)
    h1.paragraph_format.space_before = Pt(14)
    h1.paragraph_format.space_after = Pt(6)

    doc.add_paragraph(
        "The following flowchart illustrates the complete lifecycle from the user's initial prompt submission "
        "through multi-agent coordination, automated code synthesis, and final containerized deployment package export:"
    )

    # Insert Flowchart 1
    flowchart1_img = os.path.join(OUTPUT_DIR, "flowchart1_lifecycle.png")
    create_flowchart_1(flowchart1_img)
    p_img1 = doc.add_paragraph()
    p_img1.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_img1.paragraph_format.space_before = Pt(6)
    p_img1.paragraph_format.space_after = Pt(2)
    doc.add_picture(flowchart1_img, width=Inches(6.4))
    
    p_cap1 = doc.add_paragraph()
    p_cap1.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_cap1.paragraph_format.space_after = Pt(12)
    r_cap1 = p_cap1.add_run("Figure 1: End-to-End Autonomous Engineering Lifecycle from User Prompt to Production Assets")
    r_cap1.font.size = Pt(8.5)
    r_cap1.font.italic = True
    r_cap1.font.color.rgb = RGBColor(100, 116, 139)

    # 4. Multi-Agent Collaboration & Self-Healing Loop
    h1 = doc.add_heading(level=1)
    r = h1.add_run("4. Agent Collaboration & Self-Healing Feedback Loop")
    r.font.color.rgb = RGBColor(15, 23, 42)
    h1.paragraph_format.space_before = Pt(14)
    h1.paragraph_format.space_after = Pt(6)

    doc.add_paragraph(
        "A critical innovation in BuildFlow AI is the closed-loop self-healing mechanism between the Full-Stack Builder Agent "
        "and the QA & Security Auditor Agent. Rather than executing linearly and failing silently, the QA Auditor evaluates the generated "
        "code against 18 stringent unit tests and boundary conditions. If an anomaly is identified, a high-priority feedback event "
        "is dispatched back to the Builder Agent, which autonomously applies a refactoring patch."
    )

    # Insert Flowchart 2
    flowchart2_img = os.path.join(OUTPUT_DIR, "flowchart2_feedback_loop.png")
    create_flowchart_2(flowchart2_img)
    p_img2 = doc.add_paragraph()
    p_img2.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_img2.paragraph_format.space_before = Pt(6)
    p_img2.paragraph_format.space_after = Pt(2)
    doc.add_picture(flowchart2_img, width=Inches(6.4))
    
    p_cap2 = doc.add_paragraph()
    p_cap2.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_cap2.paragraph_format.space_after = Pt(12)
    r_cap2 = p_cap2.add_run("Figure 2: Autonomous Multi-Agent Swarm Collaboration and Self-Healing Feedback Loop")
    r_cap2.font.size = Pt(8.5)
    r_cap2.font.italic = True
    r_cap2.font.color.rgb = RGBColor(100, 116, 139)

    add_callout(
        doc,
        "The QA Auditor acts as a zero-trust gatekeeper. Docker containerization and release packaging are blocked until the self-healing feedback loop achieves 100% test pass rates across all synthesized API contracts.",
        "QUALITY ASSURANCE PROTOCOL"
    )

    # 5. Platform Technical Architecture Stack
    h1 = doc.add_heading(level=1)
    r = h1.add_run("5. Platform Technical Architecture Stack")
    r.font.color.rgb = RGBColor(15, 23, 42)
    h1.paragraph_format.space_before = Pt(14)
    h1.paragraph_format.space_after = Pt(6)

    doc.add_paragraph(
        "BuildFlow AI is engineered on a modern cloud-native stack comprising Next.js 16 (React Server Components), "
        "Tailwind CSS, Framer Motion, Groq Llama-3.3-70B API inference, and local Ollama fallback support."
    )

    # Insert Flowchart 3
    flowchart3_img = os.path.join(OUTPUT_DIR, "flowchart3_platform_stack.png")
    create_flowchart_3(flowchart3_img)
    p_img3 = doc.add_paragraph()
    p_img3.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_img3.paragraph_format.space_before = Pt(6)
    p_img3.paragraph_format.space_after = Pt(2)
    doc.add_picture(flowchart3_img, width=Inches(6.4))
    
    p_cap3 = doc.add_paragraph()
    p_cap3.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_cap3.paragraph_format.space_after = Pt(12)
    r_cap3 = p_cap3.add_run("Figure 3: Layered Technical System Architecture of the BuildFlow AI Platform")
    r_cap3.font.size = Pt(8.5)
    r_cap3.font.italic = True
    r_cap3.font.color.rgb = RGBColor(100, 116, 139)

    # 6. Core Platform Features & Capabilities
    h1 = doc.add_heading(level=1)
    r = h1.add_run("6. Core Platform Features & User Experience")
    r.font.color.rgb = RGBColor(15, 23, 42)
    h1.paragraph_format.space_before = Pt(14)
    h1.paragraph_format.space_after = Pt(6)

    features = [
        ("Live Interactive Application Sandbox",
         "Synthesizes a responsive, single-page web app tailored to the user's specific domain (E-Commerce, FinTech, Healthcare, Logistics, etc.) embedded in an interactive iframe with full-screen presentation mode."),
        
        ("Custom Visual Architecture & Database Engine",
         "Renders interactive visual diagrams of the system architecture, component dependencies, and database schemas with clickable table relationships and attribute inspections."),
        
        ("Interactive Multi-Agent HUD & Logs",
         "A live Heads-Up Display tracks agent execution across Planning, Building, QA Auditing, and Release phases, providing full traceability of prompt decisions and reasoning."),
        
        ("Domain-Aware Code Synthesis",
         "Generates production TypeScript files: an Express REST API with mock state management, React dashboard components, and Vitest test suites formatted with syntax highlighting and instant clipboard copying."),
        
        ("Instant Deployment Package (.zip) Export",
         "Bundles the entire codebase, multi-stage Dockerfile, docker-compose.yml orchestration file, GitHub Actions CI/CD pipeline, and deployment bash script into a single download with zero server-side latency via JSZip.")
    ]

    for title, desc in features:
        p_feat = doc.add_paragraph()
        p_feat.paragraph_format.space_before = Pt(3)
        p_feat.paragraph_format.space_after = Pt(2)
        r_bullet = p_feat.add_run("• ")
        r_bullet.bold = True
        r_bullet.font.color.rgb = RGBColor(37, 99, 235)
        r_title = p_feat.add_run(f"{title}: ")
        r_title.bold = True
        r_title.font.color.rgb = RGBColor(15, 23, 42)
        r_desc = p_feat.add_run(desc)
        r_desc.font.color.rgb = RGBColor(51, 65, 85)

    doc.add_paragraph().paragraph_format.space_after = Pt(6)

    # 7. Production Deployment Package Specification
    h1 = doc.add_heading(level=1)
    r = h1.add_run("7. Production Deployment Package Specification")
    r.font.color.rgb = RGBColor(15, 23, 42)
    h1.paragraph_format.space_before = Pt(14)
    h1.paragraph_format.space_after = Pt(6)

    doc.add_paragraph(
        "When the user triggers 'Export Deployment Package (.zip)', BuildFlow AI constructs a complete, "
        "self-contained software repository structure designed for immediate container execution:"
    )

    # File structure table
    tree_table = doc.add_table(rows=9, cols=2)
    tree_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    tree_data = [
        ("File Path", "Purpose & Execution Specification"),
        ("public/index.html", "Standalone single-page web application featuring responsive UI and mock state"),
        ("server.ts", "Express REST API backend with CRUD handlers and domain entity models"),
        ("components/features/MainDashboard.tsx", "React dashboard component with domain KPIs, status toggles, and charts"),
        ("tests/api.unit.test.ts", "Vitest test suite verifying route integrity, payload validation, and responses"),
        ("Dockerfile", "Multi-stage Alpine containerization for production serving via Nginx or Node"),
        ("docker-compose.yml", "Container orchestration definition enabling one-command 'docker-compose up'"),
        (".github/workflows/production-deploy.yml", "GitHub Actions CI/CD pipeline for automated testing and container build"),
        ("deploy.sh & README.md", "Automated deployment shell script and comprehensive documentation guide")
    ]

    for r_idx, (fpath, fpurp) in enumerate(tree_data):
        c0 = tree_table.cell(r_idx, 0)
        c1 = tree_table.cell(r_idx, 1)
        c0.width = Inches(2.6)
        c1.width = Inches(3.9)
        if r_idx == 0:
            set_cell_background(c0, "1E293B")
            set_cell_background(c1, "1E293B")
            c0.paragraphs[0].add_run(fpath).font.color.rgb = RGBColor(255, 255, 255)
            c1.paragraphs[0].add_run(fpurp).font.color.rgb = RGBColor(255, 255, 255)
            c0.paragraphs[0].runs[0].bold = True
            c1.paragraphs[0].runs[0].bold = True
        else:
            set_cell_background(c0, "F8FAFC" if r_idx % 2 == 1 else "FFFFFF")
            set_cell_background(c1, "F8FAFC" if r_idx % 2 == 1 else "FFFFFF")
            set_cell_margins(c0, 60, 60, 90, 90)
            set_cell_margins(c1, 60, 60, 90, 90)
            r0 = c0.paragraphs[0].add_run(fpath)
            r0.font.name = "Courier New"
            r0.font.size = Pt(8.5)
            r0.bold = True
            r0.font.color.rgb = RGBColor(30, 58, 138)
            r1 = c1.paragraphs[0].add_run(fpurp)
            r1.font.size = Pt(8.5)
            r1.font.color.rgb = RGBColor(51, 65, 85)

    doc.add_paragraph().paragraph_format.space_after = Pt(10)

    # 8. Conclusion
    h1 = doc.add_heading(level=1)
    r = h1.add_run("8. Conclusion & Future Roadmap")
    r.font.color.rgb = RGBColor(15, 23, 42)
    h1.paragraph_format.space_before = Pt(14)
    h1.paragraph_format.space_after = Pt(6)

    doc.add_paragraph(
        "BuildFlow AI establishes a new paradigm in generative software engineering. By moving beyond static code snippets "
        "to a coordinated multi-agent engineering team that plans, builds, audits, tests, and packages live software, "
        "the platform enables engineering teams to validate concepts at unprecedented velocity while maintaining enterprise quality standards."
    )

    doc.add_paragraph(
        "Upcoming milestones include multi-modal design mockup imports (Figma to App), automated cloud deployment integrations "
        "(AWS ECS, GCP Cloud Run, Vercel), and persistent vector memory across engineering sessions."
    )

    doc.save(DOCX_PATH)
    print(f"Word document successfully built and saved to: {DOCX_PATH}")

if __name__ == "__main__":
    build_word_document()
