import type { Project } from "@/lib/types";

export const projects: Project[] = [
  {
    id: "worldstream-deployer", title: "Datacenter Deployer", client: "Worldstream Netherlands", domain: "Infrastructure",
    challenge: "Build an application to handle deployment of configuration to datacenter switches, replacing manual and error-prone processes.",
    approach: "Developed a deployer app in Go running on Kubernetes with gRPC for backend communication and a React frontend for operator management.",
    result: "Automated switch configuration deployment across the datacenter infrastructure.",
    tech: ["Go", "Kubernetes", "gRPC", "React"],
  },
  {
    id: "volvo-energy", title: "Energy Service Cloud", client: "Volvo Energy", domain: "IoT / Energy",
    challenge: "Build a scalable cloud backend for wallboxes and other IoT energy devices requiring real-time communication via MQTT and OCPP protocols.",
    approach: "Designed an actor-based architecture using Microsoft Orleans on AWS. Implemented gRPC for internal service communication and GraphQL for client APIs.",
    result: "Production cloud platform managing IoT energy devices with real-time monitoring and control capabilities.",
    tech: ["C#", "Orleans", "AWS", "MQTT", "OCPP", "gRPC", "GraphQL"],
  },
  {
    id: "collector-bank", title: "Banking Platform Modernization", client: "Collector Bank", domain: "Banking / FinTech",
    challenge: "Modernize critical banking infrastructure including credit evaluation, fraud detection, and regulatory compliance on a legacy platform.",
    approach: "Architected microservices on Azure/Kubernetes using C#, CQRS, and Event Sourcing. Built dedicated systems for credit evaluation, anti-fraud, GDPR compliance, and AML.",
    result: "Four major systems delivered: credit evaluation, modernized anti-fraud, GDPR data purging, and AML integration — all running on Kubernetes.",
    tech: ["C#", "Azure", "Kubernetes", "CQRS", "Event Sourcing"],
  },
  {
    id: "stena-line", title: "Booking System Transformation", client: "Stena Line", domain: "Shipping / Logistics",
    challenge: "Transform a monolithic booking system into a distributed architecture to improve scalability and team autonomy.",
    approach: "Applied bounded context decomposition using C# and ASP.NET Core. Defined clear service boundaries and communication patterns.",
    result: "Successfully decomposed the monolith into distributed services with well-defined bounded contexts.",
    tech: ["C#", "ASP.NET Core", "Distributed Systems"],
  },
  {
    id: "worldstream", title: "VXLAN Automation Platform", client: "Worldstream Netherlands", domain: "Infrastructure",
    challenge: "Automate VXLAN network setup for a cloud/infrastructure provider to reduce manual configuration and errors.",
    approach: "Built from scratch in Go using Domain-Driven Design, CQRS, and Event Sourcing patterns for a clean, maintainable architecture.",
    result: "Automated VXLAN provisioning system reducing setup time and eliminating manual configuration errors.",
    tech: ["Go", "DDD", "CQRS", "Event Sourcing"],
  },
];
