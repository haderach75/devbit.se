import type { Project } from "@/lib/types";

export const projects: Project[] = [
  {
    id: "worldstream-deployer",
    title: { en: "Datacenter Deployer", sv: "Deployer för datacenter" },
    client: "Worldstream Netherlands",
    domain: { en: "Infrastructure", sv: "Infrastruktur" },
    challenge: {
      en: "The datacenter was using a licensed third-party product for switch configuration deployment and wanted to replace it with their own vendor-agnostic software.",
      sv: "Datacentret använde en licensierad tredjepartsprodukt för konfigurationsdeployment till switchar och ville ersätta den med en egen leverantörsoberoende lösning.",
    },
    approach: {
      en: "Built a deployer app in Go running on Kubernetes, with gRPC for the backend and a React frontend for operators. Used an AI-assisted workflow for design, implementation, and code review.",
      sv: "Byggde en deployer-app i Go som körs på Kubernetes, med gRPC i backend och ett React-gränssnitt för operatörer. Använde ett AI-assisterat arbetsflöde för design, implementation och kodgranskning.",
    },
    result: {
      en: "Replaced the licensed product. The deployer is in full production and runs stably.",
      sv: "Ersatte den licensierade produkten. Deployern är i full drift och går stabilt.",
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
      sv: "Behövde en molnbaserad backend för att kommunicera med wallboxar och andra energienheter i realtid via MQTT och OCPP.",
    },
    approach: {
      en: "Used Microsoft Orleans on AWS for an actor-based setup, with gRPC between services and GraphQL for the client API. Tried AI-assisted development in different parts of the work to see where it helped, with the clearest gains on the Blazor frontend.",
      sv: "Använde Microsoft Orleans på AWS för en aktörsbaserad lösning, med gRPC mellan tjänster och GraphQL för klient-API:et. Provade AI-assisterad utveckling i olika delar av arbetet för att se var den gjorde nytta, med tydligast effekt på Blazor-frontenden.",
    },
    result: {
      en: "A cloud platform in production with real-time monitoring and control of energy devices. It backs the Volvo wallbox, which went on sale in 31 European markets in March 2025.",
      sv: "En molnplattform i drift med realtidsövervakning och styrning av energienheter. Den ligger bakom Volvos wallbox, som började säljas på 31 europeiska marknader i mars 2025.",
    },
    tech: ["C#", "Orleans", "AWS", "MQTT", "OCPP", "gRPC", "GraphQL", "Blazor"],
  },
  {
    id: "collector-bank",
    title: { en: "Banking Platform", sv: "Bankplattform" },
    client: "Collector Bank",
    domain: { en: "Banking / FinTech", sv: "Bank / FinTech" },
    challenge: {
      en: "Several core banking systems needed to be built or modernized: credit evaluation, savings accounts, fraud detection, and regulatory compliance.",
      sv: "Flera centrala banksystem behövde byggas eller moderniseras: kreditvärdering, sparkonton, bedrägeridetektering och regelefterlevnad.",
    },
    approach: {
      en: "Built microservices on Azure and Kubernetes using C#, CQRS, and Event Sourcing.",
      sv: "Byggde mikrotjänster på Azure och Kubernetes i C# med CQRS och Event Sourcing.",
    },
    result: {
      en: "Delivered five systems: credit evaluation, savings accounts, anti-fraud, GDPR data cleanup, and anti-money laundering integration.",
      sv: "Levererade fem system: kreditvärdering, sparkonton, bedrägeriskydd, radering av persondata enligt GDPR och integration för penningtvättskontroll.",
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
      en: "Defined distributed architecture patterns and service boundaries using C# and ASP.NET Core. Started the migration from monolith to separate services. Also ran a side track with agentic frameworks on OpenAI models. The goal was to see how much of the refactoring from legacy ASP.NET code into the new C# services an agent could handle.",
      sv: "Definierade mönster för distribuerad arkitektur och tjänstegränser med C# och ASP.NET Core. Inledde migreringen från monolit till separata tjänster. Drev även ett sidospår med agentiska ramverk på OpenAI-modeller. Målet var att se hur stor del av refaktoreringen från äldre ASP.NET-kod till de nya C#-tjänsterna som en agent kunde hantera.",
    },
    result: {
      en: "Handed over defined service boundaries, architecture patterns, and a monolith migration already under way.",
      sv: "Lämnade över definierade tjänstegränser, arkitekturmönster och en påbörjad migrering från monoliten.",
    },
    tech: ["C#", "ASP.NET Core", "Distributed Systems"],
  },
  {
    id: "worldstream-vxlan",
    title: { en: "VXLAN/EVPN Automation", sv: "Automatisering av VXLAN/EVPN" },
    client: "Worldstream Netherlands",
    domain: { en: "Infrastructure", sv: "Infrastruktur" },
    challenge: {
      en: "Setting up VXLAN/EVPN networks at the datacenter was done manually. The configuration is complex, so how long it took and how many mistakes crept in depended on the engineer doing it.",
      sv: "VXLAN/EVPN-nätverken i datacentret sattes upp manuellt. Konfigurationen är komplex, så hur lång tid det tog och hur många fel som uppstod berodde på vilken ingenjör som gjorde den.",
    },
    approach: {
      en: "Built the system from scratch in Go using DDD, CQRS, and Event Sourcing.",
      sv: "Byggde systemet från grunden i Go med DDD, CQRS och Event Sourcing.",
    },
    result: {
      en: "Automated the VXLAN/EVPN setup, so the outcome no longer depends on which engineer does the configuration.",
      sv: "Automatiserade uppsättningen av VXLAN/EVPN, så att resultatet inte längre beror på vilken ingenjör som gör konfigurationen.",
    },
    tech: ["Go", "DDD", "CQRS", "Event Sourcing"],
  },
];
