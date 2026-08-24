import type { CareerEvent } from "@/lib/types";

export const careerEvents: CareerEvent[] = [
  {
    id: "devbit-freelance",
    type: "RoleStarted",
    timestamp: "2022-08",
    endTimestamp: "present",
    source: "Devbit Consulting AB",
    payload: {
      role: { en: "Freelance System Architect / Developer", sv: "Frilansande systemarkitekt / utvecklare" },
      domain: { en: "Consulting", sv: "Konsultuppdrag" },
      tech: ["Go", "C#", "Orleans", "AWS", "Azure", "Kubernetes", "gRPC", "GraphQL", "Azure DevOps", "Terraform", "GitLab CI", "OpenShift"],
    },
    children: [
      {
        id: "worldstream-deployer",
        type: "ProjectDelivered",
        timestamp: "2025-06",
        endTimestamp: "2026-06",
        source: "Worldstream Netherlands",
        payload: {
          scope: {
            en: "Built a deployer system that handles configuration deployment to datacenter switches, using Go, Kubernetes, gRPC, and React, with GitLab CI pipelines",
            sv: "Byggde ett deployer-system som hanterar konfigurationsdeployment till datacenter-switchar, med Go, Kubernetes, gRPC och React, med GitLab CI-pipelines",
          },
        },
      },
      {
        id: "volvo-energy-cloud",
        type: "ProjectDelivered",
        timestamp: "2023-12",
        endTimestamp: "2025-06",
        source: "Volvo Energy",
        payload: {
          scope: {
            en: "Built a cloud backend for wallboxes and other energy devices using MQTT, OCPP, Orleans, AWS, gRPC, and GraphQL, and owned the DevOps side with Azure DevOps pipelines and Terraform",
            sv: "Byggde en molnbaserad backend för wallboxar och andra energienheter med MQTT, OCPP, Orleans, AWS, gRPC och GraphQL, och ansvarade för DevOps med Azure DevOps-pipelines och Terraform",
          },
        },
      },
      {
        id: "stena-booking",
        type: "ProjectDelivered",
        timestamp: "2023-01",
        endTimestamp: "2023-12",
        source: "Stena Line",
        payload: {
          scope: {
            en: "Helped establish distributed architecture patterns and started the migration of the booking system from monolith to separate services using C# and ASP.NET Core, deployed to OpenShift via Azure DevOps",
            sv: "Hjälpte till att etablera mönster för distribuerad arkitektur och inledde migreringen av bokningssystemet från monolit till separata tjänster med C# och ASP.NET Core, deployade till OpenShift via Azure DevOps",
          },
        },
      },
      {
        id: "worldstream-freelance",
        type: "ProjectDelivered",
        timestamp: "2022-08",
        endTimestamp: "2023-01",
        source: "Worldstream Netherlands",
        payload: {
          scope: {
            en: "Continued working on the VXLAN/EVPN automation systems as a freelancer",
            sv: "Fortsatte arbeta med VXLAN/EVPN-automatiseringen som frilansare",
          },
        },
      },
    ],
  },
  {
    id: "devbit-founded",
    type: "CompanyFounded",
    timestamp: "2022",
    source: "Devbit Consulting AB",
    payload: { status: "available_for_hire" },
  },
  {
    id: "evolve-afry",
    type: "RoleStarted",
    timestamp: "2021-03",
    endTimestamp: "2022-08",
    source: "Evolve / Afry",
    payload: {
      role: { en: "Consultant Architect / Developer", sv: "Konsultarkitekt / utvecklare" },
      domain: { en: "Consulting", sv: "Konsultuppdrag" },
      tech: ["Go", "C#", "Azure", "Kubernetes", "DDD", "CQRS", "Event Sourcing", "Azure DevOps"],
    },
    children: [
      {
        id: "worldstream-vxlan",
        type: "ProjectDelivered",
        timestamp: "2021-09",
        endTimestamp: "2022-08",
        source: "Worldstream Netherlands",
        payload: {
          scope: {
            en: "Built system to automate VXLAN/EVPN network setup using Go, DDD, CQRS, and Event Sourcing",
            sv: "Byggde system för att automatisera VXLAN/EVPN-nätverksuppsättning med Go, DDD, CQRS och Event Sourcing",
          },
        },
      },
      {
        id: "cuviva-migration",
        type: "ProjectDelivered",
        timestamp: "2021-03",
        endTimestamp: "2021-09",
        source: "Cuviva",
        payload: {
          scope: {
            en: "Moved an existing system from Azure to a hybrid cloud setup running on Kubernetes, with Azure DevOps pipelines",
            sv: "Flyttade ett befintligt system från Azure till en hybridmolnlösning på Kubernetes, med Azure DevOps-pipelines",
          },
        },
      },
    ],
  },
  {
    id: "collector-bank",
    type: "RoleStarted",
    timestamp: "2017-02",
    endTimestamp: "2021-03",
    source: "Collector Bank",
    payload: {
      role: { en: "Architect", sv: "Arkitekt" },
      domain: { en: "Banking / FinTech", sv: "Bank / FinTech" },
      tech: ["C#", "Azure", "Kubernetes", "CQRS", "Event Sourcing", "Azure DevOps", "Terraform", "ArgoCD"],
    },
    children: [
      {
        id: "collector-credit", type: "ProjectDelivered", timestamp: "2017-02", source: "Collector Bank",
        payload: { scope: { en: "Built a credit evaluation system running on Kubernetes and Azure", sv: "Byggde ett kreditvärderingssystem som körs på Kubernetes och Azure" } },
      },
      {
        id: "collector-savings", type: "ProjectDelivered", timestamp: "2018-01", source: "Collector Bank",
        payload: { scope: { en: "Developed a savings account system for both individual and business customers", sv: "Utvecklade ett sparkontosystem för både privat- och företagskunder" } },
      },
      {
        id: "collector-antifraud", type: "ProjectDelivered", timestamp: "2019-01", source: "Collector Bank",
        payload: { scope: { en: "Updated and improved the anti-fraud detection system", sv: "Uppdaterade och förbättrade bedrägeridetekteringssystemet" } },
      },
      {
        id: "collector-gdpr", type: "ProjectDelivered", timestamp: "2019-06", source: "Collector Bank",
        payload: { scope: { en: "Added GDPR support with routines for erasing personal data, plus reporting", sv: "Lade till GDPR-stöd med rutiner för radering av persondata och rapportering" } },
      },
      {
        id: "collector-aml", type: "ProjectDelivered", timestamp: "2020-01", source: "Collector Bank",
        payload: { scope: { en: "Integrated anti-money laundering (AML) checks into the core banking platform", sv: "Integrerade kontroller mot penningtvätt (AML) i den centrala bankplattformen" } },
      },
      {
        id: "collector-devops", type: "ProjectDelivered", timestamp: "2020-06", source: "Collector Bank",
        payload: { scope: { en: "Ran the DevOps side of the platform: Azure DevOps pipelines, Terraform, and GitOps delivery to Kubernetes with ArgoCD", sv: "Ansvarade för DevOps i plattformen: Azure DevOps-pipelines, Terraform och GitOps-leverans till Kubernetes med ArgoCD" } },
      },
    ],
  },
  {
    id: "autocom",
    type: "RoleStarted",
    timestamp: "2007-08",
    endTimestamp: "2017-02",
    source: "Autocom Diagnostic Partner",
    payload: {
      role: { en: "Software Developer", sv: "Mjukvaruutvecklare" },
      domain: { en: "Automotive Diagnostics", sv: "Fordonsdiagnostik" },
      tech: ["C#", ".NET"],
    },
    children: [
      {
        id: "autocom-reverse", type: "ProjectDelivered", timestamp: "2007-08", source: "Autocom",
        payload: { scope: { en: "Built tools for capturing and simulating vehicle diagnostic protocols", sv: "Byggde verktyg för att fånga och simulera fordonsdiagnostiska protokoll" } },
      },
      {
        id: "autocom-licensing", type: "ProjectDelivered", timestamp: "2010-01", source: "Autocom",
        payload: { scope: { en: "Designed and built a licensing system for the diagnostic products", sv: "Designade och byggde ett licenssystem för diagnostikprodukterna" } },
      },
      {
        id: "autocom-testing", type: "ProjectDelivered", timestamp: "2013-01", source: "Autocom",
        payload: { scope: { en: "Built a system for testing and preparing devices before shipping", sv: "Byggde ett system för att testa och förbereda enheter före leverans" } },
      },
    ],
  },
  {
    id: "edu-west",
    type: "EducationCompleted",
    timestamp: "2001",
    endTimestamp: "2005",
    source: "University West",
    payload: { degree: { en: "Computer Science / Information Systems", sv: "Datavetenskap / Informationssystem" } },
  },
  {
    id: "edu-thu",
    type: "EducationCompleted",
    timestamp: "1996",
    endTimestamp: "1998",
    source: "Högskolan Trollhättan/Uddevalla",
    payload: { degree: { en: "Business Economics", sv: "Företagsekonomi" } },
  },
];
