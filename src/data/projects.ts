import type { Project } from "@/lib/types";

export const projects: Project[] = [
  {
    id: "worldstream-deployer", title: "Datacenter Deployer", client: "Worldstream Netherlands", domain: "Infrastructure",
    challenge: "The datacenter was using a licensed third-party product for switch configuration deployment and wanted to replace it with their own software, better tailored to their needs and vendor agnostic.",
    approach: "Built a deployer app in Go running on Kubernetes, with gRPC for the backend and a React frontend for operators.",
    result: "Automated configuration deployment to datacenter switches.",
    tech: ["Go", "Kubernetes", "gRPC", "React"],
  },
  {
    id: "volvo-energy", title: "Energy Service Cloud", client: "Volvo Energy", domain: "IoT / Energy",
    challenge: "Needed a cloud backend to communicate with wallboxes and other energy devices in real time using MQTT and OCPP.",
    approach: "Used Microsoft Orleans on AWS for an actor-based setup, with gRPC between services and GraphQL for the client API.",
    result: "A working cloud platform that manages IoT energy devices with real-time monitoring and control.",
    tech: ["C#", "Orleans", "AWS", "MQTT", "OCPP", "gRPC", "GraphQL"],
  },
  {
    id: "collector-bank", title: "Banking Platform", client: "Collector Bank", domain: "Banking / FinTech",
    challenge: "Several core banking systems needed to be built or modernized — credit evaluation, savings accounts, fraud detection, and regulatory compliance.",
    approach: "Built microservices on Azure and Kubernetes using C#, CQRS, and Event Sourcing for each system.",
    result: "Delivered five systems: credit evaluation, savings accounts, anti-fraud, GDPR data cleanup, and anti-money laundering integration.",
    tech: ["C#", "Azure", "Kubernetes", "CQRS", "Event Sourcing"],
  },
  {
    id: "stena-line", title: "Booking System Modernization", client: "Stena Line", domain: "Shipping / Logistics",
    challenge: "A large monolithic booking system needed to be split up to make it easier to work on and scale.",
    approach: "Broke the system into smaller services with clear boundaries using C# and ASP.NET Core.",
    result: "The monolith was split into separate distributed services that teams could work on independently.",
    tech: ["C#", "ASP.NET Core", "Distributed Systems"],
  },
  {
    id: "worldstream-vxlan", title: "VXLAN/EVPN Automation", client: "Worldstream Netherlands", domain: "Infrastructure",
    challenge: "Setting up VXLAN/EVPN networks at the datacenter was done manually, which took time and led to mistakes.",
    approach: "Built the system from scratch in Go using DDD, CQRS, and Event Sourcing.",
    result: "Automated the VXLAN/EVPN setup process, cutting down setup time and removing manual errors.",
    tech: ["Go", "DDD", "CQRS", "Event Sourcing"],
  },
];
