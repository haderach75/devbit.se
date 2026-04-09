import type { CareerEvent } from "@/lib/types";

export const careerEvents: CareerEvent[] = [
  {
    id: "volvo-energy", type: "RoleStarted", timestamp: "2023-12", endTimestamp: "present", source: "Volvo Energy",
    payload: { role: "Architect / Developer", domain: "IoT / Energy", tech: ["C#", "Orleans", "AWS", "MQTT", "OCPP", "gRPC", "GraphQL"] },
    children: [{ id: "volvo-energy-cloud", type: "ProjectInProgress", timestamp: "2023-12", source: "Volvo Energy", payload: { scope: "Cloud backend for wallboxes & IoT energy devices" } }],
  },
  {
    id: "stena-line", type: "RoleStarted", timestamp: "2023-01", endTimestamp: "2023-12", source: "Stena Line",
    payload: { role: "Architect / Developer", domain: "Shipping / Logistics", tech: ["C#", "ASP.NET Core"] },
    children: [{ id: "stena-booking", type: "ProjectDelivered", timestamp: "2023-01", source: "Stena Line", payload: { scope: "Monolithic booking system transformation into distributed architecture" } }],
  },
  {
    id: "worldstream", type: "RoleStarted", timestamp: "2021-09", endTimestamp: "2023-01", source: "Worldstream Netherlands",
    payload: { role: "Architect / Developer", domain: "Infrastructure / Cloud Provider", tech: ["Go", "DDD", "CQRS", "Event Sourcing"] },
    children: [{ id: "worldstream-vxlan", type: "ProjectDelivered", timestamp: "2021-09", source: "Worldstream", payload: { scope: "Remodeled and developed systems for automating VXLAN setup" } }],
  },
  {
    id: "cuviva", type: "RoleStarted", timestamp: "2021-03", endTimestamp: "2021-09", source: "Cuviva",
    payload: { role: "Developer / DevOps", domain: "Medtech", tech: ["C#", "Azure", "Kubernetes"] },
    children: [{ id: "cuviva-migration", type: "ProjectDelivered", timestamp: "2021-03", source: "Cuviva", payload: { scope: "Migration from Azure to hybrid cloud infrastructure in Kubernetes" } }],
  },
  {
    id: "collector-bank", type: "RoleStarted", timestamp: "2017-02", endTimestamp: "2021-03", source: "Collector Bank",
    payload: { role: "Architect", domain: "Banking / FinTech", tech: ["C#", "Azure", "Kubernetes", "CQRS", "Event Sourcing"] },
    children: [
      { id: "collector-credit", type: "ProjectDelivered", timestamp: "2017-02", source: "Collector Bank", payload: { scope: "Credit evaluation system on Kubernetes and Azure" } },
      { id: "collector-antifraud", type: "ProjectDelivered", timestamp: "2018-01", source: "Collector Bank", payload: { scope: "Modernized and scaled Anti-Fraud system" } },
      { id: "collector-gdpr", type: "ProjectDelivered", timestamp: "2019-01", source: "Collector Bank", payload: { scope: "GDPR compliance through data purging procedures and reports" } },
      { id: "collector-aml", type: "ProjectDelivered", timestamp: "2020-01", source: "Collector Bank", payload: { scope: "Anti-Money Laundering solution integrated with existing systems" } },
    ],
  },
  {
    id: "autocom", type: "RoleStarted", timestamp: "2007-08", endTimestamp: "2017-02", source: "Autocom Diagnostic Partner",
    payload: { role: "Software Developer", domain: "Automotive Diagnostics", tech: ["C#", ".NET"] },
    children: [
      { id: "autocom-reverse", type: "ProjectDelivered", timestamp: "2007-08", source: "Autocom", payload: { scope: "Reverse engineering tools for vehicle diagnostic protocols" } },
      { id: "autocom-licensing", type: "ProjectDelivered", timestamp: "2010-01", source: "Autocom", payload: { scope: "Architected and developed distributed licensing solution" } },
      { id: "autocom-testing", type: "ProjectDelivered", timestamp: "2013-01", source: "Autocom", payload: { scope: "Distributed system for device testing and preparation" } },
    ],
  },
  { id: "edu-west", type: "EducationCompleted", timestamp: "2001", endTimestamp: "2005", source: "University West", payload: { degree: "Computer Science / System Development" } },
  { id: "edu-thu", type: "EducationCompleted", timestamp: "1996", endTimestamp: "1998", source: "Högskolan Trollhättan/Uddevalla", payload: { degree: "Business Economics" } },
  { id: "devbit-founded", type: "CompanyFounded", timestamp: "present", source: "Devbit Consulting AB", payload: { status: "available_for_hire" } },
];
