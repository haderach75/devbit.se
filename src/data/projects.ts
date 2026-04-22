import type { Project } from "@/lib/types";

export const projects: Project[] = [
  {
    id: "worldstream-deployer",
    title: { en: "Datacenter Deployer", sv: "Deployer för datacenter" },
    client: "Worldstream Netherlands",
    domain: { en: "Infrastructure", sv: "Infrastruktur" },
    challenge: {
      en: "The datacenter was using a licensed third-party product for switch configuration deployment and wanted to replace it with their own software, better tailored to their needs and vendor agnostic.",
      sv: "Datacentret använde en licensierad tredjepartsprodukt för konfigurationsdeployment till switchar och ville ersätta den med en egen lösning, bättre anpassad till deras behov och leverantörsoberoende.",
    },
    approach: {
      en: "Built a deployer app in Go running on Kubernetes, with gRPC for the backend and a React frontend for operators.",
      sv: "Byggde en deployer-app i Go som kör på Kubernetes, med gRPC i backend och ett React-gränssnitt för operatörer.",
    },
    result: {
      en: "Automated configuration deployment to datacenter switches.",
      sv: "Automatiserad konfigurationsdeployment till datacenter-switchar.",
    },
    tech: ["Go", "Kubernetes", "gRPC", "React"],
  },
  {
    id: "volvo-energy",
    title: { en: "Energy Service Cloud", sv: "Energy Service Cloud" },
    client: "Volvo Energy",
    domain: { en: "EV Charging / Automotive", sv: "EV-laddning / Fordon" },
    challenge: {
      en: "Needed a cloud backend to communicate with wallboxes and other energy devices in real time using MQTT and OCPP.",
      sv: "Behövde ett molnbaserat backend för att kommunicera med wallboxar och andra energi-enheter i realtid via MQTT och OCPP.",
    },
    approach: {
      en: "Used Microsoft Orleans on AWS for an actor-based setup, with gRPC between services and GraphQL for the client API.",
      sv: "Använde Microsoft Orleans på AWS för en aktörsbaserad lösning, med gRPC mellan tjänster och GraphQL för klient-API:et.",
    },
    result: {
      en: "A working cloud platform that manages IoT energy devices with real-time monitoring and control.",
      sv: "En fungerande molnplattform som hanterar IoT-energienheter med realtidsövervakning och styrning.",
    },
    tech: ["C#", "Orleans", "AWS", "MQTT", "OCPP", "gRPC", "GraphQL"],
  },
  {
    id: "collector-bank",
    title: { en: "Banking Platform", sv: "Bankplattform" },
    client: "Collector Bank",
    domain: { en: "Banking / FinTech", sv: "Bank / FinTech" },
    challenge: {
      en: "Several core banking systems needed to be built or modernized — credit evaluation, savings accounts, fraud detection, and regulatory compliance.",
      sv: "Flera centrala banksystem behövde byggas eller moderniseras — kreditvärdering, sparkonton, bedrägeridetektering och regelefterlevnad.",
    },
    approach: {
      en: "Built microservices on Azure and Kubernetes using C#, CQRS, and Event Sourcing for each system.",
      sv: "Byggde mikrotjänster på Azure och Kubernetes i C# med CQRS och Event Sourcing för varje system.",
    },
    result: {
      en: "Delivered five systems: credit evaluation, savings accounts, anti-fraud, GDPR data cleanup, and anti-money laundering integration.",
      sv: "Levererade fem system: kreditvärdering, sparkonton, bedrägeriskydd, GDPR-dataröjning och integration för penningtvättskontroll.",
    },
    tech: ["C#", "Azure", "Kubernetes", "CQRS", "Event Sourcing"],
  },
  {
    id: "stena-line",
    title: { en: "Booking System Modernization", sv: "Modernisering av bokningssystem" },
    client: "Stena Line",
    domain: { en: "Shipping / Logistics", sv: "Sjöfart / Logistik" },
    challenge: {
      en: "A large monolithic booking system needed to be broken up to make it easier to work on and scale.",
      sv: "Ett stort monolitiskt bokningssystem behövde brytas upp för att bli enklare att arbeta med och skala.",
    },
    approach: {
      en: "Defined distributed architecture patterns and service boundaries using C# and ASP.NET Core. Started the migration from monolith to separate services.",
      sv: "Definierade mönster för distribuerad arkitektur och tjänstegränser med C# och ASP.NET Core. Inledde migreringen från monolit till separata tjänster.",
    },
    result: {
      en: "Established the architectural foundation and patterns for the ongoing transformation of the booking system.",
      sv: "La den arkitektoniska grunden och mönster för den pågående omvandlingen av bokningssystemet.",
    },
    tech: ["C#", "ASP.NET Core", "Distributed Systems"],
  },
  {
    id: "worldstream-vxlan",
    title: { en: "VXLAN/EVPN Automation", sv: "Automatisering av VXLAN/EVPN" },
    client: "Worldstream Netherlands",
    domain: { en: "Infrastructure", sv: "Infrastruktur" },
    challenge: {
      en: "Setting up VXLAN/EVPN networks at the datacenter was done manually, which took time and led to mistakes.",
      sv: "VXLAN/EVPN-nätverken i datacentret sattes upp manuellt, vilket tog tid och ledde till fel.",
    },
    approach: {
      en: "Built the system from scratch in Go using DDD, CQRS, and Event Sourcing.",
      sv: "Byggde systemet från grunden i Go med DDD, CQRS och Event Sourcing.",
    },
    result: {
      en: "Automated the VXLAN/EVPN setup process, cutting down setup time and removing manual errors.",
      sv: "Automatiserade uppsättningen av VXLAN/EVPN, vilket kapade uppsättningstiden och eliminerade manuella fel.",
    },
    tech: ["Go", "DDD", "CQRS", "Event Sourcing"],
  },
];
