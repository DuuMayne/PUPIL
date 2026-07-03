import Database from 'better-sqlite3';
import { getDb } from './db';
import { CIS_CONTROLS, CIS_SAFEGUARDS, CIS_NIST_CROSSWALK } from './cis-data';

let seeded = false;

export function seedDatabase(): void {
  if (seeded) return;
  seeded = true;

  const db = getDb();
  seedNistControls(db);
  seedCisControls(db);
  backfillNistFunctionCodes(db);
}

function seedNistControls(db: Database.Database): void {
  const existing = db.prepare('SELECT id FROM frameworks WHERE name = ? AND version = ?').get('NIST CSF', '2.0');
  if (existing) return;

  db.transaction(() => {
    // Framework
    const fw = db.prepare(
      `INSERT INTO frameworks (name, version, description) VALUES (?, ?, ?)`
    ).run(
      'NIST CSF',
      '2.0',
      'NIST Cybersecurity Framework 2.0 — a voluntary framework of cybersecurity standards, guidelines, and practices.'
    );
    const fwId = fw.lastInsertRowid as number;

    const insertControl = db.prepare(
      `INSERT INTO controls (id, framework_id, parent_id, level, code, title, description, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    );

    // ── GV – GOVERN ──────────────────────────────────────────────────────────
    insertControl.run('GV', fwId, null, 'function', 'GV', 'Govern',
      'The organization\'s cybersecurity risk management strategy, expectations, and policy are established, communicated, and monitored.', 1);

    insertControl.run('GV.OC', fwId, 'GV', 'category', 'GV.OC', 'Organizational Context',
      'The circumstances — mission, stakeholder expectations, dependencies — surrounding the organization\'s cybersecurity risk management decisions are understood.', 1);
    insertControl.run('GV.OC-01', fwId, 'GV.OC', 'subcategory', 'GV.OC-01', 'Organizational mission informs cybersecurity risk management',
      'The organizational mission is understood and informs cybersecurity risk management decisions.', 1);
    insertControl.run('GV.OC-02', fwId, 'GV.OC', 'subcategory', 'GV.OC-02', 'Stakeholder needs and expectations are understood',
      'Internal and external stakeholders are understood, and their needs and expectations regarding cybersecurity risk management are understood and considered.', 2);
    insertControl.run('GV.OC-03', fwId, 'GV.OC', 'subcategory', 'GV.OC-03', 'Legal, regulatory, and contractual requirements are managed',
      'Legal, regulatory, and contractual requirements regarding cybersecurity — including privacy and civil liberties obligations — are understood and managed.', 3);
    insertControl.run('GV.OC-04', fwId, 'GV.OC', 'subcategory', 'GV.OC-04', 'Critical objectives and capabilities are understood',
      'Critical objectives, capabilities, and services that stakeholders depend on or expect from the organization are understood and communicated.', 4);
    insertControl.run('GV.OC-05', fwId, 'GV.OC', 'subcategory', 'GV.OC-05', 'Organizational dependencies are understood',
      'Outcomes, capabilities, and services that the organization depends on are understood and communicated.', 5);

    insertControl.run('GV.RM', fwId, 'GV', 'category', 'GV.RM', 'Risk Management Strategy',
      'The organization\'s priorities, constraints, risk tolerance and appetite statements, and assumptions are established, communicated, and used to support operational risk decisions.', 2);
    insertControl.run('GV.RM-01', fwId, 'GV.RM', 'subcategory', 'GV.RM-01', 'Risk management objectives are established',
      'Risk management objectives are established and agreed to by organizational stakeholders.', 1);
    insertControl.run('GV.RM-02', fwId, 'GV.RM', 'subcategory', 'GV.RM-02', 'Risk appetite and tolerance statements are established',
      'Risk appetite and risk tolerance statements are established, communicated, and maintained.', 2);
    insertControl.run('GV.RM-03', fwId, 'GV.RM', 'subcategory', 'GV.RM-03', 'Cybersecurity risk is integrated into enterprise risk management',
      'Cybersecurity risk management activities and outcomes are included in enterprise risk management processes.', 3);
    insertControl.run('GV.RM-04', fwId, 'GV.RM', 'subcategory', 'GV.RM-04', 'Strategic direction for risk response is established',
      'Strategic direction that describes appropriate risk response options is established and communicated.', 4);
    insertControl.run('GV.RM-05', fwId, 'GV.RM', 'subcategory', 'GV.RM-05', 'Lines of communication for cybersecurity risks are established',
      'Lines of communication across the organization are established for cybersecurity risks, including risks from suppliers and other third parties.', 5);
    insertControl.run('GV.RM-06', fwId, 'GV.RM', 'subcategory', 'GV.RM-06', 'Standardized method for calculating and prioritizing risks is established',
      'A standardized method for calculating, documenting, categorizing, and prioritizing cybersecurity risks is established and communicated.', 6);
    insertControl.run('GV.RM-07', fwId, 'GV.RM', 'subcategory', 'GV.RM-07', 'Strategic opportunities are characterized and included in risk discussions',
      'Strategic opportunities (i.e., positive risks) are characterized and are included in organizational cybersecurity risk discussions.', 7);

    insertControl.run('GV.RR', fwId, 'GV', 'category', 'GV.RR', 'Roles, Responsibilities, and Authorities',
      'Cybersecurity roles, responsibilities, and authorities to foster accountability, performance assessment, and continuous improvement are established and communicated.', 3);
    insertControl.run('GV.RR-01', fwId, 'GV.RR', 'subcategory', 'GV.RR-01', 'Leadership is responsible and accountable for cybersecurity risk',
      'Organizational leadership is responsible and accountable for cybersecurity risk and fosters a culture that is risk-aware, ethical, and continually improving.', 1);
    insertControl.run('GV.RR-02', fwId, 'GV.RR', 'subcategory', 'GV.RR-02', 'Cybersecurity roles and responsibilities are established',
      'Roles, responsibilities, and authorities related to cybersecurity risk management are established, communicated, understood, and enforced.', 2);
    insertControl.run('GV.RR-03', fwId, 'GV.RR', 'subcategory', 'GV.RR-03', 'Adequate resources are allocated for cybersecurity',
      'Adequate resources are allocated commensurate with the cybersecurity risk strategy, roles, responsibilities, and policies.', 3);
    insertControl.run('GV.RR-04', fwId, 'GV.RR', 'subcategory', 'GV.RR-04', 'Cybersecurity is included in human resources practices',
      'Cybersecurity is included in human resources practices.', 4);

    insertControl.run('GV.PO', fwId, 'GV', 'category', 'GV.PO', 'Policy',
      'Organizational cybersecurity policy is established, communicated, and enforced.', 4);
    insertControl.run('GV.PO-01', fwId, 'GV.PO', 'subcategory', 'GV.PO-01', 'Cybersecurity policy is established and communicated',
      'Policy for managing cybersecurity risks is established based on organizational context, cybersecurity strategy, and priorities and is communicated and enforced.', 1);
    insertControl.run('GV.PO-02', fwId, 'GV.PO', 'subcategory', 'GV.PO-02', 'Cybersecurity policy is reviewed and updated',
      'Policy for managing cybersecurity risks is reviewed, updated, communicated, and enforced to reflect changes in requirements, threats, technology, and organizational mission.', 2);

    insertControl.run('GV.OV', fwId, 'GV', 'category', 'GV.OV', 'Oversight',
      'Results of organization-wide cybersecurity risk management activities and performance are used to inform, improve, and adjust the risk management strategy.', 5);
    insertControl.run('GV.OV-01', fwId, 'GV.OV', 'subcategory', 'GV.OV-01', 'Cybersecurity risk management strategy outcomes are reviewed',
      'Cybersecurity risk management strategy outcomes are reviewed to inform and adjust strategy and direction.', 1);
    insertControl.run('GV.OV-02', fwId, 'GV.OV', 'subcategory', 'GV.OV-02', 'Cybersecurity risk management strategy is reviewed and adjusted',
      'The cybersecurity risk management strategy is reviewed and adjusted to ensure coverage of organizational requirements and risks.', 2);
    insertControl.run('GV.OV-03', fwId, 'GV.OV', 'subcategory', 'GV.OV-03', 'Organizational cybersecurity risk management performance is evaluated',
      'Organizational cybersecurity risk management performance is evaluated and reviewed for adjustments needed.', 3);

    insertControl.run('GV.SC', fwId, 'GV', 'category', 'GV.SC', 'Cybersecurity Supply Chain Risk Management',
      'Cyber supply chain risk management processes are identified, established, managed, monitored, and improved by organizational stakeholders.', 6);
    insertControl.run('GV.SC-01', fwId, 'GV.SC', 'subcategory', 'GV.SC-01', 'Supply chain risk management program is established',
      'A cybersecurity supply chain risk management program, strategy, objectives, policies, and processes are established and agreed to by organizational stakeholders.', 1);
    insertControl.run('GV.SC-02', fwId, 'GV.SC', 'subcategory', 'GV.SC-02', 'Cybersecurity roles for suppliers are established',
      'Cybersecurity roles and responsibilities for suppliers, customers, and partners are established, communicated, and coordinated internally and externally.', 2);
    insertControl.run('GV.SC-03', fwId, 'GV.SC', 'subcategory', 'GV.SC-03', 'Supply chain risk management is integrated into enterprise risk',
      'Cybersecurity supply chain risk management is integrated into cybersecurity and enterprise risk management, risk assessment, and improvement processes.', 3);
    insertControl.run('GV.SC-04', fwId, 'GV.SC', 'subcategory', 'GV.SC-04', 'Suppliers are known and prioritized by criticality',
      'Suppliers are known and prioritized by criticality.', 4);
    insertControl.run('GV.SC-05', fwId, 'GV.SC', 'subcategory', 'GV.SC-05', 'Cybersecurity requirements are integrated into supplier agreements',
      'Requirements to address cybersecurity risks in supply chains are established, prioritized, and integrated into contracts and other types of agreements with suppliers and other relevant third parties.', 5);
    insertControl.run('GV.SC-06', fwId, 'GV.SC', 'subcategory', 'GV.SC-06', 'Due diligence is performed before entering supplier relationships',
      'Planning and due diligence are performed to reduce risks before entering into formal supplier or other third-party relationships.', 6);
    insertControl.run('GV.SC-07', fwId, 'GV.SC', 'subcategory', 'GV.SC-07', 'Supplier risks are understood and monitored',
      'The risks posed by a supplier, their products and services, and other third parties are understood, recorded, prioritized, assessed, responded to, and monitored over the course of the relationship.', 7);
    insertControl.run('GV.SC-08', fwId, 'GV.SC', 'subcategory', 'GV.SC-08', 'Suppliers are included in incident response activities',
      'Relevant suppliers and other third parties are included in incident planning, response, and recovery activities.', 8);
    insertControl.run('GV.SC-09', fwId, 'GV.SC', 'subcategory', 'GV.SC-09', 'Supply chain security practices are monitored across the lifecycle',
      'Supply chain security practices are integrated into cybersecurity and enterprise risk management programs, and their performance is monitored throughout the technology product and service life cycle.', 9);
    insertControl.run('GV.SC-10', fwId, 'GV.SC', 'subcategory', 'GV.SC-10', 'Supply chain plans include post-relationship provisions',
      'Cybersecurity supply chain risk management plans include provisions for activities that occur after the conclusion of a partnership or service agreement.', 10);

    // ── ID – IDENTIFY ─────────────────────────────────────────────────────────
    insertControl.run('ID', fwId, null, 'function', 'ID', 'Identify',
      'The organization\'s current cybersecurity risks are understood.', 2);

    insertControl.run('ID.AM', fwId, 'ID', 'category', 'ID.AM', 'Asset Management',
      'Assets (data, hardware, software, systems, facilities, services, people) that enable the organization to achieve business purposes are identified and managed consistent with their relative importance to organizational objectives and the organization\'s risk strategy.', 1);
    insertControl.run('ID.AM-01', fwId, 'ID.AM', 'subcategory', 'ID.AM-01', 'Hardware asset inventories are maintained',
      'Inventories of hardware managed by the organization are maintained.', 1);
    insertControl.run('ID.AM-02', fwId, 'ID.AM', 'subcategory', 'ID.AM-02', 'Software and service inventories are maintained',
      'Inventories of software, services, and systems managed by the organization are maintained.', 2);
    insertControl.run('ID.AM-03', fwId, 'ID.AM', 'subcategory', 'ID.AM-03', 'Network communication representations are maintained',
      'Representations of the organization\'s authorized network communication and internal and external network data flows are maintained.', 3);
    insertControl.run('ID.AM-04', fwId, 'ID.AM', 'subcategory', 'ID.AM-04', 'Supplier service inventories are maintained',
      'Inventories of services provided by suppliers are maintained.', 4);
    insertControl.run('ID.AM-05', fwId, 'ID.AM', 'subcategory', 'ID.AM-05', 'Assets are prioritized based on criticality',
      'Assets are prioritized based on classification, criticality, resources, and impact on the mission.', 5);
    insertControl.run('ID.AM-07', fwId, 'ID.AM', 'subcategory', 'ID.AM-07', 'Data inventories and metadata are maintained',
      'Inventories of data and corresponding metadata for designated data types are maintained.', 6);
    insertControl.run('ID.AM-08', fwId, 'ID.AM', 'subcategory', 'ID.AM-08', 'Systems and assets are managed throughout their life cycles',
      'Systems, hardware, software, services, and data are managed throughout their life cycles.', 7);

    insertControl.run('ID.RA', fwId, 'ID', 'category', 'ID.RA', 'Risk Assessment',
      'The cybersecurity risk to the organization, assets, and individuals is understood by the organization.', 2);
    insertControl.run('ID.RA-01', fwId, 'ID.RA', 'subcategory', 'ID.RA-01', 'Vulnerabilities in assets are identified and recorded',
      'Vulnerabilities in assets are identified, validated, and recorded.', 1);
    insertControl.run('ID.RA-02', fwId, 'ID.RA', 'subcategory', 'ID.RA-02', 'Cyber threat intelligence is received from sharing forums',
      'Cyber threat intelligence is received from information sharing forums and sources.', 2);
    insertControl.run('ID.RA-03', fwId, 'ID.RA', 'subcategory', 'ID.RA-03', 'Internal and external threats are identified and recorded',
      'Internal and external threats to the organization are identified and recorded.', 3);
    insertControl.run('ID.RA-04', fwId, 'ID.RA', 'subcategory', 'ID.RA-04', 'Potential impacts and likelihoods are identified',
      'Potential impacts and likelihoods of threats exploiting vulnerabilities are identified and recorded.', 4);
    insertControl.run('ID.RA-05', fwId, 'ID.RA', 'subcategory', 'ID.RA-05', 'Risk is understood and used to inform risk response prioritization',
      'Threats, vulnerabilities, likelihoods, and impacts are used to understand inherent risk and inform risk response prioritization.', 5);
    insertControl.run('ID.RA-06', fwId, 'ID.RA', 'subcategory', 'ID.RA-06', 'Risk responses are chosen, prioritized, and tracked',
      'Risk responses are chosen, prioritized, planned, tracked, and communicated.', 6);
    insertControl.run('ID.RA-07', fwId, 'ID.RA', 'subcategory', 'ID.RA-07', 'Changes and exceptions are managed and assessed for risk',
      'Changes and exceptions are managed, assessed for risk impact, recorded, and tracked.', 7);
    insertControl.run('ID.RA-08', fwId, 'ID.RA', 'subcategory', 'ID.RA-08', 'Vulnerability disclosure processes are established',
      'Processes for receiving, analyzing, and responding to vulnerability disclosures are established.', 8);
    insertControl.run('ID.RA-09', fwId, 'ID.RA', 'subcategory', 'ID.RA-09', 'Authenticity of hardware and software is assessed before acquisition',
      'The authenticity and integrity of hardware and software are assessed prior to acquisition and use.', 9);
    insertControl.run('ID.RA-10', fwId, 'ID.RA', 'subcategory', 'ID.RA-10', 'Critical suppliers are assessed prior to acquisition',
      'Critical suppliers are assessed prior to acquisition.', 10);

    insertControl.run('ID.IM', fwId, 'ID', 'category', 'ID.IM', 'Improvement',
      'Improvements to organizational cybersecurity risk management processes, procedures and activities are identified across all CSF Functions.', 3);
    insertControl.run('ID.IM-01', fwId, 'ID.IM', 'subcategory', 'ID.IM-01', 'Improvements are identified from evaluations',
      'Improvements are identified from evaluations.', 1);
    insertControl.run('ID.IM-02', fwId, 'ID.IM', 'subcategory', 'ID.IM-02', 'Improvements are identified from security tests and exercises',
      'Improvements are identified from security tests and exercises, including those done in coordination with suppliers and relevant third parties.', 2);
    insertControl.run('ID.IM-03', fwId, 'ID.IM', 'subcategory', 'ID.IM-03', 'Improvements are identified from operational processes',
      'Improvements are identified from execution of operational processes, procedures, and activities.', 3);
    insertControl.run('ID.IM-04', fwId, 'ID.IM', 'subcategory', 'ID.IM-04', 'Incident response plans are established and maintained',
      'Incident response plans and other cybersecurity plans that affect operations are established, communicated, maintained, and improved.', 4);

    // ── PR – PROTECT ──────────────────────────────────────────────────────────
    insertControl.run('PR', fwId, null, 'function', 'PR', 'Protect',
      'Safeguards to manage the organization\'s cybersecurity risks are used.', 3);

    insertControl.run('PR.AA', fwId, 'PR', 'category', 'PR.AA', 'Identity Management, Authentication, and Access Control',
      'Access to physical and logical assets is limited to authorized users, services, and hardware and managed commensurate with the assessed risk of unauthorized access.', 1);
    insertControl.run('PR.AA-01', fwId, 'PR.AA', 'subcategory', 'PR.AA-01', 'Identities and credentials for authorized users are managed',
      'Identities and credentials for authorized users, services, and hardware are managed by the organization.', 1);
    insertControl.run('PR.AA-02', fwId, 'PR.AA', 'subcategory', 'PR.AA-02', 'Identities are proofed and bound to credentials',
      'Identities are proofed and bound to credentials based on the context of interactions.', 2);
    insertControl.run('PR.AA-03', fwId, 'PR.AA', 'subcategory', 'PR.AA-03', 'Users, services, and hardware are authenticated',
      'Users, services, and hardware are authenticated.', 3);
    insertControl.run('PR.AA-04', fwId, 'PR.AA', 'subcategory', 'PR.AA-04', 'Identity assertions are protected and verified',
      'Identity assertions are protected, conveyed, and verified.', 4);
    insertControl.run('PR.AA-05', fwId, 'PR.AA', 'subcategory', 'PR.AA-05', 'Access permissions are defined, managed, and reviewed',
      'Access permissions, entitlements, and authorizations are defined in a policy, managed, enforced, and reviewed.', 5);
    insertControl.run('PR.AA-06', fwId, 'PR.AA', 'subcategory', 'PR.AA-06', 'Physical access to assets is managed and monitored',
      'Physical access to assets is managed, monitored, and enforced commensurate with risk.', 6);

    insertControl.run('PR.AT', fwId, 'PR', 'category', 'PR.AT', 'Awareness and Training',
      'The organization\'s personnel are provided with cybersecurity awareness and training so that they can perform their cybersecurity-related tasks.', 2);
    insertControl.run('PR.AT-01', fwId, 'PR.AT', 'subcategory', 'PR.AT-01', 'Personnel are provided with awareness and training',
      'Personnel are provided with awareness and training so that they possess the knowledge and skills to perform general tasks with cybersecurity risks in mind.', 1);
    insertControl.run('PR.AT-02', fwId, 'PR.AT', 'subcategory', 'PR.AT-02', 'Individuals in specialized roles receive targeted training',
      'Individuals in specialized roles are provided with awareness and training so that they possess the knowledge and skills to perform relevant tasks with cybersecurity risks in mind.', 2);

    insertControl.run('PR.DS', fwId, 'PR', 'category', 'PR.DS', 'Data Security',
      'Data are managed consistent with the organization\'s risk strategy to protect the confidentiality, integrity, and availability of information.', 3);
    insertControl.run('PR.DS-01', fwId, 'PR.DS', 'subcategory', 'PR.DS-01', 'Data-at-rest are protected',
      'The confidentiality, integrity, and availability of data-at-rest are protected.', 1);
    insertControl.run('PR.DS-02', fwId, 'PR.DS', 'subcategory', 'PR.DS-02', 'Data-in-transit are protected',
      'The confidentiality, integrity, and availability of data-in-transit are protected.', 2);
    insertControl.run('PR.DS-10', fwId, 'PR.DS', 'subcategory', 'PR.DS-10', 'Data-in-use are protected',
      'The confidentiality, integrity, and availability of data-in-use are protected.', 3);
    insertControl.run('PR.DS-11', fwId, 'PR.DS', 'subcategory', 'PR.DS-11', 'Backups of data are created, protected, and tested',
      'Backups of data are created, protected, maintained, and tested.', 4);

    insertControl.run('PR.PS', fwId, 'PR', 'category', 'PR.PS', 'Platform Security',
      'The hardware, software (e.g., firmware, operating systems, applications), and services of physical and virtual platforms are managed consistent with the organization\'s risk strategy to protect their confidentiality, integrity, and availability.', 4);
    insertControl.run('PR.PS-01', fwId, 'PR.PS', 'subcategory', 'PR.PS-01', 'Configuration management practices are established and applied',
      'Configuration management practices are established and applied.', 1);
    insertControl.run('PR.PS-02', fwId, 'PR.PS', 'subcategory', 'PR.PS-02', 'Software is maintained and removed commensurate with risk',
      'Software is maintained, replaced, and removed commensurate with risk.', 2);
    insertControl.run('PR.PS-03', fwId, 'PR.PS', 'subcategory', 'PR.PS-03', 'Hardware is maintained and removed commensurate with risk',
      'Hardware is maintained, replaced, and removed commensurate with risk.', 3);
    insertControl.run('PR.PS-04', fwId, 'PR.PS', 'subcategory', 'PR.PS-04', 'Log records are created and available for monitoring',
      'Log records are created and made available for continuous monitoring.', 4);
    insertControl.run('PR.PS-05', fwId, 'PR.PS', 'subcategory', 'PR.PS-05', 'Unauthorized software installation and execution are prevented',
      'Installation and execution of unauthorized software are prevented.', 5);
    insertControl.run('PR.PS-06', fwId, 'PR.PS', 'subcategory', 'PR.PS-06', 'Secure software development practices are integrated',
      'Secure software development practices are integrated, and their security is evaluated.', 6);

    insertControl.run('PR.IR', fwId, 'PR', 'category', 'PR.IR', 'Technology Infrastructure Resilience',
      'Security architectures are managed with the organization\'s risk strategy to protect asset confidentiality, integrity, and availability, and organizational resilience.', 5);
    insertControl.run('PR.IR-01', fwId, 'PR.IR', 'subcategory', 'PR.IR-01', 'Networks are protected from unauthorized logical access',
      'Networks and environments are protected from unauthorized logical access and usage.', 1);
    insertControl.run('PR.IR-02', fwId, 'PR.IR', 'subcategory', 'PR.IR-02', 'Technology assets are protected from environmental threats',
      'The organization\'s technology assets are protected from environmental threats.', 2);
    insertControl.run('PR.IR-03', fwId, 'PR.IR', 'subcategory', 'PR.IR-03', 'Mechanisms are implemented to achieve resilience requirements',
      'Mechanisms are implemented to achieve resilience requirements in normal and adverse situations.', 3);
    insertControl.run('PR.IR-04', fwId, 'PR.IR', 'subcategory', 'PR.IR-04', 'Adequate resource capacity is maintained for availability',
      'Adequate resource capacity to ensure availability is maintained.', 4);

    // ── DE – DETECT ───────────────────────────────────────────────────────────
    insertControl.run('DE', fwId, null, 'function', 'DE', 'Detect',
      'Possible cybersecurity attacks and compromises are found and analyzed.', 4);

    insertControl.run('DE.CM', fwId, 'DE', 'category', 'DE.CM', 'Continuous Monitoring',
      'Assets are monitored to find anomalies, indicators of compromise, and other potentially adverse events.', 1);
    insertControl.run('DE.CM-01', fwId, 'DE.CM', 'subcategory', 'DE.CM-01', 'Networks and network services are monitored',
      'Networks and network services are monitored to find potentially adverse events.', 1);
    insertControl.run('DE.CM-02', fwId, 'DE.CM', 'subcategory', 'DE.CM-02', 'The physical environment is monitored',
      'The physical environment is monitored to find potentially adverse events.', 2);
    insertControl.run('DE.CM-03', fwId, 'DE.CM', 'subcategory', 'DE.CM-03', 'Personnel activity and technology usage are monitored',
      'Personnel activity and technology usage are monitored to find potentially adverse events.', 3);
    insertControl.run('DE.CM-06', fwId, 'DE.CM', 'subcategory', 'DE.CM-06', 'External service provider activities are monitored',
      'External service provider activities and services are monitored to find potentially adverse events.', 4);
    insertControl.run('DE.CM-09', fwId, 'DE.CM', 'subcategory', 'DE.CM-09', 'Computing hardware, software, and data are monitored',
      'Computing hardware and software, runtime environments, and their data are monitored to find potentially adverse events.', 5);

    insertControl.run('DE.AE', fwId, 'DE', 'category', 'DE.AE', 'Adverse Event Analysis',
      'Anomalies, indicators of compromise, and other potentially adverse events are analyzed to characterize the events and detect cybersecurity incidents.', 2);
    insertControl.run('DE.AE-02', fwId, 'DE.AE', 'subcategory', 'DE.AE-02', 'Potentially adverse events are analyzed to understand associated activities',
      'Potentially adverse events are analyzed to better understand associated activities.', 1);
    insertControl.run('DE.AE-03', fwId, 'DE.AE', 'subcategory', 'DE.AE-03', 'Information is correlated from multiple sources',
      'Information is correlated from multiple sources.', 2);
    insertControl.run('DE.AE-04', fwId, 'DE.AE', 'subcategory', 'DE.AE-04', 'Impact and scope of adverse events are understood',
      'The estimated impact and scope of adverse events are understood.', 3);
    insertControl.run('DE.AE-06', fwId, 'DE.AE', 'subcategory', 'DE.AE-06', 'Information on adverse events is provided to authorized staff',
      'Information on adverse events is provided to authorized staff and tools.', 4);
    insertControl.run('DE.AE-07', fwId, 'DE.AE', 'subcategory', 'DE.AE-07', 'Cyber threat intelligence is integrated into event analysis',
      'Cyber threat intelligence and other contextual information are integrated into the analysis.', 5);
    insertControl.run('DE.AE-08', fwId, 'DE.AE', 'subcategory', 'DE.AE-08', 'Incidents are declared when adverse events meet defined criteria',
      'Incidents are declared when adverse events meet the defined criteria.', 6);

    // ── RS – RESPOND ──────────────────────────────────────────────────────────
    insertControl.run('RS', fwId, null, 'function', 'RS', 'Respond',
      'Actions regarding a detected cybersecurity incident are taken.', 5);

    insertControl.run('RS.MA', fwId, 'RS', 'category', 'RS.MA', 'Incident Management',
      'Responses to detected cybersecurity incidents are managed.', 1);
    insertControl.run('RS.MA-01', fwId, 'RS.MA', 'subcategory', 'RS.MA-01', 'Incident response plan is executed',
      'The incident response plan is executed in coordination with relevant third parties once an incident is declared.', 1);
    insertControl.run('RS.MA-02', fwId, 'RS.MA', 'subcategory', 'RS.MA-02', 'Incident reports are triaged and validated',
      'Incident reports are triaged and validated.', 2);
    insertControl.run('RS.MA-03', fwId, 'RS.MA', 'subcategory', 'RS.MA-03', 'Incidents are categorized and prioritized',
      'Incidents are categorized and prioritized.', 3);
    insertControl.run('RS.MA-04', fwId, 'RS.MA', 'subcategory', 'RS.MA-04', 'Incidents are escalated as needed',
      'Incidents are escalated or elevated as needed.', 4);
    insertControl.run('RS.MA-05', fwId, 'RS.MA', 'subcategory', 'RS.MA-05', 'Criteria for initiating incident recovery are applied',
      'The criteria for initiating incident recovery are applied.', 5);

    insertControl.run('RS.AN', fwId, 'RS', 'category', 'RS.AN', 'Incident Analysis',
      'Investigations are conducted to ensure effective response and support forensics and recovery activities.', 2);
    insertControl.run('RS.AN-03', fwId, 'RS.AN', 'subcategory', 'RS.AN-03', 'Analysis is performed to establish what occurred and the root cause',
      'Analysis is performed to establish what has taken place during an incident and the root cause of the incident.', 1);
    insertControl.run('RS.AN-06', fwId, 'RS.AN', 'subcategory', 'RS.AN-06', 'Actions during investigation are recorded with integrity',
      'Actions performed during an investigation are recorded, and the records\' integrity and provenance are preserved.', 2);
    insertControl.run('RS.AN-07', fwId, 'RS.AN', 'subcategory', 'RS.AN-07', 'Incident data and metadata are collected with integrity',
      'Incident data and metadata are collected, and their integrity and provenance are preserved.', 3);
    insertControl.run('RS.AN-08', fwId, 'RS.AN', 'subcategory', 'RS.AN-08', 'Incident magnitude is estimated and validated',
      'An incident\'s magnitude is estimated and validated.', 4);

    insertControl.run('RS.CO', fwId, 'RS', 'category', 'RS.CO', 'Incident Response Reporting and Communication',
      'Response activities are coordinated with internal and external stakeholders as required by laws, regulations, or policies.', 3);
    insertControl.run('RS.CO-02', fwId, 'RS.CO', 'subcategory', 'RS.CO-02', 'Internal and external stakeholders are notified of incidents',
      'Internal and external stakeholders are notified of incidents.', 1);
    insertControl.run('RS.CO-03', fwId, 'RS.CO', 'subcategory', 'RS.CO-03', 'Information is shared with designated stakeholders',
      'Information is shared with designated internal and external stakeholders.', 2);

    insertControl.run('RS.MI', fwId, 'RS', 'category', 'RS.MI', 'Incident Mitigation',
      'Activities are performed to prevent expansion of an event and mitigate its effects.', 4);
    insertControl.run('RS.MI-01', fwId, 'RS.MI', 'subcategory', 'RS.MI-01', 'Incidents are contained',
      'Incidents are contained.', 1);
    insertControl.run('RS.MI-02', fwId, 'RS.MI', 'subcategory', 'RS.MI-02', 'Incidents are eradicated',
      'Incidents are eradicated.', 2);

    // ── RC – RECOVER ──────────────────────────────────────────────────────────
    insertControl.run('RC', fwId, null, 'function', 'RC', 'Recover',
      'Assets and operations affected by a cybersecurity incident are restored.', 6);

    insertControl.run('RC.RP', fwId, 'RC', 'category', 'RC.RP', 'Incident Recovery Plan Execution',
      'Restoration activities are performed to ensure operational availability of systems and services affected by cybersecurity incidents.', 1);
    insertControl.run('RC.RP-01', fwId, 'RC.RP', 'subcategory', 'RC.RP-01', 'Recovery portion of incident response plan is executed',
      'The recovery portion of the incident response plan is executed once initiated from the incident response process.', 1);
    insertControl.run('RC.RP-02', fwId, 'RC.RP', 'subcategory', 'RC.RP-02', 'Recovery actions are selected, scoped, and prioritized',
      'Recovery actions are selected, scoped, prioritized, and performed.', 2);
    insertControl.run('RC.RP-03', fwId, 'RC.RP', 'subcategory', 'RC.RP-03', 'Integrity of backups is verified before use in recovery',
      'The integrity of backups and other restoration assets is verified before using them in recovery.', 3);
    insertControl.run('RC.RP-04', fwId, 'RC.RP', 'subcategory', 'RC.RP-04', 'Post-incident operational norms are established',
      'Critical mission functions and cybersecurity risk management are considered to establish post-incident operational norms.', 4);
    insertControl.run('RC.RP-05', fwId, 'RC.RP', 'subcategory', 'RC.RP-05', 'Restored assets are verified and normal status is confirmed',
      'The integrity of restored assets is verified, systems and services are restored, and normal operating status is confirmed.', 5);
    insertControl.run('RC.RP-06', fwId, 'RC.RP', 'subcategory', 'RC.RP-06', 'End of incident recovery is declared',
      'The end of incident recovery is declared based on criteria, and incident-related documentation is completed.', 6);

    insertControl.run('RC.CO', fwId, 'RC', 'category', 'RC.CO', 'Incident Recovery Communication',
      'Restoration activities are coordinated with internal and external parties.', 2);
    insertControl.run('RC.CO-03', fwId, 'RC.CO', 'subcategory', 'RC.CO-03', 'Recovery activities are communicated to stakeholders',
      'Recovery activities and progress in restoring operational capabilities are communicated to designated internal and external stakeholders.', 1);
    insertControl.run('RC.CO-04', fwId, 'RC.CO', 'subcategory', 'RC.CO-04', 'Public updates on recovery are shared',
      'Public updates on the incident and ongoing recovery activities are shared.', 2);

  })();
}

function seedCisControls(db: Database.Database): void {
  const existing = db.prepare('SELECT id FROM frameworks WHERE name = ? AND version = ?').get('CIS Controls', '8.1.2');
  if (existing) return;

  db.transaction(() => {
    const fw = db.prepare(
      `INSERT INTO frameworks (name, version, description) VALUES (?, ?, ?)`
    ).run(
      'CIS Controls',
      '8.1.2',
      'CIS Critical Security Controls v8.1.2 — a prioritized set of safeguards to mitigate the most prevalent cyberattacks, tagged by Implementation Group (IG1-IG3) and mapped to NIST CSF 2.0 functions.'
    );
    const fwId = fw.lastInsertRowid as number;

    const insertControl = db.prepare(
      `INSERT INTO controls (id, framework_id, parent_id, level, code, title, description, sort_order, function_code, min_ig)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    );

    for (const c of CIS_CONTROLS) {
      insertControl.run(`CIS-${c.num}`, fwId, null, 'category', String(c.num), c.title, c.description, c.num, null, null);
    }

    const safeguardIndexInControl = new Map<number, number>();
    for (const s of CIS_SAFEGUARDS) {
      const nextIndex = (safeguardIndexInControl.get(s.control) ?? 0) + 1;
      safeguardIndexInControl.set(s.control, nextIndex);
      insertControl.run(`CIS-${s.code}`, fwId, `CIS-${s.control}`, 'subcategory', s.code, s.title, s.description, nextIndex, s.functionCode, s.minIg);
    }

    const insertCrosswalk = db.prepare(
      `INSERT OR IGNORE INTO cis_nist_crosswalk (safeguard_code, csf_subcategory_code, relationship) VALUES (?, ?, ?)`
    );
    for (const x of CIS_NIST_CROSSWALK) {
      insertCrosswalk.run(x.safeguardCode, x.csfSubcategoryCode, x.relationship);
    }
  })();
}

function backfillNistFunctionCodes(db: Database.Database): void {
  db.exec(`
    UPDATE controls
    SET function_code = (
      SELECT fn.code FROM controls fn
      WHERE fn.id = (SELECT cat.parent_id FROM controls cat WHERE cat.id = controls.parent_id)
    )
    WHERE framework_id = 1 AND level = 'subcategory' AND function_code IS NULL
  `);
}
