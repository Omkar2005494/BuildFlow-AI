import { z } from "zod";

const zStringArray = z.union([z.string(), z.array(z.string())]).transform(val => Array.isArray(val) ? val : [val]);

export const BuildFlowSchema = z.object({
  buildQualityScore: z.number().min(0).max(100),
  engineeringMetrics: z.object({
    scalability: z.number().min(0).max(100),
    maintainability: z.number().min(0).max(100),
    security: z.number().min(0).max(100),
    complexity: z.enum(["Low", "Medium", "High"]),
    developmentDifficulty: z.enum(["Easy", "Moderate", "Hard"]),
    estimatedBuildTime: z.string(),
  }),
  overview: z.object({
    projectName: z.string(),
    projectCategory: z.string(),
    architectureStyle: z.string(),
    complexityBadge: z.string(),
    estimatedTimeline: z.string(),
    recommendedTeamSize: z.string(),
    buildQuality: z.object({
      overallScore: z.number().min(0).max(100),
      productionReadiness: z.number().min(0).max(100),
      scalability: z.number().min(0).max(100),
      security: z.number().min(0).max(100),
      maintainability: z.number().min(0).max(100),
      performance: z.number().min(0).max(100),
      testability: z.number().min(0).max(100),
    }),
    executiveMetrics: z.object({
      modulesCount: z.number(),
      tablesCount: z.number(),
      apiEndpointsCount: z.number(),
      developmentPhases: z.number(),
      estimatedLOC: z.string(),
      sprintCount: z.number(),
      infrastructureServices: z.number(),
    }),
    executiveSummary: z.string(),
    projectCharacteristics: z.array(z.string()),
    technologySummary: z.array(z.string()),
    readiness: z.object({
      architecture: z.enum(["Ready", "In Progress", "Planned"]),
      database: z.enum(["Ready", "In Progress", "Planned"]),
      api: z.enum(["Ready", "In Progress", "Planned"]),
      folderStructure: z.enum(["Ready", "In Progress", "Planned"]),
      roadmap: z.enum(["Ready", "In Progress", "Planned"]),
      documentation: z.enum(["Ready", "In Progress", "Planned"]),
      deployment: z.enum(["Ready", "In Progress", "Planned"]),
      security: z.enum(["Ready", "In Progress", "Planned"]),
    }),
    aiArchitectInsights: z.array(z.string()),
    businessMetrics: z.object({
      estimatedDevelopmentTime: z.string(),
      estimatedTeamSize: z.string(),
      estimatedProjectCost: z.string(),
      maintenanceComplexity: z.enum(["Low", "Medium", "High", "Very High"]),
      scalingDifficulty: z.enum(["Low", "Medium", "High", "Very High"]),
      technicalRisk: z.enum(["Low", "Medium", "High", "Critical"]),
    }),
  }),
  features: z.array(
    z.object({
      name: z.string(),
      description: z.string(),
      priority: z.string(),
    })
  ),
  techStack: z.object({
    frontend: z.array(
      z.object({ recommendation: z.string(), reason: z.string() })
    ),
    backend: z.array(
      z.object({ recommendation: z.string(), reason: z.string() })
    ),
    infrastructure: z.array(
      z.object({ recommendation: z.string(), reason: z.string() })
    ),
  }),
  architecture: z.object({
    diagram: z.string(),
    description: z.string(),
  }),
  database: z.object({
    diagram: z.string(),
    schemaDescription: z.string(),
    insights: z.object({
      quality: z.object({
        normalizationLevel: z.string(),
        estimatedComplexity: z.enum(["Small", "Medium", "Large"]),
        tableCount: z.number(),
        relationshipCount: z.number(),
        junctionTableCount: z.number(),
        indexedColumns: z.number(),
        estimatedGrowth: z.string(),
      }),
      performance: z.object({
        suggestedIndexes: zStringArray,
        potentialQueryBottlenecks: zStringArray,
        fastestGrowingTables: zStringArray,
        cachingTargets: zStringArray,
        readHeavyTables: zStringArray,
        writeHeavyTables: zStringArray,
      }),
      scalability: z.object({
        partitioningRecommendations: zStringArray,
        archivingStrategy: zStringArray,
        horizontalScaling: zStringArray,
        cachingSuggestions: zStringArray,
        readReplicaRecommendations: zStringArray,
        storageRecommendations: zStringArray,
      }),
      security: z.object({
        sensitiveTables: zStringArray,
        encryptedFields: zStringArray,
        piiStorage: zStringArray,
        auditLogging: zStringArray,
        accessControl: zStringArray,
      }),
      futureExpansion: z.object({
        supportedFeatures: zStringArray,
        requiresAdditionalTables: zStringArray,
        migrationConsiderations: zStringArray,
        potentialModules: zStringArray,
      })
    }).optional(),
  }),
  api: z.union([
    // Legacy schema
    z.array(
      z.object({
        endpoint: z.string(),
        method: z.string(),
        description: z.string(),
        payload: z.string(),
      })
    ),
    // New Production schema
    z.object({
      insights: z.object({
        metrics: z.object({
          totalEndpoints: z.number(),
          publicEndpoints: z.number(),
          protectedEndpoints: z.number(),
          adminEndpoints: z.number(),
          version: z.string(),
          authenticationStrategy: z.string(),
          estimatedRequestsPerDay: z.string(),
        }),
        recommendations: z.object({
          suggestedRateLimits: z.array(z.string()),
          cachingOpportunities: z.array(z.string()),
          performanceConsiderations: z.array(z.string()),
          securityConsiderations: z.array(z.string()),
        })
      }),
      modules: z.array(
        z.object({
          name: z.string(),
          endpoints: z.array(
            z.object({
              method: z.string(),
              route: z.string(),
              description: z.string(),
              authentication: z.string(),
              requiredRoles: z.array(z.string()),
              requestHeaders: z.array(z.object({ name: z.string(), required: z.boolean(), description: z.string() })).optional(),
              queryParameters: z.array(z.object({ name: z.string(), type: z.string(), required: z.boolean(), description: z.string() })).optional(),
              pathParameters: z.array(z.object({ name: z.string(), type: z.string(), description: z.string() })).optional(),
              requestBody: z.any().optional(), // Can be string or JSON object
              responseBody: z.any().optional(),
              validationRules: z.array(z.string()),
              successCodes: z.array(z.object({ code: z.number(), description: z.string() })),
              errorCodes: z.array(z.object({ code: z.number(), description: z.string() })),
              businessLogicNotes: z.array(z.string())
            })
          )
        })
      )
    })
  ]),
  folderStructure: z.union([
    z.string(),
    z.object({
      insights: z.object({
        architectureStyle: z.string(),
        estimatedLoc: z.string(),
        estimatedFiles: z.union([z.string(), z.number()]),
        estimatedFolders: z.union([z.string(), z.number()]),
        recommendedTeamSize: z.string(),
        deploymentStrategy: z.string(),
        scalabilityRating: z.string(),
        maintainabilityRating: z.string(),
        complexityLevel: z.string()
      }),
      tree: z.array(z.lazy(() => z.object({
        name: z.string(),
        type: z.enum(["file", "folder"]),
        description: z.string().optional(),
        purpose: z.string().optional(),
        responsibilities: z.array(z.string()).optional(),
        dependsOn: z.array(z.string()).optional(),
        usedBy: z.array(z.string()).optional(),
        children: z.array(z.any()).optional()
      })))
    })
  ]),
  roadmap: z.union([
    z.array(
      z.object({
        phase: z.string(),
        tasks: z.array(z.string()),
      })
    ),
    z.object({
      insights: z.object({
        totalPhases: z.union([z.number(), z.string()]),
        totalTasks: z.union([z.number(), z.string()]),
        estimatedStoryPoints: z.union([z.number(), z.string()]),
        estimatedDevelopmentTime: z.string(),
        recommendedTeamSize: z.string(),
        criticalPathLength: z.union([z.number(), z.string()]),
        parallelWorkstreams: z.union([z.number(), z.string()]),
        complexity: z.string(),
        architectureReadiness: z.string(),
        testingReadiness: z.string(),
        deploymentReadiness: z.string(),
        projectHealth: z.string(),
      }),
      timeline: z.object({
        totalDuration: z.string(),
        sprintCount: z.union([z.number(), z.string()]),
        recommendedSprintLength: z.string(),
        criticalPath: z.array(z.string()),
        parallelWorkOpportunities: z.array(z.string()),
        slackTime: z.string(),
      }),
      teamRecommendations: z.array(z.object({
        role: z.string(),
        headcount: z.union([z.number(), z.string()]),
        responsibilities: z.array(z.string())
      })),
      aiRecommendations: z.array(z.string()),
      projectEvolution: z.array(z.object({
        version: z.string(),
        goal: z.string()
      })),
      milestones: z.array(z.object({
        title: z.string(),
        description: z.string(),
        targetSprint: z.string(),
        expectedOutcome: z.string(),
        successCriteria: z.array(z.string()),
        dependencies: z.array(z.string()),
        priority: z.enum(["High", "Medium", "Low"])
      })),
      phases: z.array(z.object({
        title: z.string(),
        overview: z.string(),
        objectives: z.array(z.string()),
        deliverables: z.array(z.string()),
        dependencies: z.array(z.string()),
        estimatedDuration: z.string(),
        priority: z.enum(["High", "Medium", "Low"]),
        complexity: z.string(),
        status: z.enum(["Planned", "In Progress", "Blocked", "Completed"]).optional(),
        ownerRole: z.string(),
        resources: z.array(z.string()).optional(),
        completionCriteria: z.array(z.string()),
        tasks: z.array(z.object({
          title: z.string(),
          description: z.string(),
          estimatedEffort: z.string(),
          priority: z.enum(["High", "Medium", "Low"]),
          status: z.enum(["Planned", "In Progress", "Blocked"]),
          acceptanceCriteria: z.array(z.string())
        })),
        risks: z.array(z.object({
          type: z.string().optional(),
          description: z.string().optional(),
          mitigationStrategy: z.string().optional(),
          level: z.string().optional(),
        }).passthrough()).optional()
      }))
    })
  ]),
  documentation: z.object({
    version: z.string(),
    hero: z.object({
      projectName: z.string(),
      tagline: z.string(),
      description: z.string(),
      projectCategory: z.string(),
      architectureStyle: z.string(),
      complexity: z.string(),
      estimatedTimeline: z.string(),
      recommendedTeamSize: z.string(),
      estimatedBudget: z.string(),
      generatedDate: z.string(),
      version: z.string(),
      license: z.string(),
      technologies: z.array(z.string()),
      projectStatus: z.string(),
      buildQualityScore: z.number()
    }),
    sections: z.array(z.object({
      id: z.string(),
      title: z.string(),
      description: z.string(),
      markdown: z.string(),
      order: z.number(),
      icon: z.string(),
      category: z.string(),
      estimatedReadingTime: z.string(),
      importance: z.enum(["Critical", "High", "Medium", "Low"]),
      isCollapsible: z.boolean(),
      relatedSections: z.array(z.string()),
      interactiveReferences: z.array(z.enum([
        "Architecture", "Database", "API", "Folder Structure", 
        "Roadmap", "Risk Analysis", "Future Scope", "Overview"
      ])).catch([]),
      codeBlocks: z.array(z.object({
        language: z.string().optional(),
        title: z.string().optional(),
        description: z.string().optional(),
        code: z.string(),
        collapsible: z.boolean().optional(),
        copyEnabled: z.boolean().optional(),
        expandable: z.boolean().optional()
      })).optional(),
      tables: z.number().optional(),
      callouts: z.number().optional(),
      images: z.number().optional()
    })),
    insights: z.object({
      documentationScore: z.number(),
      completeness: z.string(),
      coverageScore: z.number(),
      enterpriseReadiness: z.string(),
      maintainability: z.string(),
      architectureQuality: z.string(),
      deploymentReadiness: z.string(),
      scalabilityRating: z.string(),
      securityRating: z.string(),
      performanceRating: z.string(),
      documentationHealth: z.string(),
      missingSections: z.array(z.string()),
      aiRecommendations: z.array(z.string()),
      potentialImprovements: z.array(z.string()),
      technicalRisks: z.array(z.string())
    })
  }),
  risks: z.array(
    z.object({
      // Legacy
      risk: z.string().optional(),
      mitigation: z.string().optional(),
      // New Detailed
      type: z.string().optional(),
      title: z.string().optional(),
      severity: z.string().optional(),
      probability: z.string().optional(),
      description: z.string().optional(),
      impactAnalysis: z.string().optional(),
      detectionMethod: z.string().optional(),
      owner: z.string().optional(),
      actionItems: z.array(z.string()).optional(),
      mitigationStrategy: z.string().optional(),
      contingencyPlan: z.string().optional(),
      residualRisk: z.string().optional(),
      financialImpact: z.string().optional(),
    }).passthrough()
  ).optional(),
  futureEnhancements: z.union([
    z.array(z.string()),
    z.array(
      z.object({
        title: z.string().optional(),
        description: z.string().optional(),
        category: z.string().optional(),
        complexity: z.string().optional(),
        businessValue: z.string().optional(),
        technicalPrerequisites: z.array(z.string()).optional(),
      }).passthrough()
    )
  ]).optional(),
});

export type BuildFlow = z.infer<typeof BuildFlowSchema>;
